const router = require('express').Router();
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
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
        },
        folder: {
          select: { id: true, name: true }
        },
        tags: {
          include: { tag: true }
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
    const canCreate = await hasWorkspaceRole(req.dbUser.id, workspaceId, ['OWNER', 'EDITOR']);
    if (!canCreate) {
      return res.status(403).json({ error: 'Only owners or editors can create documents' });
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

// GET /api/documents/:id - Get a single document by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.dbUser.id;

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, email: true }
        },
        workspace: true,
        tags: {
          include: { tag: true }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Verify user is a member of the workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: document.workspaceId
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ ...document, myRole: membership.role });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Update a document (e.g. content, title, or tags)
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content, tagIds, folderId } = req.body;
  const userId = req.dbUser.id;

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: { workspace: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const canEdit = await hasWorkspaceRole(userId, document.workspaceId, ['OWNER', 'EDITOR']);
    if (!canEdit) {
      return res.status(403).json({ error: 'Only owners or editors can update documents' });
    }

    // Update document
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (tagIds !== undefined) {
      updateData.tags = {
        deleteMany: {},
        create: tagIds.map(tagId => ({ tagId }))
      };
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, email: true } },
        workspace: true,
        tags: { include: { tag: true } }
      }
    });

    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.dbUser.id;

  try {
    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const canDelete = await hasWorkspaceRole(userId, document.workspaceId, ['OWNER', 'EDITOR']);
    if (!canDelete) {
      return res.status(403).json({ error: 'Only owners or editors can delete documents' });
    }

    await prisma.$transaction([
      prisma.documentTag.deleteMany({ where: { documentId: id } }),
      prisma.comment.deleteMany({ where: { documentId: id } }),
      prisma.document.delete({ where: { id } })
    ]);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;

