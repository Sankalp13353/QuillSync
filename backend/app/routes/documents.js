const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/documents
router.get('/', requireAuth, async (req, res) => {
  res.json({ message: 'documents route — coming soon' });
});

module.exports = router;
