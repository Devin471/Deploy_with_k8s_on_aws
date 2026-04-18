# 🖥️ Windows User - Local Development Setup Guide

Complete step-by-step guide for Windows users to run the Fashion E-Commerce project locally.

## System Requirements Check

### 1. Verify Node.js Installation
```powershell
# Open PowerShell and run:
node --version
npm --version

# Should show version numbers (v14+)
# If command not found, install from https://nodejs.org/
```

### 2. Verify MongoDB Installation (Optional - Choose ONE)

**Option A: Local MongoDB**
```powershell
mongod --version

# If not found, install from:
# https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud) - Recommended**
- No installation needed
- Free tier available
- Sign up: https://www.mongodb.com/cloud/atlas

---

## Quick Setup (5 Minutes)

### Step 1: Navigate to Project
```powershell
# Open PowerShell as Administrator
# Navigate to project directory
cd d:\project\k8s\ Fasion\ website

# Or use the correct path on your system
```

### Step 2: Run Setup Script
```powershell
# This creates environment files automatically
setup-local.bat

# A window will show with instructions
# Keep the console open to follow next steps
```

### Step 3: Install Dependencies
```powershell
npm run setup

# This installs dependencies for:
# - Root
# - Backend  
# - Frontend
# Takes 2-3 minutes
```

### Step 4: Start MongoDB

**Option A: Windows MongoDB Service**
```powershell
# Start MongoDB service
net start MongoDB

# To stop later:
# net stop MongoDB

# If service not found, try:
mongod
```

**Option B: MongoDB Atlas**
- Already running in cloud
- Update MONGO_URI in backend\.env with connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/myfashion`

### Step 5: Start Backend (Terminal 1)
```powershell
# From project root
npm run dev:backend

# Wait for message: "✅ Server running on http://localhost:5000"
```

### Step 6: Start Frontend (Terminal 2)
```powershell
# Open NEW PowerShell window
# Navigate to project directory
cd d:\project\k8s\ Fasion\ website

# Start frontend
npm run dev:frontend

# Browser will automatically open
# Wait for message: "Compiled successfully!"
```

### Step 7: Test Application
```
✅ Visit: http://localhost:3000

Features to test:
- Homepage loads
- Can browse products
- Can register customer account
- Can go to admin login
- Can create admin account
```

---

## Detailed Step-by-Step Process

### A. Verify Prerequisites

1. **Check Node.js**
   ```powershell
   # PowerShell
   node -v
   npm -v
   
   # Output should be:
   # v14.21.3 (or higher)
   # 7.20.3 (or higher)
   ```

2. **Check MongoDB** (if local)
   ```powershell
   mongod --version
   
   # Or check service:
   Get-Service | Where-Object {$_.Name -like '*mongo*'}
   ```

### B. Project Setup

1. **Open Project Directory**
   ```powershell
   # Navigate to your project
   cd "d:\project\k8s Fasion website"
   
   # List files to verify
   dir
   
   # Should show: backend, frontend, setup-local.bat, etc.
   ```

2. **Create Environment Files (Choose ONE)**

   **Option A: Automatic (Easiest)**
   ```powershell
   .\setup-local.bat
   
   # Window opens with instructions
   # Automatically creates:
   # - backend\.env
   # - frontend\.env.local
   ```

   **Option B: Manual**
   ```powershell
   # Create backend\.env
   Copy-Item backend\.env.example backend\.env
   
   # Create frontend\.env.local
   Copy-Item frontend\.env.example frontend\.env.local
   
   # Edit files with Notepad if needed
   notepad backend\.env
   notepad frontend\.env.local
   ```

3. **Verify .env Files**
   ```powershell
   # Check backend\.env exists
   test-path backend\.env
   
   # Check frontend\.env.local exists
   test-path frontend\.env.local
   ```

### C. Install Dependencies

```powershell
# From project root directory

# Option 1: Single command (installs all)
npm run setup

# Option 2: Manual installation
npm install
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

### D. Start MongoDB

**For Local MongoDB:**
```powershell
# Option 1: Start Windows Service
net start MongoDB

# Option 2: Run mongod process
cd "C:\Program Files\MongoDB\Server\6.0\bin"
.\mongod.exe

# Test connection
mongosh
# Type: db.version()
# Should show MongoDB version
# Type: exit
```

**For MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Update MONGO_URI in backend\.env:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/myfashion?retryWrites=true&w=majority
   ```

### E. Start Backend Server

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# You should see:
# ✅ Server running on http://localhost:5000
# ✅ MongoDB Connected: localhost
#
# Keep this terminal open!
```

### F. Start Frontend Server

```powershell
# Terminal 2 - Frontend (NEW WINDOW)
cd frontend
npm start

