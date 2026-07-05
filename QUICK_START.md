# QuillSync Auth Setup - Quick Checklist

## ✅ Completed Setup

### Backend
- [x] Express server with Supabase integration
- [x] Authentication routes:
  - Email/password register
  - Email/password login
  - OAuth session verification
  - Token refresh
  - Get current user
  - Logout
- [x] JWT token verification middleware
- [x] CORS configured for frontend
- [x] Error handling and validation

### Frontend
- [x] Auth Context for global state management
- [x] Login page with email/password + Google OAuth
- [x] Register page with email/password + Google OAuth
- [x] Protected Route component
- [x] Dashboard page
- [x] Auto-redirect logic:
  - Login/Register → Dashboard (if already logged in)
  - Protected routes → Login (if not authenticated)
  - Dashboard → displays user info

### Development Setup
- [x] Vite config with correct port (5174)
- [x] NPM scripts for running servers
- [x] Bash script for easy startup (macOS/Linux)
- [x] Batch script for Windows users
- [x] Comprehensive setup guides

## 🔧 Before Running - Important Steps

### 1️⃣ Configure Google OAuth in Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to: **Authentication** → **Providers** → **Google**
3. Toggle **Enable Sign in with Google**
4. Keep this window open for the next step

### 2️⃣ Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "QuillSync"
3. Search for and enable **Google+ API**
4. Go to **Credentials** section
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Select **Web Application**
7. Add these **Authorized JavaScript Origins**:
   ```
   http://localhost:5174
   http://localhost:3000
   ```
8. Add these **Authorized Redirect URIs**:
   ```
   http://localhost:5174/auth/callback
   http://localhost:5174/dashboard
   ```
9. Copy the **Client ID** and **Client Secret**

### 3️⃣ Add Credentials to Supabase

1. Back in Supabase Dashboard → Google provider settings
2. Paste:
   - **Client ID** (from Google Console)
   - **Client Secret** (from Google Console)
3. Click **Save**

### 4️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

## 🚀 Running the Application

### Option A: Using Start Script (Recommended)

**macOS/Linux:**
```bash
cd /Users/whitedarkhost/Documents/QuillSync
./start-dev.sh
```

**Windows:**
```bash
cd Documents\QuillSync
start-dev.bat
```

This will open 2 terminal windows:
- Backend on port 5000
- Frontend on port 5174

### Option B: Manual Startup

**Terminal 1 - Backend:**
```bash
cd /Users/whitedarkhost/Documents/QuillSync/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /Users/whitedarkhost/Documents/QuillSync/frontend
npm run dev
```

## ✨ Testing the Complete Flow

### Test Email/Password Registration:
1. Open http://localhost:5174/register
2. Fill in:
   - Full Name: Test User
   - Email: test@yourmail.com
   - Password: TestPass123
3. Click "Create Account"
4. Should redirect to dashboard

### Test Email/Password Login:
1. Go to http://localhost:5174/login
2. Enter:
   - Email: test@yourmail.com
   - Password: TestPass123
3. Click "Login"
4. Should redirect to dashboard

### Test Google OAuth:
1. Go to http://localhost:5174/login or /register
2. Click "Continue with Google"
3. Sign in with your Google account
4. Should redirect to dashboard automatically

### Test Protected Routes:
1. While logged in: http://localhost:5174/dashboard → Shows dashboard
2. After logout: http://localhost:5174/dashboard → Redirects to login
3. Click "Sign Out" button → Logs out and redirects

## 📁 Project Structure

```
QuillSync/
├── backend/
│   ├── server.js              # Express server with auth routes
│   ├── .env                   # Backend environment variables
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── supabase.js
│   │   └── App.jsx
│   ├── .env                   # Frontend environment variables
│   ├── vite.config.js         # Vite config with port 5174
│   └── package.json           # Frontend dependencies
├── start-dev.sh               # macOS/Linux startup script
├── start-dev.bat              # Windows startup script
└── OAUTH_SETUP_GUIDE.md       # Detailed setup documentation
```

## 🐛 Common Issues & Solutions

### Issue: Blank page or error on localhost:5174
- Check browser console (F12) for errors
- Ensure frontend server is running: `npm run dev` in frontend folder
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: CORS error
- Verify backend is running on port 5000
- Check `backend/server.js` CORS configuration
- Frontend must be on `http://localhost:5174`

### Issue: Google login redirects to blank page
- Verify Google OAuth credentials are saved in Supabase
- Check redirect URIs in Google Cloud Console
- Clear browser cookies/localStorage and try again

### Issue: "Email confirmation required" message
- In Supabase Dashboard:
  - Go to **Authentication** → **Policies**
  - Set "Email confirmation" to "Disabled" for development
  - Or check your email for confirmation link

### Issue: User info not showing on dashboard
- Check browser DevTools Network tab for API calls
- Verify Supabase credentials in `.env` files
- Check if user session is properly loaded in AuthContext

## 📞 Support

If you encounter issues:
1. Check the `OAUTH_SETUP_GUIDE.md` for detailed documentation
2. Review browser console errors (F12)
3. Check terminal output for backend/frontend errors
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed: `npm install`

## 🎉 Next Steps

Once auth is working:
1. Create user profiles/settings page
2. Build workspace creation feature
3. Add document/note management
4. Implement real-time collaboration
5. Deploy to production

---

**Last Updated:** 2026-07-05
**Status:** ✅ Ready for OAuth Configuration
