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
- Notifications — bell dropdown with actionable workspace invitations
- Workspace invitations — SendGrid email invitations with accept/decline flow and status notifications
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
    │                     # notifications, invitations, drafts, versions, tags
    ├── prisma/           # schema.prisma, migrations, seed.js
    └── server.js
```

## Setup

The backend and PostgreSQL run locally; Docker is not required. Install
PostgreSQL 16 if needed, then start the local service on macOS with Homebrew:

```bash
brew install postgresql@16 # one-time install
brew services start postgresql@16
```

If the `quillsync` PostgreSQL role and database do not already exist, create
them once:

```bash
psql -d postgres -c "CREATE ROLE quillsync LOGIN PASSWORD 'quillsync';"
createdb -O quillsync quillsync
```

Ensure `backend/.env` points to local PostgreSQL:

```env
DATABASE_URL=postgresql://quillsync:quillsync@localhost:5432/quillsync
```

Start the backend from a terminal:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API is available at `http://localhost:5001`. In a separate terminal,
start the frontend:

```bash
cd frontend
npm install
npm run dev
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
DATABASE_URL=postgresql://quillsync:quillsync@localhost:5432/quillsync
FRONTEND_URL=http://localhost:5174
SENDGRID_API_KEY=SG_your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender@example.com
```

### SendGrid Setup

Workspace invitations are sent through SendGrid. Before using the invite feature:

1. Create a SendGrid account and verify a sender identity under **Settings → Sender Authentication → Verify a Single Sender**.
2. Create an API key under **Settings → API Keys** with **Mail Send: Full Access**. Leave Billing, Security, Mail Settings, and API Keys access disabled.
3. Set `SENDGRID_API_KEY` to the generated key and set `SENDGRID_FROM_EMAIL` to the exact verified sender email address.
4. Restart the backend after changing `backend/.env`:

```bash
cd backend
npm run dev
```

Never place `SENDGRID_API_KEY` in `frontend/.env` or commit it to source control.

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
