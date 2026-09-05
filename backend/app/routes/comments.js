const router = require('express').Router();
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
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
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments
router.post('/', requireAuth, async (req, res) => {
  const { documentId, content } = req.body;
  if (!documentId || !content) return res.status(400).json({ error: 'documentId and content are required' });

  try {
    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const canComment = await hasWorkspaceRole(req.dbUser.id, document.workspaceId, ['OWNER', 'EDITOR', 'COMMENTOR']);
    if (!canComment) return res.status(403).json({ error: 'Only owners, editors, or commentors can post comments' });

    const comment = await prisma.comment.create({
      data: { documentId, content, authorId: req.dbUser.id },
      include: { author: { select: { id: true, email: true } } }
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    const document = await prisma.document.findUnique({ where: { id: comment.documentId } });
    const isOwner = await hasWorkspaceRole(req.dbUser.id, document.workspaceId, ['OWNER']);
    
    if (comment.authorId !== req.dbUser.id && !isOwner) {
      return res.status(403).json({ error: 'Not allowed to delete this comment' });
    }
    
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
