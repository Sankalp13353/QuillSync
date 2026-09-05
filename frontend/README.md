# QuillSync — Frontend

React + Vite frontend for the QuillSync collaborative documentation platform.

## Stack

- **React 19** + Vite
- **React Router v7**
- **Axios** — API client with Supabase token interceptor
- **Supabase JS** — auth session management
- **Tiptap** — rich text document editor
- **React Icons**

## Setup

```bash
npm install
npm run dev       # http://localhost:5174
npm run build
npm run preview
```

## Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Structure

```
src/
├── components/
│   ├── Workspace/        # FolderTree, DocumentsPreview, WorkspaceHeader, etc.
│   ├── Editor/           # Tiptap editor wrapper
│   ├── Document/         # DocumentTags
│   ├── Header.jsx        # Global header with notifications + search
│   ├── Sidebar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx   # Supabase session + Prisma user sync
├── pages/
│   ├── Landing/
│   ├── Login/
│   ├── Register/
│   ├── ForgotPassword/
│   ├── ResetPassword/
│   ├── Dashboard/
│   ├── Workspaces/
│   ├── Workspace/
│   │   ├── Home/         # WorkspaceHome — folders, documents, quick actions
│   │   ├── Members/      # Role management
│   │   └── Settings/
│   └── Document/
│       ├── DocumentPage.jsx
│       └── components/   # DocumentEditor, PendingDraftsPanel, VersionHistoryPanel
└── utils/
    ├── api.js            # Axios instance — auto-attaches Bearer token
    └── supabase.js
```

## Routes

| Path | Page | Protected |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/forgot-password` | Forgot Password | No |
| `/reset-password` | Reset Password | No |
| `/dashboard` | Dashboard | Yes |
| `/workspaces` | Workspaces list | Yes |
| `/workspace/:id` | Workspace home | Yes |
| `/workspace/:id/document/:docId` | Document editor | Yes |
| `/workspace/:id/members` | Members | Yes |
| `/workspace/:id/settings` | Settings | Yes |
