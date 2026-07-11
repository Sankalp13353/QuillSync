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
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          supabaseId: user.id,
          email: user.email
        }
      });
    }

    req.user = user;
    req.dbUser = dbUser;
    next();
  } catch (dbError) {
    console.error('Error resolving Prisma user:', dbError);
    return res.status(500).json({ error: 'Database error resolving user session' });
  }
};

module.exports = { supabase, requireAuth };

