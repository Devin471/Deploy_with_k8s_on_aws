# 🗺️ Google Auth Implementation Map - Visual Guide

Complete file map showing where Google OAuth is configured and used throughout the project.

---

## 📊 Visual Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GOOGLE OAUTH FLOW                        │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  1. CONFIGURATION                                                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  frontend/.env.local                                               │
│  └─► REACT_APP_GOOGLE_CLIENT_ID=123456...apps.googleusercontent... │
│                                                                      │
│  backend/.env (optional)                                           │
│  └─► GOOGLE_CLIENT_ID=123456...apps.googleusercontent...          │
│  └─► GOOGLE_CLIENT_SECRET=GOCSPX-...                              │
│                                                                      │
│  Google Cloud Console                                              │
│  └─► OAuth Client Credential                                       │
│  └─► Authorized Origins: http://localhost:3000                    │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ Provides Client ID
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  2. FRONTEND (React)                                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  src/utils/googleAuth.js .......................... Google SDK      │
│  ├─► resolveGoogleClientId()                                       │
│  │   ├─► Reads from process.env                                    │
│  │   ├─► Reads from localStorage                                   │
│  │   └─► Prompts user if not found                                 │
│  │                                                                   │
│  ├─► loadGoogleScript()                                            │
│  │   └─► Loads accounts.google.com/gsi/client                      │
│  │                                                                   │
│  └─► getGoogleAccessToken()                                        │
│      └─► Returns access token to frontend                          │
│          (sent to backend via API)                                 │
│                                                                      │
│  src/pages/CustomerLogin.js ...................... Login Page      │
│  ├─► Imports getGoogleAccessToken()                                │
│  ├─► handleGoogle() button click                                   │
│  └─► Calls loginCustomerWithGoogle(token)                          │
│                                                                      │
│  src/pages/SellerLogin.js ......................... Seller Login    │
│  ├─► Imports getGoogleAccessToken()                                │
│  └─► handleGoogle() button click                                   │
│                                                                      │
│  src/context/AuthContext.js ....................... Auth Context   │
│  ├─► loginCustomerWithGoogle(accessToken)                          │
│  │   └─► POST to /api/auth/google                                  │
│  │                                                                   │
│  └─► loginSellerWithGoogle(accessToken)                            │
│      └─► POST to /api/auth/google?role=seller                     │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ Sends access token
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  3. BACKEND (Node.js/Express)                                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  routes/auth.js ................................... API Routes     │
│  ├─► POST /register                                                │
│  ├─► POST /login                                                   │
│  ├─► POST /seller/login                                            │
│  └─► POST /google ◄─── HANDLES GOOGLE LOGIN                       │
│      │                                                              │
│      ├─► Validate access token                                     │
│      │   (verify with googleapis.com/oauth2/v3/userinfo)           │
│      │                                                              │
│      ├─► Check if user exists                                      │
│      │                                                              │
│      ├─► Create user if new                                        │
│      │   └─► models/User.js                                        │
│      │   └─► models/Seller.js                                      │
│      │                                                              │
│      └─► Return JWT token to frontend                              │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
                              │
                              │ Returns JWT
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│  4. DATABASE                                                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  MongoDB Collections                                                │
│  ├─► users                                                          │
│  │   ├─► { _id, name, email, password, avatar, ... }              │
│  │   └─► Created from Google profile if new                        │
│  │                                                                   │
│  └─► sellers                                                        │
│      ├─► { _id, name, email, password, businessName, ... }        │
│      └─► Created from Google profile if new                        │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Tree - Google Auth Files

