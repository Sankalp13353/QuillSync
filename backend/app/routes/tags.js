const router = require('express').Router();
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// GET /api/tags?workspaceId=XYZ
router.get('/', requireAuth, async (req, res) => {
  const { workspaceId } = req.query;

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

    const tags = await prisma.tag.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' }
    });

    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tags
router.post('/', requireAuth, async (req, res) => {
  const { name, color, workspaceId } = req.body;
  if (!name || !workspaceId) {
    return res.status(400).json({ error: 'name and workspaceId are required' });
  }

  try {
    const canCreate = await hasWorkspaceRole(req.dbUser.id, workspaceId, ['OWNER', 'EDITOR']);
    if (!canCreate) {
      return res.status(403).json({ error: 'Only owners or editors can create tags' });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#94a3b8',
        workspaceId
      }
    });

    res.status(201).json(tag);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'A label with this name already exists in this workspace' });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tags/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    const canDelete = await hasWorkspaceRole(req.dbUser.id, tag.workspaceId, ['OWNER', 'EDITOR']);
    if (!canDelete) {
      return res.status(403).json({ error: 'Only owners or editors can delete tags' });
    }

    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