# Wait for:
# Compiled successfully!
# 
# Browser opens automatically at http://localhost:3000
# Keep this terminal open!
```

---

## Verify Everything Works

### Checklist

- [ ] Terminal 1 shows "Server running on http://localhost:5000"
- [ ] Terminal 2 shows "Compiled successfully!"
- [ ] Browser opened at http://localhost:3000
- [ ] Page loads without errors
- [ ] Can see product listings

### Test Features

1. **Customer Registration**
   - Click "Register" 
   - Fill form
   - Create account
   - Login

2. **Admin Access**
   - Go to Admin Login
   - Create first admin account
   - Can see dashboard

3. **API Testing**
   - Visit http://localhost:5000/api
   - Should see API information

---

## Common Issues & Fixes

### Issue: "npm command not found"
```
Solution:
1. Install Node.js from https://nodejs.org/
2. Restart PowerShell
3. Test: node --version
```

### Issue: "Port 5000 already in use"
```
Solution Option 1:
Kill the process:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

Solution Option 2:
Change port in backend\.env
PORT=5001

Then restart: npm run dev:backend
```

### Issue: "Port 3000 already in use"
```
Solution:
set PORT=3001
npm start

Or let React ask to use another port (type 'y')
```

### Issue: "MongoDB connection failed"
```
Solution:
1. Check MongoDB running:
   net start MongoDB (if service installed)
   
2. Verify MONGO_URI in backend\.env:
   mongodb://127.0.0.1:27017/myfashion
   
3. Test connection:
   mongosh
   
4. Check backend console for exact error
```

### Issue: "CORS error in browser console"
```
Solution:
1. Verify backend .env CLIENT_URL=http://localhost:3000
2. Verify frontend proxy in package.json: "proxy": "http://localhost:5000"
3. Restart both servers
4. Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: "Module not found errors"
```
Solution:
1. Delete node_modules in problematic folder
2. Delete package-lock.json
3. Run: npm install
4. Restart server
```

### Issue: "Cannot find setup-local.bat"
```
Solution:
1. Verify you're in correct directory: d:\project\k8s Fasion website
2. List files: dir *.bat
3. If not found, backend\.env manually:
   Copy-Item backend\.env.example backend\.env
```

---

## File Locations Reference

Your project structure:
```
d:\project\k8s Fasion website\
├── backend\
│   ├── .env              ← Create this (from .env.example)
│   ├── .env.example      ← Copy this
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend\
│   ├── .env.local        ← Create this (from .env.example)
│   ├── .env.example      ← Copy this
│   ├── public\
│   ├── src\
│   ├── package.json
│   └── ...
├── package.json          ← Has 'npm run' scripts
├── setup-local.bat       ← Run this
├── setup-local.js
└── ...
```

---

## Environment Variables Explained

### backend\.env
```
PORT=5000                           # Backend server port
NODE_ENV=development                # Development mode
MONGO_URI=mongodb://127.0.0.1:27017/myfashion  # Database
JWT_SECRET=your-secret-key          # Auth token secret
CLIENT_URL=http://localhost:3000    # Frontend URL
```

### frontend\.env.local
```
REACT_APP_API_URL=http://localhost:5000  # Backend API URL
```

---

## Running the Project Multiple Times

After initial setup, next time is faster:

1. **Start MongoDB** (if local)
   ```powershell
   net start MongoDB
   ```

2. **Terminal 1 - Backend**
   ```powershell
   cd backend
   npm run dev
   ```

3. **Terminal 2 - Frontend**
   ```powershell
   cd frontend
   npm start
   ```

4. **Open** http://localhost:3000

---

## Stopping the Servers

- In each terminal: Press `Ctrl + C`
- Stop MongoDB: `net stop MongoDB` (if service)
- Or leave running - they'll stop when PowerShell closes

---

## Helpful PowerShell Commands

```powershell
# Check if port is in use
Get-NetTCPConnection -LocalPort 5000

# Check running processes
Get-Process | Where-Object {$_.Name -like '*node*'}

# Kill process by port
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Check MongoDB service
Get-Service MongoDB

# Navigate to project
cd "d:\project\k8s Fasion website"

# List files
dir

# Edit file
notepad filename.env
```

---

## Next Steps After Success

- ✅ Development complete - ready to make changes
- 📱 Test on mobile using server's IP address
- 🚀 When ready to deploy - see [README.md](./README.md)
- 📚 Learn more - see [LOCAL_SETUP.md](./LOCAL_SETUP.md)

---

## Still Having Issues?

1. Check browser console: `F12 → Console tab`
2. Check backend console for errors
3. Check that both servers are running
4. Check that MongoDB is running
5. Verify .env files have correct values
6. See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for more troubleshooting

---

**Good luck! 🚀 You've got this!**
