# QuillSync OAuth & Authentication Setup Guide

## ✅ What's Been Set Up

1. **Backend Authentication Routes**
   - `POST /api/auth/register` - Email/password registration
   - `POST /api/auth/login` - Email/password login
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth/me` - Get current user (protected)
   - `POST /api/auth/verify-session` - OAuth session verification
   - `POST /api/auth/refresh` - Token refresh

2. **Frontend Authentication**
   - Auth Context for global state management
   - Login Page with email/password + Google OAuth
   - Register Page with email/password + Google OAuth
   - Protected Route component for dashboard access
   - Dashboard Page accessible after login
   - Auto-redirect to dashboard on successful auth

3. **Supabase Configuration**
   - Supabase client initialized in both frontend and backend
   - JWT token verification middleware
   - Email/password authentication
   - Google OAuth support

## 🔧 Google OAuth Setup (Supabase)

### Step 1: Configure Google OAuth in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your QuillSync project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to configure
5. Toggle **Enable Sign in with Google**

### Step 2: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add **Authorized JavaScript Origins**:
   ```
   http://localhost:5174
   http://localhost:3000 (if using production domain)
   ```
7. Add **Authorized Redirect URIs**:
   ```
   http://localhost:5174/auth/callback
   http://localhost:5174/dashboard
   ```
8. Copy **Client ID** and **Client Secret**

### Step 3: Add Google Credentials to Supabase

1. In Supabase → Authentication → Providers → Google
2. Paste the **Client ID** and **Client Secret** from Google Cloud
3. Click **Save**

## 🚀 Running the Application

### Terminal 1: Start Backend Server

```bash
cd /Users/whitedarkhost/Documents/QuillSync/backend
npm install  # If not already done
npm start
```

Expected output:
```
✅ Supabase client initialized.
🚀 Server running on http://localhost:5000
```

### Terminal 2: Start Frontend Dev Server

```bash
cd /Users/whitedarkhost/Documents/QuillSync/frontend
npm install  # If not already done
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
```

## ✨ Testing the Auth Flow

### Test 1: Email/Password Registration
1. Open http://localhost:5174
2. Click on Register
3. Fill in details:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPass123
4. Click "Create Account"
5. **Expected**: Redirect to dashboard (or confirmation email needed)

### Test 2: Email/Password Login
1. Go to http://localhost:5174/login
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPass123
3. Click "Login"
4. **Expected**: Redirect to dashboard

### Test 3: Google OAuth Login
1. Go to http://localhost:5174/login (or /register)
2. Click "Continue with Google"
3. Sign in with your Google account
4. **Expected**: Redirect to dashboard and auto-logged in

### Test 4: Protected Route
1. While logged in, navigate to http://localhost:5174/dashboard
2. **Expected**: Dashboard loads successfully
3. Log out using the logout button
4. Navigate to http://localhost:5174/dashboard
5. **Expected**: Redirected to login page

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
SUPABASE_URL=https://vbzkqsrddzmigrtvnqef.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=j9CD/Ti4Xx+4zIDV9ah0SQ3A7vWP1dFRe+6hmhwHo9QmPirMWbbh9nh9DuJ0lAbOC...
```

### Frontend (.env)
```
VITE_SUPABASE_URL=https://vbzkqsrddzmigrtvnqef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 API Endpoints Reference

### Authentication Endpoints

**Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Verify Session (OAuth)**
```bash
POST /api/auth/verify-session
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get Current User**
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Logout**
```bash
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🐛 Troubleshooting

### Issue: "Invalid or expired token" on OAuth callback
- **Solution**: Verify the redirect URI in Google Cloud Console matches `http://localhost:5174/dashboard`
- Check Supabase Google provider is enabled

### Issue: CORS error when logging in
- **Solution**: Ensure backend is running on port 5000
- Check CORS configuration in `backend/server.js`
- Frontend must be on `http://localhost:5174`

### Issue: Page doesn't redirect to dashboard after login
- **Solution**: Check browser console for errors
- Verify AuthContext is properly detecting session changes
- Clear browser localStorage and try again

### Issue: "Email confirmation is required"
- **Solution**: In Supabase Dashboard:
  - Go to Authentication → Policies
  - Set "Email confirmation" to "Disabled" for development
  - Or check your email for confirmation link

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth Setup](https://supabase.com/docs/guides/auth/oauth2#sign-in-with-google)
- [React Router DOM](https://reactrouter.com/)
- [Express.js Documentation](https://expressjs.com/)

## ✅ Feature Checklist

- [x] Email/Password Registration
- [x] Email/Password Login
- [x] Google OAuth Support
- [x] Session Management
- [x] Protected Routes (Dashboard)
- [x] Auto-redirect to Dashboard on Login
- [x] Auto-redirect to Login on Logout
- [x] User Info Display on Dashboard
- [x] Logout Functionality
- [x] Backend Auth Middleware
- [x] Token Verification
- [x] Session Refresh

## 🚀 Next Steps

1. Configure Google OAuth following the steps above
2. Test the authentication flow
3. Customize user profile data as needed
4. Implement additional features (user workspace creation, etc.)
5. Deploy to production with proper environment variables
