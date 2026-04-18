# 🔒 Google OAuth Configuration - Where to Add Google Client ID

Complete guide showing every location where Google Auth credentials need to be configured.

---

## 📍 Overview - 3 Places to Configure

| # | Location | Type | What It Does |
|---|----------|------|--------------|
| **1** | `frontend/.env.local` | Frontend Config | React reads Google Client ID |
| **2** | `backend/.env` | Backend Config | Optional: Backend Google settings |
| **3** | Google Cloud Console | External Service | Configure allowed domains |

---

## 1️⃣ FRONTEND Configuration

### File: `frontend/.env.local`

**Location:** `d:\project\k8s Fasion website\frontend\.env.local`

**Add this line:**
```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
```

**Example with real ID:**
```env
REACT_APP_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

### How Frontend Uses It

**File:** [frontend/src/utils/googleAuth.js](../frontend/src/utils/googleAuth.js)

```javascript
// Line 9-10: Reads from environment
const envClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim();
if (isValidClientId(envClientId)) return envClientId;
```

**Flow:**
1. Frontend reads `REACT_APP_GOOGLE_CLIENT_ID` from `.env.local`
2. If not set, asks user to enter it via `window.prompt()`
3. Stores in browser `localStorage` for future use
4. Passes to Google OAuth script

### Frontend Files That Use Google Auth

**File:** [frontend/src/pages/CustomerLogin.js](../frontend/src/pages/CustomerLogin.js)
- Lines 4, 24-38: Imports and uses `getGoogleAccessToken()`
- Line 24: `const accessToken = await getGoogleAccessToken();`
- Handles "Continue with Google" button click

**File:** [frontend/src/context/AuthContext.js](../frontend/src/context/AuthContext.js)
- Has `loginCustomerWithGoogle()` method
- Sends Google access token to backend

**File:** [frontend/src/utils/googleAuth.js](../frontend/src/utils/googleAuth.js)
- Main Google OAuth client ID resolver
- Validates Client ID format
- Loads Google API script from `accounts.google.com/gsi/client`

### What Format Should It Be?

Valid Google Client ID format:
```
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

**NOT valid:**
- Empty string
- "your-google-client-id"
- "YOUR_GOOGLE_CLIENT_ID_HERE"
- Doesn't contain ".apps.googleusercontent.com"

---

## 2️⃣ BACKEND Configuration (Optional)

### File: `backend/.env`

**Location:** `d:\project\k8s Fasion website\backend\.env`

**Add these lines (optional):**
```env
# Google OAuth (optional - for Google login feature)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Does Backend Actually Use These?

**Currently:** ❌ NO - Backend doesn't use these in the code yet

**However:** Backend route at [backend/routes/auth.js](../backend/routes/auth.js)
- Line 73-150: `/api/auth/google` endpoint exists
- Takes access token from frontend
- Verifies token with Google's API (`googleapis.com/oauth2/v3/userinfo`)
- Doesn't require Client Secret for token verification

**Future Use:** These variables could be used if you implement:
- Server-side token refresh
- Deeper Google profile validation
- Logout synchronization

### Backend's Google Auth Route

**File:** [backend/routes/auth.js](../backend/routes/auth.js)

```javascript
/* ── Google Auth (Customer/Seller) ── */
router.post('/api/auth/google', async (req, res) => {
  try {
    const { accessToken, role = 'customer' } = req.body;
    
    // Verify with Google
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const profile = await googleRes.json();
    
    // Create or find user, return token
    ...
  }
});
```

---

## 3️⃣ Google Cloud Console Configuration

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com
2. Sign in with Google account
3. Create new project or select existing

### Step 2: Enable Google+ API

1. Search for "Google+ API" (or just "google api")
2. Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "Credentials" (left sidebar)
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Fill form:

   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5000
   https://your-live-domain.com
   ```

   **Authorized redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:3000/
   http://localhost:3000/login
   https://your-live-domain.com
   https://your-live-domain.com/login
   ```

5. Copy **Client ID** (this is what you need!)

### Step 4: Copy Client ID

Google Cloud shows:
```
Client ID: 123456789-abc123xyz.apps.googleusercontent.com
Client Secret: GOCSPX-xxxxxx...
```

Use the **Client ID** in your `.env.local`

---

## 🔍 How It All Works Together

### Frontend Flow
```
1. User clicks "Continue with Google"
           ↓
2. Frontend loads frontend/.env.local
           ↓
3. Gets REACT_APP_GOOGLE_CLIENT_ID from environment
           ↓
4. Loads Google SDK from accounts.google.com/gsi/client
           ↓
5. Shows Google sign-in popup
           ↓
6. User signs in with Google
           ↓
7. Google returns access token to frontend
           ↓
8. Frontend sends token to backend POST /api/auth/google
```

### Backend Flow
```
1. Receives access token from frontend
           ↓
2. Verifies token with Google API
           ↓
3. Gets user profile (email, name, picture)
           ↓
4. Creates or updates user in database
           ↓
5. Returns JWT token to frontend
           ↓
6. Frontend stores JWT and logs user in
```

---

## 📋 Configuration Checklist

### Local Development

- [ ] Created `frontend/.env.local`
- [ ] Added `REACT_APP_GOOGLE_CLIENT_ID=...` to `frontend/.env.local`
- [ ] Google Client ID format is valid (ends with `.apps.googleusercontent.com`)
- [ ] Added `http://localhost:3000` to Google Cloud Console authorized origins
- [ ] Backend `.env` created (optional)
- [ ] Tested "Continue with Google" button in browser

### Production Deployment

