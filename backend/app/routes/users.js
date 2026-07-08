const router = require('express').Router();
const { supabase, requireAuth } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName)
    return res.status(400).json({ error: 'Email, password, and full name are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.',
      user: { id: data.user?.id, email: data.user?.email, fullName: data.user?.user_metadata?.full_name },
      session: data.session
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.status(200).json({
      message: 'Login successful',
      user: { id: data.user.id, email: data.user.email, fullName: data.user.user_metadata?.full_name },
      session: data.session
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) throw error;
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: { id: req.user.id, email: req.user.email, fullName: req.user.user_metadata?.full_name }
  });
});

router.post('/verify-session', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token)
    return res.status(400).json({ error: 'Access token is required' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    if (error || !user) return res.status(401).json({ error: 'Invalid or expired token' });
    res.status(200).json({
      message: 'Session verified',
      user: { id: user.id, email: user.email, fullName: user.user_metadata?.full_name, provider: user.app_metadata?.provider },
      session: { access_token, user }
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

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
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
