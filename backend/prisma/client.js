const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Retrieve connection string from environment, fallback to local docker compose postgres URL
const connectionString = process.env.DATABASE_URL || 'postgresql://quillsync:quillsync@localhost:5432/quillsync';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;

