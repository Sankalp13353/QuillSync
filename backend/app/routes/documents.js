const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/documents - List recent documents (optionally filtered by workspaceId and folderId)
router.get('/', requireAuth, async (req, res) => {
  const { workspaceId, folderId } = req.query;

  try {
    if (workspaceId) {
      // Check if user is a member of this workspace
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.dbUser.id,
            workspaceId
          }
        }
      });
      if (!membership) {
        return res.status(403).json({ error: 'Access denied to this workspace' });
      }

      const docs = await prisma.document.findMany({
        where: { 
          workspaceId,
          folderId: folderId || null
        },
        include: {
          author: {
            select: { id: true, email: true }
          },
          tags: {
            include: { tag: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });
      return res.json(docs);
    }

    // List recent documents across all workspaces user is a member of
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.dbUser.id }
    });
    const workspaceIds = memberships.map(m => m.workspaceId);

    const docs = await prisma.document.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      },
      include: {
        author: {
          select: { id: true, email: true }
        },
        workspace: {
          select: { id: true, name: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents - Create a new document in a workspace
router.post('/', requireAuth, async (req, res) => {
  const { title, workspaceId, folderId, tagIds } = req.body;
  if (!title || !workspaceId) {
    return res.status(400).json({ error: 'Title and workspaceId are required' });
  }

  try {
    // Check if user is a member of this workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.dbUser.id,
          workspaceId
        }
      }
    });
    if (!membership) {
      return res.status(403).json({ error: 'Access denied to this workspace' });
    }

    const doc = await prisma.document.create({
      data: {
        title,
        workspaceId,
        folderId: folderId || null,
        authorId: req.dbUser.id,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] },
        ...(tagIds && tagIds.length > 0 && {
          tags: {
            create: tagIds.map(tagId => ({ tagId }))
          }
        })
      },
      include: {
        author: {
          select: { id: true, email: true }
        },
        tags: {
          include: { tag: true }
        }
      }
    });

    // Create notifications for other workspace members
    try {
      const otherMembers = await prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          NOT: { userId: req.dbUser.id }
        }
      });

      if (otherMembers.length > 0) {
        await prisma.notification.createMany({
          data: otherMembers.map(m => ({
            userId: m.userId,
            message: `${req.user.email.split('@')[0]} created a new document "${title}"`
          }))
        });
      }
    } catch (notifErr) {
      console.error('Error creating notifications:', notifErr);
    }

    res.status(201).json(doc);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

