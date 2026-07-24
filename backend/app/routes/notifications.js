const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/notifications - Get all notifications for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notifications/:id/read - Mark a notification as read
router.put('/:id/read', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId: req.dbUser.id
      },
      data: { read: true }
    });
    res.json({ message: 'Notification marked as read', updated: notification.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
