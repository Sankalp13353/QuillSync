const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL') {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log("Supabase client initialized.");
} else {
  console.warn("⚠️ Missing or default SUPABASE_URL/SUPABASE_ANON_KEY in .env file. Auth will not work until configured.");
}

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  
  if (!supabase) return res.status(500).json({ error: "Supabase is not configured on the server." });

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) throw error;
    res.status(201).json({ message: "Registration successful", user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!supabase) return res.status(500).json({ error: "Supabase is not configured on the server." });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    res.status(200).json({ message: "Login successful", session: data.session });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
