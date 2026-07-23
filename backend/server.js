const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./app/routes/users'));
app.use('/api/workspaces', require('./app/routes/workspaces'));
app.use('/api/documents', require('./app/routes/documents'));
app.use('/api/notifications', require('./app/routes/notifications'));
app.use('/api/comments', require('./app/routes/comments'));
app.use('/api/drafts', require('./app/routes/drafts'));
app.use('/api/versions', require('./app/routes/versions'));

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));

