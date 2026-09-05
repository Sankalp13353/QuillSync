const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration with environment-based origin
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5174'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Set request size limit to 10MB to prevent abuse
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./app/routes/users'));
app.use('/api/workspaces', require('./app/routes/workspaces'));
app.use('/api/documents', require('./app/routes/documents'));
app.use('/api/notifications', require('./app/routes/notifications'));
app.use('/api/comments', require('./app/routes/comments'));
app.use('/api/folders', require('./app/routes/folders'));
app.use('/api/tags', require('./app/routes/tags'));
app.use('/api/drafts', require('./app/routes/drafts'));
app.use('/api/versions', require('./app/routes/versions'));

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
