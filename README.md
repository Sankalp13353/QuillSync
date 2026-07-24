# QuillSync

Collaborative knowledge & documentation platform.

---

## Stack

- **Frontend** — React 19, Vite, Tailwind CSS v4, React Router v7, Supabase, Axios
- **Backend** — Node.js, Express 5, Supabase, Prisma (PostgreSQL)

---

## Project Features & Integrations

- **Auth System** — Supabase authentication with auto-sync fallback to Prisma database.
- **Workspaces** — Group documents and collaborate. Complete with list, details, and creation API endpoints.
- **Documents** — Create and list documents scoped to workspaces.

---

## Project Structure

```
QuillSync/
├── frontend/
│   └── src/
│       ├── components/     # UI components (Header, Sidebar, Workspace components)
│       ├── context/        # AuthContext
│       ├── pages/          # Dashboard, Workspace Pages, Auth Pages
│       └── utils/          # supabase.js, api.js
└── backend/
    ├── app/                # Express middleware & routes (auth, workspaces, documents)
    ├── prisma/             # Prisma schema, migrations, and seed data
    └── server.js
```

---

## Getting Started

### Database Setup (PostgreSQL)
Ensure you have Docker running (it starts the PostgreSQL DB automatically), then set up Prisma:
```bash
cd backend
npx prisma migrate dev
npm run seed
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

### Both (from root)
```bash
# macOS/Linux
./start-dev.sh

# Windows
start-dev.bat
```

---

## Environment Variables

**frontend/.env**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**backend/.env**
```
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
JWT_SECRET=
DATABASE_URL="postgresql://quillsync:quillsync@localhost:5432/quillsync"
```

