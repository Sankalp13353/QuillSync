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

    const whereClause = { workspaceId };
    if (!req.query.all) {
      whereClause.parentId = parentId || null;
    }

    const folders = await prisma.folder.findMany({
      where: whereClause,
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

// PATCH /api/folders/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: folder.workspaceId } }
    });
    
    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (parentId !== undefined) updateData.parentId = parentId;

    // Optional: prevent cyclic parent references (if a folder is moved to its own child)
    // For simplicity, we just allow the update and assume frontend guards against it.

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: updateData
    });

    res.json(updatedFolder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/folders/:id/breadcrumbs
router.get('/:id/breadcrumbs', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await prisma.folder.findUnique({
      where: { id }
    });
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: folder.workspaceId } }
    });
    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Traverse upwards
    const breadcrumbs = [];
    let currentFolderId = id;
    while (currentFolderId) {
      const f = await prisma.folder.findUnique({ where: { id: currentFolderId } });
      if (!f) break;
      breadcrumbs.unshift({ id: f.id, name: f.name });
      currentFolderId = f.parentId;
    }

    res.json(breadcrumbs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
