const router = require('express').Router();
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
const prisma = require('../../prisma/client');
const { validateFolderName } = require('../utils/validation');

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
    console.error('Error fetching folders:', err);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

// POST /api/folders
router.post('/', requireAuth, async (req, res) => {
  const { name, workspaceId, parentId } = req.body;
  
  if (!name || !workspaceId) {
    return res.status(400).json({ error: 'name and workspaceId are required' });
  }
  
  if (!validateFolderName(name)) {
    return res.status(400).json({ error: 'Folder name must be between 1 and 255 characters' });
  }

  try {
    const canCreate = await hasWorkspaceRole(req.dbUser.id, workspaceId, ['OWNER', 'EDITOR']);
    if (!canCreate) {
      return res.status(403).json({ error: 'Only owners or editors can create folders' });
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
    console.error('Error creating folder:', err);
    res.status(500).json({ error: 'Failed to create folder' });
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

    const canEdit = await hasWorkspaceRole(req.dbUser.id, folder.workspaceId, ['OWNER', 'EDITOR']);
    if (!canEdit) {
      return res.status(403).json({ error: 'Only owners or editors can update folders' });
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
    console.error('Error updating folder:', err);
    res.status(500).json({ error: 'Failed to update folder' });
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

    // Recursively build breadcrumbs with nested includes (more efficient than loop)
    const buildBreadcrumbs = async (folderId) => {
      const f = await prisma.folder.findUnique({
        where: { id: folderId },
        include: {
          parent: true
        }
      });
      if (!f) return [];
      const parentBreadcrumbs = f.parent ? await buildBreadcrumbs(f.parent.id) : [];
      return [...parentBreadcrumbs, { id: f.id, name: f.name }];
    };

    const breadcrumbs = await buildBreadcrumbs(id);
    res.json(breadcrumbs);
  } catch (err) {
    console.error('Error fetching breadcrumbs:', err);
    res.status(500).json({ error: 'Failed to fetch folder breadcrumbs' });
  }
});

// DELETE /api/folders/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id }
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const canDelete = await hasWorkspaceRole(req.dbUser.id, folder.workspaceId, ['OWNER', 'EDITOR']);
    if (!canDelete) {
      return res.status(403).json({ error: 'Only owners or editors can delete folders' });
    }

    // Assuming we don't have cascade delete configured manually for folder -> subfolders/documents
    // For now, if folder has contents, let's reject delete, or implement a recursive delete.
    const subdocs = await prisma.document.count({ where: { folderId: id } });
    const subfolders = await prisma.folder.count({ where: { parentId: id } });
    if (subdocs > 0 || subfolders > 0) {
      return res.status(400).json({ error: 'Cannot delete folder because it is not empty' });
    }

    await prisma.folder.delete({
      where: { id }
    });

    res.json({ message: 'Folder deleted' });
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).json({ error: 'Failed to delete folder' });
  }
});

module.exports = router;
