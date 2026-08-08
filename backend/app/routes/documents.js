const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/client');
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');

// GET /api/documents - Get all documents
router.get('/', requireAuth, async (req, res) => {
  try {
    const { workspaceId, folderId, all } = req.query;

    let where = {
      workspace: {
        members: { some: { userId: req.dbUser.id } }
      }
    };

    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    if (folderId !== undefined) {
      if (folderId === 'null' || folderId === '') {
        where.folderId = null;
      } else {
        where.folderId = folderId;
      }
    } else if (workspaceId && all !== 'true') {
      where.folderId = null; // Default to root documents if workspaceId is given but folderId is not
    }

    const docs = await prisma.document.findMany({
      where,
      include: {
        author: { select: { id: true, email: true } },
        workspace: { select: { id: true, name: true } },
        folder: { select: { id: true, name: true } },
        tags: { include: { tag: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/documents - Create a new document in a workspace
router.post('/', requireAuth, async (req, res) => {
  const { title, workspaceId, folderId, tagIds } = req.body;
  if (!title || !workspaceId || !folderId) return res.status(400).json({ error: 'Title, workspaceId, and folderId are required. Documents must belong to a folder.' });

  try {
    const canCreate = await hasWorkspaceRole(req.dbUser.id, workspaceId, ['OWNER', 'EDITOR']);
    if (!canCreate) return res.status(403).json({ error: 'Only owners or editors can create documents' });

    const doc = await prisma.document.create({
      data: {
        title,
        workspaceId,
        folderId: folderId,
        authorId: req.dbUser.id,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] },
        ...(tagIds && tagIds.length > 0 && { tags: { create: tagIds.map(tagId => ({ tagId })) } })
      },
      include: {
        author: { select: { id: true, email: true } },
        tags: { include: { tag: true } }
      }
    });

    try {
      const otherMembers = await prisma.workspaceMember.findMany({
        where: { workspaceId, NOT: { userId: req.dbUser.id } }
      });
      if (otherMembers.length > 0) {
        await prisma.notification.createMany({
          data: otherMembers.map(m => ({
            userId: m.userId,
            message: `${req.user.email.split('@')[0]} created a new document "${title}"`
          }))
        });
      }
    } catch (notifErr) { console.error('Error creating notifications:', notifErr); }

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/documents/:id - Get a single document by ID
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, email: true } },
        workspace: true,
        tags: { include: { tag: true } }
      }
    });

    if (!document) return res.status(404).json({ error: 'Document not found' });

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: document.workspaceId } }
    });

    if (!membership) return res.status(403).json({ error: 'Access denied' });

    res.json({ ...document, myRole: membership.role });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// PATCH /api/documents/:id - Update document
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content, tagIds, folderId } = req.body;
  try {
    const document = await prisma.document.findUnique({ where: { id }, include: { workspace: true } });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: document.workspaceId } }
    });

    if (!membership || !['OWNER', 'EDITOR'].includes(membership.role)) {
      return res.status(403).json({ error: 'Only OWNER or EDITOR can directly save' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (tagIds !== undefined) {
      updateData.tags = { deleteMany: {}, create: tagIds.map(tagId => ({ tagId })) };
    }

    // Creating document version if content is provided
    let latestVersion = 0;
    if (content !== undefined) {
      const latest = await prisma.documentVersion.findFirst({
        where: { documentId: document.id },
        orderBy: { version: 'desc' }
      });
      latestVersion = (latest?.version ?? 0) + 1;
    }

    const transaction = [
      prisma.document.update({
        where: { id },
        data: updateData,
        include: {
          author: { select: { id: true, email: true } },
          workspace: true,
          tags: { include: { tag: true } }
        }
      })
    ];

    if (content !== undefined) {
      transaction.push(prisma.documentVersion.create({
        data: { documentId: document.id, version: latestVersion, content, createdBy: req.dbUser.id }
      }));
    }

    const [updatedDocument] = await prisma.$transaction(transaction);
    res.json({ ...updatedDocument, version: latestVersion });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const canDelete = await hasWorkspaceRole(req.dbUser.id, document.workspaceId, ['OWNER', 'EDITOR']);
    if (!canDelete) return res.status(403).json({ error: 'Only owners or editors can delete documents' });

    await prisma.$transaction([
      prisma.documentTag.deleteMany({ where: { documentId: id } }),
      prisma.comment.deleteMany({ where: { documentId: id } }),
      prisma.documentVersion.deleteMany({ where: { documentId: id } }),
      prisma.documentDraft.deleteMany({ where: { documentId: id } }),
      prisma.document.delete({ where: { id } })
    ]);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
