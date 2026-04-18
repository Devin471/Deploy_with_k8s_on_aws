# ⚡ Google Auth - Quick Reference Card

Fast lookup for Google OAuth Client ID setup.

---

## 🎯 TL;DR - 60 Seconds

**1. Get Client ID**
```
Go: https://console.cloud.google.com
Create: OAuth 2.0 Client ID (Web application)
Copy: 123456789-abc...apps.googleusercontent.com
```

**2. Add to Frontend**
```
File: frontend/.env.local
Add:  REACT_APP_GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
```

**3. Update Google Cloud**
```
Google Cloud: Add http://localhost:3000 to authorized origins
```

**4. Test**
```
npm start → Click "Continue with Google" → Login works ✅
```

---

## 🗂️ Where It Goes

| Component | File | What To Add |
|-----------|------|-------------|
| **FRONTEND** | `frontend/.env.local` | `REACT_APP_GOOGLE_CLIENT_ID=<YOUR_ID>` |
| **BACKEND** | `backend/.env` | (optional) `GOOGLE_CLIENT_ID=<YOUR_ID>` |
| **EXTERNAL** | Google Cloud Console | Add domain to authorized origins |

---

## 📍 Each File in Project

### Must Edit
```
✅ frontend/.env.local
   └─ Add: REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

### References (Don't Edit)
```
frontend/.env.example ............... Shows format
backend/.env.example ................ Shows format
```

### Uses Google Auth (Don't Edit, Just Info)
```
frontend/src/utils/googleAuth.js .................. Reads from .env.local
frontend/src/pages/CustomerLogin.js .............. Uses googleAuth utility
frontend/src/pages/SellerLogin.js ................ Uses googleAuth utility
frontend/src/context/AuthContext.js .............. Sends token to backend
backend/routes/auth.js ........................... Receives & verifies token
```

---

## 🔍 Line-by-Line Locations

### Frontend (React)

**File: `frontend/src/utils/googleAuth.js`**
```
Line 9-10: const envClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
           ↑ Reads your Client ID from .env.local

Line 56:   client_id: clientId
           ↑ Uses it here in Google OAuth initialization
```

**File: `frontend/src/pages/CustomerLogin.js`**
```
Line 24-38: handleGoogle() function
            ├─ Calls getGoogleAccessToken() (from googleAuth.js)
            ├─ Gets access token
            └─ Sends to loginCustomerWithGoogle()
```

**File: `frontend/src/context/AuthContext.js`**
```
loginCustomerWithGoogle(accessToken)
  └─► POST /api/auth/google (backend) with access token
