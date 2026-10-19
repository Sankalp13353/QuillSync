const crypto = require('crypto');
const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const prisma = require('../../prisma/client');
const { requireAuth, hasWorkspaceRole } = require('../middleware/auth');
const { validateRole } = require('../utils/validation');

const INVITATION_DAYS = 7;

const getInvitationUrl = (token) =>
  `${process.env.FRONTEND_URL || 'http://localhost:5174'}/invite/${token}`;

// GET /api/invitations/:token - Read invitation details before login or acceptance
router.get('/:token', async (req, res) => {
  try {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { token: req.params.token },
      include: {
        workspace: { select: { name: true } },
        inviter: { select: { email: true } }
      }
    });

    if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
    if (invitation.status === 'PENDING' && invitation.expiresAt < new Date()) {
      await prisma.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' }
      });
      invitation.status = 'EXPIRED';
    }

    res.json({
      workspaceName: invitation.workspace.name,
      inviterEmail: invitation.inviter.email,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt
    });
  } catch (err) {
    console.error('Error fetching invitation:', err);
    res.status(500).json({ error: 'Failed to fetch invitation' });
  }
});

// POST /api/invitations/:token/accept - Accept an invitation as the invited user
router.post('/:token/accept', requireAuth, async (req, res) => {
  try {
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: { token: req.params.token },
      include: { workspace: true }
    });

    if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
    if (invitation.email !== req.dbUser.email.toLowerCase()) {
      return res.status(403).json({ error: 'This invitation belongs to a different email address' });
    }
    if (invitation.status !== 'PENDING') {
      return res.status(400).json({ error: `Invitation is already ${invitation.status.toLowerCase()}` });
    }
    if (invitation.expiresAt < new Date()) {
      await prisma.workspaceInvitation.update({ where: { id: invitation.id }, data: { status: 'EXPIRED' } });
      return res.status(400).json({ error: 'This invitation has expired' });
    }

    const existingMember = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: req.dbUser.id, workspaceId: invitation.workspaceId } }
    });
    if (existingMember) return res.status(400).json({ error: 'You are already a member of this workspace' });

    await prisma.$transaction([
      prisma.workspaceMember.create({
        data: { userId: req.dbUser.id, workspaceId: invitation.workspaceId, role: invitation.role }
      }),
      prisma.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' }
      }),
      prisma.notification.create({
        data: {
          userId: invitation.inviterId,
          message: `${req.dbUser.email} accepted your invitation to ${invitation.workspace.name}`,
          type: 'INVITATION_ACCEPTED'
        }
      })
    ]);

    res.json({ message: 'Invitation accepted', workspaceId: invitation.workspaceId });
  } catch (err) {
    console.error('Error accepting invitation:', err);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// POST /api/invitations/:token/decline - Decline an invitation as the invited user
router.post('/:token/decline', requireAuth, async (req, res) => {
  try {
    const invitation = await prisma.workspaceInvitation.findUnique({ where: { token: req.params.token } });
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
    if (invitation.email !== req.dbUser.email.toLowerCase()) {
      return res.status(403).json({ error: 'This invitation belongs to a different email address' });
    }
    if (invitation.status !== 'PENDING') return res.status(400).json({ error: 'Invitation is no longer pending' });

    await prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: { status: 'DECLINED' }
    });
    res.json({ message: 'Invitation declined' });
  } catch (err) {
    console.error('Error declining invitation:', err);
    res.status(500).json({ error: 'Failed to decline invitation' });
  }
});

// POST /api/invitations/workspace/:id - Send an invitation email
const sendInvitation = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !role) return res.status(400).json({ error: 'Email and role are required' });
  if (!validateRole(role) || role === 'OWNER') return res.status(400).json({ error: 'Invalid invitation role' });

  try {
    if (!(await hasWorkspaceRole(req.dbUser.id, id, ['OWNER']))) {
      return res.status(403).json({ error: 'Only owners can invite members' });
    }

    const workspace = await prisma.workspace.findUnique({ where: { id }, select: { name: true } });

    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
    const userToInvite = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!userToInvite) return res.status(404).json({ error: 'User must create a QuillSync account before receiving an invitation' });

    const [existingMember, existingInvitation] = await Promise.all([
      prisma.workspaceMember.findUnique({ where: { userId_workspaceId: { userId: userToInvite.id, workspaceId: id } } }),
      prisma.workspaceInvitation.findFirst({ where: { workspaceId: id, email: normalizedEmail, status: 'PENDING' } })
    ]);
    if (existingMember) return res.status(400).json({ error: 'User is already a member' });
    if (existingInvitation) return res.status(400).json({ error: 'A pending invitation already exists for this email' });

    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      return res.status(503).json({ error: 'Email service is not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITATION_DAYS * 24 * 60 * 60 * 1000);
    const invitation = await prisma.workspaceInvitation.create({
      data: { workspaceId: id, inviterId: req.dbUser.id, email: normalizedEmail, role, token, expiresAt }
    });

    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: normalizedEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Invitation to join ${workspace.name} on QuillSync`,
        text: `${req.dbUser.email} invited you to join ${workspace.name} as a ${role.toLowerCase()}. Accept here: ${getInvitationUrl(token)}`,
        html: `<p>${req.dbUser.email} invited you to join <strong>${workspace.name}</strong> as a ${role.toLowerCase()}.</p><p><a href="${getInvitationUrl(token)}">Accept invitation</a></p><p>This invitation expires in ${INVITATION_DAYS} days.</p>`
      });
    } catch (emailError) {
      await prisma.workspaceInvitation.delete({ where: { id: invitation.id } });
      console.error('SendGrid error:', emailError.response?.body || emailError.message);
      return res.status(502).json({ error: 'Invitation could not be sent. Check your SendGrid API key and verified sender email.' });
    }

    await prisma.notification.create({
      data: {
        userId: userToInvite.id,
        message: `${req.dbUser.email} invited you to join ${workspace.name} as a ${role.toLowerCase()}`,
        type: 'WORKSPACE_INVITATION',
        actionUrl: `/invite/${token}`,
        actionLabel: 'View invitation'
      }
    });

    res.status(201).json({ message: 'Invitation sent' });
  } catch (err) {
    console.error('Error sending invitation:', err);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
};

router.post('/workspace/:id', requireAuth, sendInvitation);

module.exports = router;
