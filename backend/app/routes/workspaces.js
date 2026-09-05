const router = require('express').Router();
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
const prisma = require('../../prisma/client');
const { validateRole } = require('../utils/validation');

// GET /api/workspaces - List workspaces user is a member of
router.get('/', requireAuth, async (req, res) => {
  try {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.dbUser.id },
      include: {
        workspace: {
          include: {
            _count: {
              select: { members: true, documents: true }
            }
          }
        }
      },
      orderBy: {
        workspace: {
          createdAt: 'desc'
        }
      }
    });

    const workspaces = memberships.map(m => ({
      id: m.workspace.id,
      name: m.workspace.name,
      description: m.workspace.description,
      role: m.role,
      members: m.workspace._count.members,
      documentsCount: m.workspace._count.documents,
      createdAt: m.workspace.createdAt
    }));

    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workspaces - Create a new workspace
router.post('/', requireAuth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workspace name is required' });
  }

  try {
    const newWorkspace = await prisma.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: {
          name,
          description: description || '',
          ownerId: req.dbUser.id
        }
      });

      await tx.workspaceMember.create({
        data: {
          userId: req.dbUser.id,
          workspaceId: ws.id,
          role: 'OWNER'
        }
      });

      await tx.folder.create({
        data: {
          name: 'General',
          workspaceId: ws.id
        }
      });

      return ws;
    });

    res.status(201).json(newWorkspace);
  } catch (err) {
    console.error('Error creating workspace:', err);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// GET /api/workspaces/stats - Dashboard KPI data
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: req.dbUser.id }
    });
    const workspaceIds = memberships.map(m => m.workspaceId);

    const [totalDocs, totalWorkspaces, totalMembers] = await Promise.all([
      prisma.document.count({ where: { workspaceId: { in: workspaceIds } } }),
      prisma.workspace.count({ where: { id: { in: workspaceIds } } }),
      prisma.workspaceMember.count({ where: { workspaceId: { in: workspaceIds } } })
    ]);

    res.json({ totalDocuments: totalDocs, totalWorkspaces, totalMembers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workspaces/:id - Get detailed workspace info
router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.dbUser.id,
          workspaceId: id
        }
      },
      include: {
        workspace: {
          include: {
            owner: {
              select: { id: true, email: true }
            },
            members: {
              include: {
                user: {
                  select: { id: true, email: true }
                }
              }
            }
          }
        }
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied to this workspace' });
    }

    res.json({
      id: membership.workspace.id,
      name: membership.workspace.name,
      description: membership.workspace.description,
      createdAt: membership.workspace.createdAt,
      owner: membership.workspace.owner,
      myRole: membership.role,
      members: membership.workspace.members.map(m => ({
        id: m.user.id,
        email: m.user.email,
        role: m.role
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/workspaces/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: id } }
    });
    if (!membership || membership.role !== 'OWNER') return res.status(403).json({ error: 'Only owners can update this workspace' });
    const updated = await prisma.workspace.update({ where: { id }, data: { name, description } });
    res.json(updated);
  } catch (err) {
    console.error('Error fetching workspace:', err);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// DELETE /api/workspaces/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: id } }
    });
    if (!membership || membership.role !== 'OWNER') return res.status(403).json({ error: 'Only owners can delete this workspace' });
    await prisma.$transaction([
      prisma.documentTag.deleteMany({ where: { document: { workspaceId: id } } }),
      prisma.comment.deleteMany({ where: { document: { workspaceId: id } } }),
      prisma.documentVersion.deleteMany({ where: { document: { workspaceId: id } } }),
      prisma.documentDraft.deleteMany({ where: { document: { workspaceId: id } } }),
      prisma.document.deleteMany({ where: { workspaceId: id } }),
      prisma.tag.deleteMany({ where: { workspaceId: id } }),
      prisma.workspaceMember.deleteMany({ where: { workspaceId: id } }),
      prisma.workspace.delete({ where: { id } })
    ]);
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    console.error('Error updating workspace:', err);
    res.status(500).json({ error: 'Failed to update workspace' });
  }
});



