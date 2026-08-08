# QuillSync

Collaborative knowledge & documentation platform.

## Stack

- **Frontend** — React 19, Vite, React Router v7, Supabase, Axios
- **Backend** — Node.js, Express 5, Prisma (PostgreSQL), Supabase Auth

## Features

- Supabase auth with Prisma user sync
- Workspaces — create, manage members, settings
- Documents — scoped to workspaces, clickable from dashboard
- Comments/Chat — per-document real-time style chat panel
- Notifications — bell dropdown with mark as read
- Unified search across all pages

## Project Structure

```
QuillSync/
├── frontend/src/
│   ├── components/   # Header, Sidebar, modals
│   ├── context/      # AuthContext
│   ├── pages/        # Dashboard, Workspaces, Document, Auth
│   └── utils/        # api.js, supabase.js
└── backend/
    ├── app/
    │   ├── middleware/   # auth.js (JWT verify + Prisma user sync)
    │   └── routes/       # workspaces, documents, comments, notifications, users
    ├── prisma/           # schema, migrations, seed
    └── server.js
```

## Setup

Requires Docker running (starts PostgreSQL automatically).

```bash
# From root
./start-dev.sh        # macOS/Linux
start-dev.bat         # Windows
```

Or manually:

```bash
cd backend && npm install && npx prisma migrate dev && npm run seed && npm run dev
cd frontend && npm install && npm run dev
```

## Environment Variables

**frontend/.env**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**backend/.env**
```
PORT=5001
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
DATABASE_URL=postgresql://quillsync:quillsync@localhost:5432/quillsync
```
