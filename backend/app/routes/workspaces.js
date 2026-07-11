const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/workspaces
router.get('/', requireAuth, async (req, res) => {
  res.json({ message: 'workspaces route — coming soon' });
});

module.exports = router;