```
d:\project\k8s Fasion website\
│
├── CONFIGURATION FILES
│   ├── frontend/.env.local ...................... WHERE TO PUT CLIENT ID
│   ├── frontend/.env.example .................... TEMPLATE
│   ├── backend/.env ............................ Optional backend config
│   └── backend/.env.example .................... Template
│
├── FRONTEND - src/
│   ├── pages/
│   │   ├── CustomerLogin.js .................... Uses Google auth
│   │   ├── SellerLogin.js ...................... Uses Google auth
│   │   └── AdminLogin.js ....................... No Google (admin only)
│   │
│   ├── context/
│   │   └── AuthContext.js ...................... loginCustomerWithGoogle()
│   │                                         loginSellerWithGoogle()
│   │
│   ├── utils/
│   │   └── googleAuth.js ....................... Main Google SDK file
│   │       ├─► resolveGoogleClientId()
│   │       ├─► loadGoogleScript()
│   │       └─► getGoogleAccessToken()
│   │
│   └── public/
│       └── index.html .......................... No changes needed
│
├── BACKEND - routes/
│   └── auth.js ................................ POST /api/auth/google
│       └─► Receives token from frontend
│       └─► Verifies with Google
│       └─► Creates/updates user
│       └─► Returns JWT
│
├── BACKEND - models/
│   ├── User.js ................................ User data structure
│   └── Seller.js .............................. Seller data structure
│
└── DOCUMENTATION
    ├── GOOGLE_AUTH_LOCATIONS.md ................ THIS GUIDE
    ├── GOOGLE_OAUTH_FIX.md .................... Setup & troubleshooting
    ├── LOCAL_SETUP.md ......................... Complete setup guide
    └── frontend/.env.example .................. Shows format needed
```

---

## 🎯 4-Step Configuration Process

### Step 1️⃣ Get Client ID from Google Cloud

```
https://console.cloud.google.com
  └─► Create OAuth 2.0 Client ID
      └─► Select "Web application"
          └─► Copy Client ID: 123456789-abc..apps.googleusercontent.com
```

### Step 2️⃣ Add to Frontend Configuration

```
frontend/.env.local
  └─► Add: REACT_APP_GOOGLE_CLIENT_ID=123456789-abc...
```

### Step 3️⃣ Update Google Cloud Authorized Domains

```
Google Cloud Console
  └─► Find your OAuth Client
      └─► Add "Authorized JavaScript origins":
          ├─► http://localhost:3000 (local dev)
          ├─► https://yourdomain.com (production)
          └─► https://www.yourdomain.com (with www)
```

### Step 4️⃣ Test

```
Frontend: npm start
  └─► Click "Continue with Google"
      └─► Sign in with Google
          └─► Redirected to dashboard logged in ✅
```

---

## 🔍 Detailed File Breakdown

### Configuration Files

#### ❌ **DON'T PUT CLIENT ID HERE:**
```
frontend/package.json
backend/package.json
.gitignore
```

#### ✅ **PUT CLIENT ID HERE:**
```
frontend/.env.local          ← THIS IS WHERE IT GOES!
REACT_APP_GOOGLE_CLIENT_ID=YOUR_ID_HERE
```

#### ⚙️ **REFERENCE (DON'T EDIT DIRECTLY):**
```
frontend/.env.example        ← Template showing format
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

backend/.env.example         ← Optional, showing format
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### Frontend Files (Reading & Using Google ID)

#### 1️⃣ **frontend/src/utils/googleAuth.js** - Main Integration

**What it does:**
- Resolves Client ID from multiple sources
- Loads Google SDK script
- Initiates OAuth flow
- Returns access token

**Key functions:**
```javascript
resolveGoogleClientId()      // Reads REACT_APP_GOOGLE_CLIENT_ID
loadGoogleScript()           // Loads accounts.google.com/gsi/client
getGoogleAccessToken()       // Initiates OAuth, returns token
```

**Line references:**
- Line 9-10: Reads from `process.env.REACT_APP_GOOGLE_CLIENT_ID`
- Line 25: Uses Client ID in `initTokenClient({ client_id: clientId })`

#### 2️⃣ **frontend/src/pages/CustomerLogin.js** - Login Form

**What it does:**
- Shows "Continue with Google" button
- Handles button click
- Calls `getGoogleAccessToken()`
- Sends token to backend

**Key lines:**
- Line 4: Imports `getGoogleAccessToken`
- Line 24-33: `handleGoogle()` function
- Line 26: Calls `getGoogleAccessToken()`
- Line 27: Sends to `loginCustomerWithGoogle(accessToken)`

#### 3️⃣ **frontend/src/pages/SellerLogin.js** - Seller Registration

**Similar to CustomerLogin.js but for sellers**
- Shows "Register with Google" button
- Calls `getGoogleAccessToken()`
- May have different role handling

#### 4️⃣ **frontend/src/context/AuthContext.js** - Auth Logic

**What it does:**
- Provides `loginCustomerWithGoogle()` function
- Provides `loginSellerWithGoogle()` function
- Sends token to backend API
- Stores returned JWT

**Functions:**
```javascript
loginCustomerWithGoogle(accessToken)
  └─► POST /api/auth/google with { accessToken }

