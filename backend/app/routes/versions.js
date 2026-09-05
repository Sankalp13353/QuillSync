const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/versions?documentId=
router.get('/', requireAuth, async (req, res) => {
  const { documentId } = req.query;
  if (!documentId) return res.status(400).json({ error: 'documentId required' });
  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: doc.workspaceId } }
    });
    if (!membership) return res.status(403).json({ error: 'Access denied' });

    const versions = await prisma.documentVersion.findMany({
      where: { documentId },
      include: { author: { select: { id: true, email: true } } },
      orderBy: { version: 'desc' }
    });
    res.json(versions);
  } catch (err) {
    console.error('Error fetching versions:', err);
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});

module.exports = router;
