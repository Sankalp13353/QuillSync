const router = require('express').Router();
const { supabase, requireAuth } = require('../middleware/auth');
const prisma = require('../../prisma/client');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'Email, password, and full name are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if a Prisma user already exists with this email before attempting Supabase signup
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: 'An account already exists with this email.' });
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login`
      }
    });

    if (error) throw error;

    // Prisma user is NOT created here — created on first confirmed login
    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account before logging in.',
      session: null
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(400).json({ error: 'Failed to register. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (error) {
      // Supabase returns "Invalid login credentials" for both wrong password and non-existent email
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!data.user.email_confirmed_at) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Upsert Prisma user on confirmed login
    let dbUser = await prisma.user.findUnique({ where: { supabaseId: data.user.id } });
    if (!dbUser) {
      const existingByEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingByEmail) {
        return res.status(409).json({ error: 'An account already exists with this email. Please use your original sign-in method.' });
      }
      try {
        dbUser = await prisma.user.create({ data: { supabaseId: data.user.id, email: normalizedEmail } });
      } catch (createErr) {
        if (createErr.code === 'P2002') {
          dbUser = await prisma.user.findUnique({ where: { supabaseId: data.user.id } })
            || await prisma.user.findUnique({ where: { email: normalizedEmail } });
        } else {
          throw createErr;
        }
      }
    }

    res.status(200).json({
      message: 'Login successful',
      user: { id: data.user.id, email: data.user.email, fullName: data.user.user_metadata?.full_name },
      session: data.session
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/me — returns Prisma user (requireAuth handles sync/creation)
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.dbUser.id,
      email: req.dbUser.email,
      fullName: req.user.user_metadata?.full_name
    }
  });
});

// POST /api/auth/verify-session
router.post('/verify-session', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token)
    return res.status(400).json({ error: 'Access token is required' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' });
    res.status(200).json({
      message: 'Session verified',
      user: { id: user.id, email: user.email, fullName: user.user_metadata?.full_name, provider: user.app_metadata?.provider }
    });
  } catch (err) {
    console.error('Error verifying session:', err);
    res.status(401).json({ error: 'Failed to verify session' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token)
    return res.status(400).json({ error: 'Refresh token is required' });

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    if (error || !data.session) throw error;
    res.status(200).json({
      message: 'Token refreshed',
      session: data.session,
      user: { id: data.user.id, email: data.user.email, fullName: data.user.user_metadata?.full_name }
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

module.exports = router;