loginSellerWithGoogle(accessToken)
  └─► POST /api/auth/google with { accessToken, role: 'seller' }
```

---

### Backend Files (Verifying Google ID)

#### 1️⃣ **backend/routes/auth.js** - Google Auth Endpoint

**Route:** `POST /api/auth/google`

**What it does:**
```javascript
1. Receives { accessToken, role } from frontend
2. Calls Google API: https://www.googleapis.com/oauth2/v3/userinfo
3. Gets user profile: { email, name, picture, ... }
4. Creates or finds user in database
5. Returns JWT token
```

**Code location:**
- Line 73-150: Complete `/api/auth/google` endpoint
- Line 76: Validates access token exists
- Line 78-80: Fetches from Google API (NO Client Secret needed!)
- Line 85-95: Gets user info from Google
- Line 100-120: Creates/finds user
- Line 125-135: Returns JWT token

**Important:** Backend does NOT need `GOOGLE_CLIENT_SECRET`!
- Verification done using access token only
- Access token proves user authenticated with Google

#### 2️⃣ **backend/models/User.js** - User Schema

**Stores:**
- `email` - from Google profile
- `name` - from Google profile
- `avatar` - Google profile picture
- `password` - random for Google users (never used)

#### 3️⃣ **backend/models/Seller.js** - Seller Schema

**Stores:**
- Same as User but for sellers
- `businessName` - may be derived from user name

---

## 🔗 Data Flow During Login

```
1. USER ACTION
   User clicks "Continue with Google"
   
2. FRONTEND: frontend/src/pages/CustomerLogin.js
   handleGoogle() called
   └─► Imports getGoogleAccessToken from googleAuth.js
   
3. FRONTEND: frontend/src/utils/googleAuth.js
   getGoogleAccessToken() executes:
   ├─► Reads REACT_APP_GOOGLE_CLIENT_ID from environment
   ├─► Loads Google SDK script (accounts.google.com/gsi/client)
   ├─► Shows Google sign-in popup
   └─► Returns access token when user signs in
   
4. FRONTEND: frontend/src/context/AuthContext.js
   loginCustomerWithGoogle(accessToken) called
   └─► Makes API call:
       POST /api/auth/google
       { accessToken: "...", role: "customer" }
   
5. BACKEND: backend/routes/auth.js
   POST /api/auth/google handler:
   ├─► Receives accessToken
   ├─► Calls: https://www.googleapis.com/oauth2/v3/userinfo
   │   with Authorization: Bearer {accessToken}
   ├─► Gets user profile: { email, name, picture, ... }
   ├─► Queries: User.findOne({ email: profile.email })
   ├─► If not exists: User.create({ name, email, avatar, ... })
   └─► Returns JWT token
   
6. FRONTEND: Receives JWT token
   ├─► Stores in localStorage
   ├─► Stores in Auth context
   └─► Redirects to dashboard
   
7. USER LOGGED IN ✅
```

---

## 🎨 Visual File Dependencies

```
environment (.env.local)
    │
    ▼
