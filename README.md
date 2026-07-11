# QuillSync

Collaborative knowledge & documentation platform.

---

## Stack

- **Frontend** — React 19, Vite, Tailwind CSS v4, React Router v7, Supabase
- **Backend** — Node.js, Express 5, Supabase

---

## Project Structure

```
QuillSync/
├── frontend/
│   └── src/
│       ├── components/     # Shared components (ProtectedRoute)
│       ├── context/        # AuthContext
│       ├── pages/          # Dashboard, Landing, Login, Register, ForgotPassword, ResetPassword
│       └── utils/          # supabase.js
└── backend/
    ├── app/
    └── server.js
```

---

## Getting Started

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
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PORT=
```