// POST /api/workspaces/:id/members - Invite a member by email
router.post('/:id/members', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ error: 'Email and role are required' });

  try {
    const isOwner = await hasWorkspaceRole(req.dbUser.id, id, ['OWNER']);
    if (!isOwner) return res.status(403).json({ error: 'Only owners can invite members' });

    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) return res.status(404).json({ error: 'User with this email not found' });

    const existingMember = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: userToInvite.id, workspaceId: id } }
    });
    if (existingMember) return res.status(400).json({ error: 'User is already a member' });

    const newMember = await prisma.workspaceMember.create({
      data: { userId: userToInvite.id, workspaceId: id, role }
    });
    res.json(newMember);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member to workspace' });
  }
});

// PATCH /api/workspaces/:id/members/:userId - Update member role
router.patch('/:id/members/:userId', requireAuth, async (req, res) => {
  const { id, userId } = req.params;
  const { role } = req.body;
  
  if (!role) return res.status(400).json({ error: 'Role is required' });
  
  if (!validateRole(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be one of: OWNER, EDITOR, COMMENTOR, VIEWER' });
  }

  try {
    console.log(`[PATCH /workspaces/${id}/members/${userId}] Updating role to ${role} by ${req.dbUser.id}`);
    const isOwner = await hasWorkspaceRole(req.dbUser.id, id, ['OWNER']);
    if (!isOwner) {
      console.log('Not owner');
      return res.status(403).json({ error: 'Only owners can update member roles' });
    }

    if (userId === req.dbUser.id) {
      console.log('Cannot change own role');
      return res.status(400).json({ error: 'Cannot change your own role this way' });
    }

    const updated = await prisma.workspaceMember.update({
      where: { userId_workspaceId: { userId, workspaceId: id } },
      data: { role }
    });
    console.log('Update success');
    res.json(updated);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Failed to update member role' });
  }
});

// DELETE /api/workspaces/:id/members/:userId - Remove member
router.delete('/:id/members/:userId', requireAuth, async (req, res) => {
  const { id, userId } = req.params;
  try {
    const isOwner = await hasWorkspaceRole(req.dbUser.id, id, ['OWNER']);
    if (!isOwner) return res.status(403).json({ error: 'Only owners can remove members' });

    if (userId === req.dbUser.id) return res.status(400).json({ error: 'Cannot remove yourself' });

    await prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId, workspaceId: id } }
    });
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Failed to remove member from workspace' });
  }
});

router.post('/:id/transfer-ownership', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { targetUserId } = req.body;
  if (!targetUserId) return res.status(400).json({ error: 'Target user ID is required' });

  try {
    const isOwner = await hasWorkspaceRole(req.dbUser.id, id, ['OWNER']);
    if (!isOwner) return res.status(403).json({ error: 'Only owners can transfer ownership' });

    if (targetUserId === req.dbUser.id) return res.status(400).json({ error: 'Cannot transfer ownership to yourself' });

    const targetMember = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId: id } }
    });
    if (!targetMember) return res.status(404).json({ error: 'Target user is not a member of this workspace' });

    await prisma.$transaction([
      prisma.workspace.update({
        where: { id },
        data: { ownerId: targetUserId }
      }),
      prisma.workspaceMember.update({
        where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: id } },
        data: { role: 'EDITOR' }
      }),
      prisma.workspaceMember.update({
        where: { userId_workspaceId: { userId: targetUserId, workspaceId: id } },
        data: { role: 'OWNER' }
      })
    ]);

    res.json({ message: 'Ownership transferred successfully' });
  } catch (err) {
    console.error('Error transferring ownership:', err);
    res.status(500).json({ error: 'Failed to transfer ownership' });
  }
});

module.exports = router;
