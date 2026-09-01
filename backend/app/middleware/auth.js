const { createClient } = require('@supabase/supabase-js');
const prisma = require('../../prisma/client');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    // Block unconfirmed email/password users
    if (user.app_metadata?.provider === 'email' && !user.email_confirmed_at) {
      return res.status(403).json({ error: 'Please verify your email before accessing QuillSync.' });
    }

    const email = user.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: 'Authenticated user does not have an email address.' });
    }

    let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });

    if (!dbUser) {
      // Check if this email already belongs to a different Prisma user
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        return res.status(409).json({ error: 'An account already exists with this email. Please use your original sign-in method.' });
      }

      try {
        dbUser = await prisma.user.create({ data: { supabaseId: user.id, email } });
      } catch (createErr) {
        // Handle race condition: another request created the user between our check and create
        if (createErr.code === 'P2002') {
          dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } })
            || await prisma.user.findUnique({ where: { email } });
          if (!dbUser) return res.status(500).json({ error: 'Database error resolving user session' });
        } else {
          throw createErr;
        }
      }
    }

    req.user = user;
    req.dbUser = dbUser;
    next();
  } catch (dbError) {
    console.error('Error resolving Prisma user:', dbError);
    return res.status(500).json({ error: 'Database error resolving user session' });
  }
};

const hasWorkspaceRole = async (userId, workspaceId, allowedRoles) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } }
  });
  return membership && allowedRoles.includes(membership.role);
};

module.exports = { supabase, requireAuth, hasWorkspaceRole };