- [ ] Google Cloud Console has production domain in authorized origins
- [ ] `REACT_APP_GOOGLE_CLIENT_ID` set in vercel/deployment environment variables
- [ ] Backend `.env` (if used) has production config
- [ ] Production domain added to Google redirect URIs

---

## 🆘 Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Cause:** Domain not in Google Cloud Console authorized list

**Fix:**
1. Go to Google Cloud Console
2. Find your OAuth client
3. Add your domain to "Authorized JavaScript origins"

### Issue: "Invalid Google access token"

**Cause:** Client ID doesn't match between frontend and Google Cloud

**Fix:**
1. Verify `REACT_APP_GOOGLE_CLIENT_ID` in `.env.local`
2. Copy exact ID from Google Cloud Console
3. No extra spaces or quotes

### Issue: "Google login needs a valid Google OAuth Client ID"

**Cause:** Invalid Client ID format

**Fix:**
1. Check it contains `.apps.googleusercontent.com`
2. Check it's not a placeholder string
3. Copy fresh from Google Cloud Console

### Issue: Google login button doesn't appear

**Cause:** JavaScript errors loading Google SDK

**Fix:**
1. Open browser F12 → Console
2. Check for errors
3. Verify internet connection
4. Try incognito/private browser

---

## 📁 Files That Reference Google Auth

### Must Configure
- ✅ `frontend/.env.local` - Add Client ID here

### Use Google Auth
- `frontend/src/utils/googleAuth.js` - Main Google SDK integration
- `frontend/src/pages/CustomerLogin.js` - "Continue with Google" button
- `frontend/src/pages/SellerLogin.js` - Seller "Continue with Google"
- `frontend/src/context/AuthContext.js` - Google login handler

### Support Google Auth (Backend)
- `backend/routes/auth.js` - `/api/auth/google` endpoint
- `backend/models/User.js` - Stores Google user data
- `backend/models/Seller.js` - Stores Google seller data

### Templates/Examples
- `frontend/.env.example` - Shows `REACT_APP_GOOGLE_CLIENT_ID` format
- `backend/.env.example` - Shows `GOOGLE_CLIENT_ID` format
- `GOOGLE_OAUTH_FIX.md` - Detailed Google Cloud setup guide

---

## 🎯 Specific Code Locations

### Frontend Reading Client ID

**File:** `frontend/src/utils/googleAuth.js` (Lines 1-20)
```javascript
const GOOGLE_CLIENT_ID_STORAGE_KEY = 'googleClientId';

function isValidClientId(value) {
  // Validates Client ID format
  return Boolean(
    value && 
    value.includes('.apps.googleusercontent.com') && 
    !value.includes('YOUR_GOOGLE_CLIENT_ID')
  );
}

function resolveGoogleClientId() {
  // 1. Tries to read from environment variable
  const envClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim();
  if (isValidClientId(envClientId)) return envClientId;
  
  // 2. Tries to read from browser localStorage
  const storedClientId = localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY)?.trim();
  if (isValidClientId(storedClientId)) return storedClientId;
  
  // 3. Prompts user to enter if not found
  const entered = window.prompt('Enter your Google OAuth Client ID...');
  localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, enteredClientId);
  return enteredClientId;
}
```

### Frontend Using Client ID

**File:** `frontend/src/utils/googleAuth.js` (Lines 52-64)
```javascript
export async function getGoogleAccessToken() {
  const clientId = resolveGoogleClientId();  // Gets from .env.local
  
  await loadGoogleScript();
  
  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,  // ← Used here!
      scope: 'openid email profile',
      callback: (response) => {
        if (response?.access_token) resolve(response.access_token);
      }
    });
    
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  });
}
```

### Backend Handling Google Token

**File:** `backend/routes/auth.js` (Lines 73-150)
```javascript
router.post('/google', async (req, res) => {
  const { accessToken } = req.body;
  
  // Verify token with Google (NO Client Secret needed!)
  const googleRes = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  const profile = await googleRes.json();
  
  // Create/update user and return JWT
  let user = await User.findOne({ email: profile.email });
  if (!user) {
    user = await User.create({
      name: profile.name,
      email: profile.email,
      password: randomPassword(),
      avatar: profile.picture
    });
  }
  
  return res.json({
    token: generateToken(user._id, 'customer'),
    user: { id: user._id, name: user.name, email: user.email }
  });
});
```

---

## ✅ Success Indicators

When configured correctly:
- ✅ "Continue with Google" button appears
- ✅ Clicking opens Google sign-in popup
- ✅ Can select Google account
- ✅ Returns to app logged in
- ✅ No red console errors (F12)
- ✅ User created in database

---

## 🔗 Related Documentation

- [GOOGLE_OAUTH_FIX.md](./GOOGLE_OAUTH_FIX.md) - Detailed Google Cloud setup
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Complete local development setup
- [WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md) - Windows-specific setup

---

## 📞 Quick Summary

### What You Need to Do Right Now

1. **Get Client ID from Google Cloud Console**
   - Go to https://console.cloud.google.com
   - Create OAuth client for "Web application"
   - Copy Client ID

2. **Add to Frontend**
   - Edit `frontend/.env.local`
   - Add: `REACT_APP_GOOGLE_CLIENT_ID=YOUR_ID_HERE`

3. **Add Domain to Google Cloud**
   - Add `http://localhost:3000` to authorized origins
   - Add production domain when deploying

4. **Test**
   - Run frontend: `npm start`
   - Click "Continue with Google"
   - Sign in with Google account

---

**Configured:** April 2026  
**Status:** Ready for local development and production deployment
