# API Reference - QuillSync Authentication Endpoints

## Base URL
```
http://localhost:5000
```

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful! Please check your email to confirm your account.",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {...}
  }
}
```

**Error Response (400):**
```json
{
  "error": "Password must be at least 6 characters."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "fullName": "Test User"
  }'
```

---

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {...}
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid login credentials"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

---

### 3. Get Current User (Protected)
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const data = await response.json();
```

---

### 4. Verify OAuth Session
**Endpoint:** `POST /api/auth/verify-session`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Session verified",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe",
    "provider": "google"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "user": {...}
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-session \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_ACCESS_TOKEN"
  }'
```

---

### 5. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Token refreshed",
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {...}
  },
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

---

### 6. Logout (Protected)
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid or expired token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 7. Health Check
**Endpoint:** `GET /api/health`

**Success Response (200):**
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

**cURL Example:**
```bash
curl http://localhost:5000/api/health
```

---

## Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Login successful, user data retrieved |
| 201 | Created | Registration successful |
| 400 | Bad Request | Missing fields, validation error |
| 401 | Unauthorized | Invalid token, wrong credentials |
| 500 | Server Error | Unexpected error on backend |

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Messages:
- `"Email, password, and full name are required."`
- `"Password must be at least 6 characters."`
- `"Invalid login credentials"`
- `"Missing or invalid authorization header"`
- `"Invalid or expired token"`

---

## Frontend Implementation Example

### Using Fetch API

```javascript
// Register
async function register(email, password, fullName) {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName })
  });
  return response.json();
}

// Login
async function login(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

// Get Current User
async function getCurrentUser(accessToken) {
  const response = await fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.json();
}

// Verify OAuth Session
async function verifyOAuthSession(accessToken) {
  const response = await fetch('http://localhost:5000/api/auth/verify-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken })
  });
  return response.json();
}

// Refresh Token
async function refreshToken(refreshToken) {
  const response = await fetch('http://localhost:5000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  return response.json();
}

// Logout
async function logout(accessToken) {
  const response = await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  return response.json();
}
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

// Register
export const register = (email, password, fullName) => {
  return axios.post(`${API_BASE}/api/auth/register`, {
    email, password, fullName
  });
};

// Login
export const login = (email, password) => {
  return axios.post(`${API_BASE}/api/auth/login`, {
    email, password
  });
};

// Get Current User
export const getCurrentUser = (accessToken) => {
  return axios.get(`${API_BASE}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
};

// Logout
export const logout = (accessToken) => {
  return axios.post(`${API_BASE}/api/auth/logout`, {}, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
};
```

---

## Rate Limiting (Future Implementation)

Currently not implemented, but recommended for production:
- Register: 5 requests per hour per IP
- Login: 10 requests per hour per IP
- API calls: 100 requests per minute per token

---

## Security Notes

1. **Always use HTTPS in production**
2. **Store tokens securely** - use httpOnly cookies or secure storage
3. **Add CSRF protection** for form submissions
4. **Validate inputs** on both frontend and backend
5. **Implement rate limiting** to prevent brute force attacks
6. **Use environment variables** for sensitive data
7. **Never expose tokens** in URLs or logs
8. **Implement token expiration** - current: 1 hour (from Supabase)
9. **Use refresh tokens** for extending sessions
10. **Add request signing** for critical operations

---

**Documentation Version:** 1.0  
**Last Updated:** 2026-07-05  
**Status:** Production Ready