googleAuth.js (resolves Client ID)
    │
    ├─────────────────┐
    │                 │
    ▼                 ▼
CustomerLogin.js    SellerLogin.js
    │                 │
    ├─────────────────┤
    │                 │
    ▼                 ▼
AuthContext.js (sends to backend)
    │
    ▼
Backend: routes/auth.js (/api/auth/google)
    │
    ├─── Google API (verify token)
    │
    ├─── User.js (create/find user)
    │
    └─── Return JWT
         │
         ▼
    Frontend logged in ✅
```

---

## 📝 Where Google Client ID Appears

### In Configuration
```
❌ Should NOT be in: 
  - package.json
  - .gitignore
  - Git history
  - Public repositories

✅ Should be in:
  - frontend/.env.local (ESSENTIAL)
  - Vercel environment variables (production)
  - GitHub Secrets (for CI/CD)
  - backend/.env (optional backup)
```

### In Code
```
Reads Client ID from:
  - process.env.REACT_APP_GOOGLE_CLIENT_ID (googleAuth.js line 9)
  - localStorage (googleAuth.js line 13)
  - User prompt (googleAuth.js line 17)

Uses Client ID for:
  - window.google.accounts.oauth2.initTokenClient({ client_id })
    (googleAuth.js line 56)
```

### In Google Cloud
```
Google Cloud Console
  └─► OAuth 2.0 Clients
      └─► Client ID: 123456789-abc...apps.googleusercontent.com
          Authorized Origins: 
          ├─ http://localhost:3000
          └─ https://yourdomain.com
```

---

## ✅ Configuration Verification

After setting up, verify:

```
1. ✅ frontend/.env.local exists
2. ✅ REACT_APP_GOOGLE_CLIENT_ID is set
3. ✅ Client ID format: ...apps.googleusercontent.com
4. ✅ Google Cloud has your domain in authorized origins
5. ✅ Can see "Continue with Google" button on login page
6. ✅ Clicking opens Google popup
7. ✅ Popup closes and redirects to dashboard
8. ✅ User logged in with Google email
```

---

## 🚨 Common Issues

| Issue | File to Check | Fix |
|-------|---------------|-----|
| "Error 400: redirect_uri_mismatch" | Google Cloud | Add domain to authorized origins |
| "Invalid Client ID" | googleAuth.js env read | Check REACT_APP_GOOGLE_CLIENT_ID format |
| Google button doesn't appear | CustomerLogin.js | Check browser console (F12) for errors |
| "Google access token is required" | backend/auth.js | Frontend not sending token |
| User not created in DB | backend/routes/auth.js line 100 | Check User.js schema |

---

## 📚 Related Files

```
Guides:
├── GOOGLE_AUTH_LOCATIONS.md ........... Detailed locations (READ THIS)
├── GOOGLE_OAUTH_FIX.md ............... Troubleshooting guide
└── LOCAL_SETUP.md .................... General setup

Configuration:
├── frontend/.env.local (CREATE, add Client ID here)
├── frontend/.env.example (reference)
├── backend/.env (CREATE, optional)
└── backend/.env.example (reference)

Implementation:
├── frontend/src/utils/googleAuth.js
├── frontend/src/pages/CustomerLogin.js
├── frontend/src/pages/SellerLogin.js
├── frontend/src/context/AuthContext.js
└── backend/routes/auth.js
```

---

## 🎓 Next Steps

1. **Read:** [GOOGLE_AUTH_LOCATIONS.md](./GOOGLE_AUTH_LOCATIONS.md) for details
2. **Get:** Client ID from Google Cloud Console
3. **Add:** To `frontend/.env.local`
4. **Test:** Click "Continue with Google" on login page
5. **Debug:** If issues, check [GOOGLE_OAUTH_FIX.md](./GOOGLE_OAUTH_FIX.md)

---

**Happy authenticating! 🔐**