```

### Backend (Node.js)

**File: `backend/routes/auth.js`**
```
Line 73-150: router.post('/google', async (req, res) =>
             ├─ Receives access token from frontend
             ├─ Verifies with Google API (NO secret needed!)
             ├─ Creates/finds user
             └─ Returns JWT token
```

---

## 🌍 Domains to Add (Google Cloud)

### Local Development
```
http://localhost:3000
http://127.0.0.1:3000
http://localhost:5000
```

### Production
```
https://yourdomain.com
https://www.yourdomain.com
```

Note: Add these to "Authorized JavaScript origins" + "Authorized redirect URIs" in Google Cloud Console

---

## ✅ Verification Checklist

- [ ] Client ID copied from Google Cloud Console
- [ ] Format: `...apps.googleusercontent.com`
- [ ] Added to `frontend/.env.local`
- [ ] File `frontend/.env.local` created (not `.env`)
- [ ] Domain added to Google Cloud authorized origins
- [ ] Frontend can start: `npm start` works
- [ ] "Continue with Google" button visible on login page
- [ ] Click button opens Google sign-in popup
- [ ] After Google login, redirected to dashboard
- [ ] User appears in database
- [ ] No red errors in browser console (F12)

---

## 🚀 Environment Variable Format

### Valid Examples
```
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID=987654321-zyxwvutsrqponmlkjihgfedcba.apps.googleusercontent.com
```

### Invalid Examples ❌
```
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
REACT_APP_GOOGLE_CLIENT_ID=undefined
REACT_APP_GOOGLE_CLIENT_ID=(empty/blank)
```

---

## 🔐 Security Notes

- ✅ Client ID is PUBLIC (share in code, commit to git)
- ❌ Client Secret is PRIVATE (never share, never commit)
- ❌ Do NOT commit `.env` or `.env.local` files
- ↪️ `.env.local` is in `.gitignore` by default (safe)
- ✅ Safe to use Client ID in frontend code

---

## 🎭 Login Pages Using Google Auth

**Customer Pages:**
```
/login → CustomerLogin.js
```

**Seller Pages:**
```
/seller-login → SellerLogin.js
```

**Admin Pages:**
```
/admin-login → AdminLogin.js
Note: Admin login does NOT have Google auth (password only)
```

---

## 🔄 Full Login Flow

```
1. User opens /login page
2. Sees "Continue with Google" button
3. Clicks button
4. Google popup opens
5. User signs in with Google
6. Google returns access token
7. Frontend sends token to backend
8. Backend verifies with Google API
9. Backend creates user if new
10. Backend returns JWT token
11. Frontend stores JWT
12. Frontend redirects to /
13. User logged in ✅
```

---

## 📞 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Error 400: redirect_uri_mismatch" | Add domain to Google Cloud authorized origins |
| Button doesn't appear | Check F12 console for JavaScript errors |
| Button doesn't work | Check REACT_APP_GOOGLE_CLIENT_ID in browser devtools → Application → Environment |
| "Invalid Client ID" | Copy fresh from Google Cloud, check format |
| Google popup blocked | Browser popup blocker issue - allow popups |
| User not created in DB | Check backend console for errors, check User.js model |

---

## 🔗 Quick Links

| Task | Link |
|------|------|
| Get Google Client ID | https://console.cloud.google.com |
| Detailed setup guide | [GOOGLE_AUTH_LOCATIONS.md](./GOOGLE_AUTH_LOCATIONS.md) |
| Implementation details | [GOOGLE_AUTH_IMPLEMENTATION_MAP.md](./GOOGLE_AUTH_IMPLEMENTATION_MAP.md) |
| Troubleshooting | [GOOGLE_OAUTH_FIX.md](./GOOGLE_OAUTH_FIX.md) |
| General setup | [LOCAL_SETUP.md](./LOCAL_SETUP.md) |

---

## 📋 Checklist for Completion

### Setup Phase
- [ ] Google Cloud project created
- [ ] OAuth 2.0 credentials created
- [ ] Client ID copied
- [ ] localhost:3000 added to authorized origins
- [ ] frontend/.env.local created
- [ ] REACT_APP_GOOGLE_CLIENT_ID added to .env.local

### Testing Phase
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Can see "Continue with Google" button
- [ ] Can click button
- [ ] Google popup appears
- [ ] Can sign in with Google
- [ ] Redirected to dashboard
- [ ] Logged in status shows in UI

### Verification Phase
- [ ] User exists in MongoDB
- [ ] JWT token stored in browser
- [ ] No errors in browser console
- [ ] No errors in backend terminal

---

## 🎓 Related Guides

**Must Read:**
- [GOOGLE_AUTH_LOCATIONS.md](./GOOGLE_AUTH_LOCATIONS.md) - Where exactly Client ID goes

**Should Read:**
- [GOOGLE_OAUTH_FIX.md](./GOOGLE_OAUTH_FIX.md) - If you hit errors
- [LOCAL_SETUP.md](./LOCAL_SETUP.md) - General development setup

---

## ⏱️ Est. Setup Time

- Getting Client ID: **5 minutes**
- Adding to frontend: **2 minutes**
- Adding domain to Google Cloud: **3 minutes**
- Testing: **2 minutes**
- **Total: ~12 minutes**

---

## 🎯 Success Criteria

✅ You're done when:
- Frontend starts: `npm start`
- Can click "Continue with Google"
- Can sign in
- Redirected to dashboard logged in
- User in database

---

## 📲 Three Essential Files

**Create/Edit:**
```
1. frontend/.env.local                    ← ADD CLIENT ID HERE
```

**Read (don't edit):**
```
2. frontend/src/utils/googleAuth.js       ← See how it reads .env.local
3. backend/routes/auth.js                 ← See how backend handles it
```

---

## 🚨 Common Mistakes

1. ❌ Putting Client ID in `frontend/.env` instead of `frontend/.env.local`
2. ❌ Forgetting to add `REACT_APP_` prefix
3. ❌ Not adding domain to Google Cloud authorized origins
4. ❌ Using Client Secret instead of Client ID
5. ❌ Committing `.env.local` to git (use `.gitignore`)

---

## ✨ You're All Set When:

```
npm start
  ↓
Open browser → http://localhost:3000
  ↓
Click "Sign In"
  ↓
Click "Continue with Google"
  ↓
Google popup appears
  ↓
Sign in with Google email
  ↓
Redirected to dashboard ✅
```

---

**Print this card or bookmark for quick reference!**

Visit: [GOOGLE_AUTH_LOCATIONS.md](./GOOGLE_AUTH_LOCATIONS.md) for detailed step-by-step instructions.
