const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/folders?workspaceId=XYZ&parentId=ABC
router.get('/', requireAuth, async (req, res) => {
  const { workspaceId, parentId } = req.query;

  if (!workspaceId) {
    return res.status(400).json({ error: 'workspaceId is required' });
  }

  try {
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId } }
    });
    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const folders = await prisma.folder.findMany({
      where: {
        workspaceId,
        parentId: parentId || null
      },
      orderBy: { name: 'asc' }
    });

    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/folders
router.post('/', requireAuth, async (req, res) => {
  const { name, workspaceId, parentId } = req.body;
  if (!name || !workspaceId) {
    return res.status(400).json({ error: 'name and workspaceId are required' });
  }

  try {
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId } }
    });
    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        workspaceId,
        parentId: parentId || null
      }
    });

    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
