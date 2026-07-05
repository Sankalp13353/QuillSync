const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// Supabase Admin Client (for server-side operations)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL') {
  console.error("❌ SUPABASE_URL or SUPABASE_ANON_KEY is not set in .env file!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("✅ Supabase client initialized.");

// ─────────────────────────────────────────
// MIDDLEWARE: Verify JWT token from Supabase
// ─────────────────────────────────────────
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

// ─────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// ─────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────

// Register with email & password
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) throw error;

    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        fullName: data.user?.user_metadata?.full_name,
      },
      session: data.session
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login with email & password
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name,
      },
      session: data.session
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) throw error;
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.user_metadata?.full_name,
    }
  });
});

// Verify OAuth session and return user data
app.post('/api/auth/verify-session', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(access_token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    res.status(200).json({
      message: 'Session verified',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name,
        provider: user.app_metadata?.provider,
      },
      session: {
        access_token,
        user
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Refresh session token
app.post('/api/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    });

    if (error || !data.session) throw error;

    res.status(200).json({
      message: 'Token refreshed',
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name,
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
