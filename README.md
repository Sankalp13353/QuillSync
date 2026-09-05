# QuillSync

Collaborative knowledge & documentation platform.

## Stack

- **Frontend** — React 19, Vite, React Router v7, Supabase, Axios
- **Backend** — Node.js, Express 5, Prisma ORM, PostgreSQL, Supabase Auth

## Features

- Email/password auth with email verification gate
- Google OAuth via Supabase (one account per verified email)
- Prisma user sync on first confirmed login
- Workspaces — create, manage members, role-based access (OWNER/EDITOR/VIEWER/COMMENTOR)
- Folders — organize documents within workspaces
- Documents — Tiptap rich text editor, scoped to folders/workspaces
- Draft/PR flow — EDITORs submit drafts, OWNERs/EDITORs merge or close
- Version history — per-document save history
- Comments/Chat — per-document chat panel
- Notifications — bell dropdown with mark as read
- Unified search across all pages
- Tags — color-coded document tags per workspace

## Project Structure

```
QuillSync/
├── frontend/src/
│   ├── components/       # Header, Sidebar, modals, workspace components
│   ├── context/          # AuthContext (Supabase + Prisma sync)
│   ├── pages/            # Dashboard, Workspaces, Document, Auth, Landing
│   └── utils/            # api.js (axios + auth interceptor), supabase.js
└── backend/
    ├── app/
    │   ├── middleware/   # auth.js — JWT verify, email confirmation gate, Prisma sync
    │   └── routes/       # users, workspaces, documents, folders, comments,
    │                     # notifications, drafts, versions, tags
    ├── prisma/           # schema.prisma, migrations, seed.js
    └── server.js
```

## Setup

Requires Docker running for PostgreSQL.

```bash
# Start postgres container
docker start quillsync-db-1

# Backend
cd backend && npm install && npx prisma generate && npx prisma migrate dev && npm run dev

# Frontend (separate terminal)
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
DATABASE_URL=postgresql://quillsync:quillsync@localhost:5433/quillsync
FRONTEND_URL=http://localhost:5174
```

## Auth Flow

```
Register → Supabase creates unverified user → verification email sent
         → user clicks link → email confirmed
         → Login → backend validates + creates Prisma user → dashboard

Google → Supabase OAuth → confirmed identity → Prisma user created/found → dashboard
```

- One email = one QuillSync account (enforced at DB and middleware level)
- Unverified emails cannot access any protected route
- Duplicate account creation blocked by `supabaseId` and `email` unique constraints

## Supabase Dashboard Requirements

- **Authentication → Email** — "Confirm email" must be **ON**
- **Authentication → URL Configuration** — add `http://localhost:5174` to Site URL and Redirect URLs
- **Authentication → Providers → Google** — enable with your Client ID and Secret
