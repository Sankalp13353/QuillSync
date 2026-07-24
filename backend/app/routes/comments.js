const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/comments?documentId=xxx
router.get('/', requireAuth, async (req, res) => {
  const { documentId } = req.query;
  if (!documentId) return res.status(400).json({ error: 'documentId is required' });

  try {
    const comments = await prisma.comment.findMany({
      where: { documentId },
      include: { author: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'asc' }
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/comments
router.post('/', requireAuth, async (req, res) => {
  const { documentId, content } = req.body;
  if (!documentId || !content) return res.status(400).json({ error: 'documentId and content are required' });

  try {
    const comment = await prisma.comment.create({
      data: { documentId, content, authorId: req.dbUser.id },
      include: { author: { select: { id: true, email: true } } }
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId !== req.dbUser.id) return res.status(403).json({ error: 'Not allowed' });
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
