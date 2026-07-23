const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/documents - List recent documents (optionally filtered by workspaceId)
router.get('/', requireAuth, async (req, res) => {
  const { workspaceId } = req.query;

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
        where: { workspaceId },
        include: {
          author: {
            select: { id: true, email: true }
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
  const { title, workspaceId } = req.body;
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
        authorId: req.dbUser.id,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] }
      },
      include: {
        author: {
          select: { id: true, email: true }
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

// PATCH /api/documents/:id — OWNER/MANAGER direct save (creates a new version)
router.patch('/:id', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'content required' });
  try {
    const doc = await prisma.document.findUnique({ where: { id: req.params.id } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: doc.workspaceId } }
    });
    if (!membership || !['OWNER', 'MANAGER'].includes(membership.role))
      return res.status(403).json({ error: 'Only OWNER or MANAGER can directly save' });

    const latest = await prisma.documentVersion.findFirst({
      where: { documentId: doc.id },
      orderBy: { version: 'desc' }
    });
    const nextVersion = (latest?.version ?? 0) + 1;

    const [updated] = await prisma.$transaction([
      prisma.document.update({ where: { id: doc.id }, data: { content } }),
      prisma.documentVersion.create({
        data: { documentId: doc.id, version: nextVersion, content, createdBy: req.dbUser.id }
      })
    ]);

    res.json({ ...updated, version: nextVersion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

