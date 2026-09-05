const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');
const { getEmailUsername } = require('../utils/validation');

const canManage = (role) => ['OWNER', 'COMMENTOR'].includes(role);

const getMembership = async (userId, workspaceId) =>
  prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } }
  });

// GET /api/drafts?documentId=
router.get('/', requireAuth, async (req, res) => {
  const { documentId } = req.query;
  if (!documentId) return res.status(400).json({ error: 'documentId required' });
  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const membership = await getMembership(req.dbUser.id, doc.workspaceId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const where = canManage(membership.role)
      ? { documentId }
      : { documentId, authorId: req.dbUser.id };

    const drafts = await prisma.documentDraft.findMany({
      where,
      include: { author: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(drafts);
  } catch (err) {
    console.error('Error fetching drafts:', err);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

// POST /api/drafts — EDITOR submits a draft
router.post('/', requireAuth, async (req, res) => {
  const { documentId, content } = req.body;
  if (!documentId || !content) return res.status(400).json({ error: 'documentId and content required' });
  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const membership = await getMembership(req.dbUser.id, doc.workspaceId);
    if (!membership) return res.status(403).json({ error: 'Access denied' });
    if (membership.role === 'VIEWER') return res.status(403).json({ error: 'Viewers cannot submit drafts' });

    const draft = await prisma.documentDraft.create({
      data: { documentId, authorId: req.dbUser.id, content },
      include: { author: { select: { id: true, email: true } } }
    });

    // Notify managers/owners
    const managers = await prisma.workspaceMember.findMany({
      where: { workspaceId: doc.workspaceId, role: { in: ['OWNER', 'COMMENTOR'] } }
    });
    if (managers.length > 0) {
      await prisma.notification.createMany({
        data: managers.map(m => ({
          userId: m.userId,
          message: `${getEmailUsername(req.dbUser.email)} submitted a draft for review on \"${doc.title}\"`
        }))
      });
    }

    res.status(201).json(draft);
  } catch (err) {
    console.error('Error creating draft:', err);
    res.status(500).json({ error: 'Failed to submit draft' });
  }
});

// POST /api/drafts/:id/merge — MANAGER/OWNER merges draft
router.post('/:id/merge', requireAuth, async (req, res) => {
  try {
    const draft = await prisma.documentDraft.findUnique({
      where: { id: req.params.id },
      include: { document: true }
    });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    if (draft.status !== 'OPEN') return res.status(400).json({ error: 'Draft is not open' });

    const membership = await getMembership(req.dbUser.id, draft.document.workspaceId);
    if (!membership || !canManage(membership.role)) return res.status(403).json({ error: 'Only COMMENTOR or OWNER can merge' });

    // Get latest version number
    const latest = await prisma.documentVersion.findFirst({
      where: { documentId: draft.documentId },
      orderBy: { version: 'desc' }
    });
    const nextVersion = (latest?.version ?? 0) + 1;

    // Save current content as a version, then append draft content
    const currentDoc = draft.document;
    const currentBlocks = currentDoc.content?.content ?? [];
    const draftBlocks = draft.content?.content ?? [];
    const mergedContent = {
      type: 'doc',
      content: [...currentBlocks, ...draftBlocks]
    };

    const [updatedDoc] = await prisma.$transaction([
      prisma.document.update({
        where: { id: draft.documentId },
        data: { content: mergedContent }
      }),
      prisma.documentVersion.create({
        data: {
          documentId: draft.documentId,
          version: nextVersion,
          content: mergedContent,
          createdBy: req.dbUser.id
        }
      }),
      prisma.documentDraft.update({
        where: { id: draft.id },
        data: { status: 'MERGED' }
      }),
      prisma.notification.create({
        data: {
          userId: draft.authorId,
          message: `Your draft was merged into "${currentDoc.title}" (v${nextVersion})`
        }
      })
    ]);

    res.json({ message: 'Draft merged', version: nextVersion });
  } catch (err) {
    console.error('Error merging draft:', err);
    res.status(500).json({ error: 'Failed to merge draft' });
  }
});

// POST /api/drafts/:id/close — MANAGER/OWNER closes/rejects draft
router.post('/:id/close', requireAuth, async (req, res) => {
  try {
    const draft = await prisma.documentDraft.findUnique({
      where: { id: req.params.id },
      include: { document: true }
    });
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    if (draft.status !== 'OPEN') return res.status(400).json({ error: 'Draft is not open' });

    const membership = await getMembership(req.dbUser.id, draft.document.workspaceId);
    if (!membership || !canManage(membership.role)) return res.status(403).json({ error: 'Only COMMENTOR or OWNER can close drafts' });

    await prisma.$transaction([
      prisma.documentDraft.update({ where: { id: draft.id }, data: { status: 'CLOSED' } }),
      prisma.notification.create({
        data: {
          userId: draft.authorId,
          message: `Your draft on "${draft.document.title}" was closed`
        }
      })
    ]);

    res.json({ message: 'Draft closed' });
  } catch (err) {
    console.error('Error closing draft:', err);
    res.status(500).json({ error: 'Failed to close draft' });
  }
});

module.exports = router;
