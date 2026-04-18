# 🚀 Local Machine Development Setup Guide

This guide shows you how to run the Fashion E-Commerce Platform on your local machine.

## Prerequisites

Before you start, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (Community Edition) - [Download](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)

Verify installations:
```bash
node --version
npm --version
mongod --version
```

## Step 1: Clone/Extract Project

```bash
cd d:\project\k8s Fasion website
```

## Step 2: Setup Backend (Node.js/Express)

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Windows PowerShell
Copy-Item .env.example -Destination .env

# Or manually copy .env.example and rename to .env
```

Edit `.env` with your local settings:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/myfashion
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000
```

### 2.4 Ensure MongoDB is Running

**Option A: Local MongoDB (if installed)**
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath="C:\Program Files\MongoDB\Server\{version}\data"
```

**Option B: MongoDB Atlas (Cloud)**
- Use the connection string from MongoDB Atlas in MONGO_URI

### 2.5 Populate Sample Data (Optional)
```bash
npm run seed
```

### 2.6 Start Backend Server
```bash
# Development mode (auto-reload on file changes)
npm run dev

# Or production mode
npm start
```

✅ Backend is running at: **http://localhost:5000**

## Step 3: Setup Frontend (React)

### 3.1 Open New Terminal and Navigate to Frontend Directory
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Create Environment Configuration (Optional)
Create `.env.local` file (or copy from `.env.example`):
```
REACT_APP_API_URL=http://localhost:5000
```

### 3.4 Start Frontend Development Server
```bash
npm start
```

✅ Frontend is running at: **http://localhost:3000**

The browser will automatically open. If not, visit: **http://localhost:3000**

## Running Both Services Concurrently

To run both backend and frontend at the same time:

### Option 1: Use Two Terminals (Recommended)
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option 2: Use npm-run-all (Install First)
```bash
# In root directory
npm install --save-dev npm-run-all

# Then add to root package.json scripts:
# "dev": "npm-run-all --parallel dev:backend dev:frontend"
```

## Testing the Application

### 1. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

### 2. Test Customer Registration
1. Click "Register" on homepage
2. Fill in registration form
3. Login with your credentials

### 3. Test Admin Panel
1. Navigate to Admin Login
2. Create admin account (first-time only)
3. Login and manage products

### 4. API Testing with Postman
- Import API collection from backend documentation
- Set base URL to: `http://localhost:5000`
- Test endpoints manually

## Directory Structure

```
project/
├── backend/
│   ├── .env                 # ⭐ Create this file
│   ├── .env.example        # Reference configuration
│   ├── server.js           # Express server
│   ├── package.json        # Node dependencies
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── routes/            # API endpoints
│   ├── models/            # Database schemas
│   ├── middleware/        # Auth, upload handlers
│   └── uploads/           # User uploaded files
│
├── frontend/
│   ├── .env.local         # ⭐ Create this file (optional)
│   ├── .env.example       # Reference configuration
│   ├── public/            # Static files
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context
│   │   ├── utils/         # Utilities & API calls
│   │   └── hooks/         # Custom hooks
│   └── package.json       # React dependencies (proxy set to localhost:5000)
│
└── LOCAL_SETUP.md         # This file
```

## Environment Variables Explained

### Backend (.env)
| Variable | Purpose | Local Value |
|----------|---------|-------------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGO_URI | Database connection | mongodb://127.0.0.1:27017/myfashion |
| JWT_SECRET | Token signing key | any-secret-key |
| CLIENT_URL | Frontend URL (CORS) | http://localhost:3000 |

### Frontend (.env.local)
| Variable | Purpose | Local Value |
|----------|---------|-------------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000 |

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
```
Solution:
1. Ensure MongoDB service is running
2. Check MONGO_URI in .env matches your MongoDB setup
3. For MongoDB Atlas: use connection string with username/password
```

### Issue: "Port 5000 already in use"
```
Solution:
1. Change PORT in .env to another number (e.g., 5001)
2. Or kill the process using the port
3. PowerShell: Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### Issue: "CORS error on API calls"
```
Solution:
1. Verify backend .env CLIENT_URL = http://localhost:3000
2. Verify frontend proxy/API URL = http://localhost:5000
3. Backend server needs to be running
```

### Issue: "npm install fails"
```
Solution:
1. Clear npm cache: npm cache clean --force
2. Delete node_modules and package-lock.json
3. Try install again: npm install
4. Check Node.js version: node --version
```

### Issue: "Port 3000 already in use"
```
Solution:
1. Change port: set PORT=3001 && npm start (Windows)
2. Or kill process using port 3000
3. PowerShell: Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

## Database Setup

### MongoDB Local Installation (Optional)

If using local MongoDB instead of Atlas:

1. **Download & Install** from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   ```
3. **Verify Connection:**
   ```bash
   mongosh  # Or mongo in older versions
   > db.version()  # Should show MongoDB version
   ```

### MongoDB Atlas (Cloud - Recommended)

1. Sign up at [atlas.mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Update `.env` MONGO_URI with connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/myfashion?retryWrites=true&w=majority
   ```

## Production vs Local Differences

| Aspect | Local | Production |
|--------|-------|-----------|
| Backend Port | 5000 | 3000 (typically) |
| Frontend Port | 3000 | - (hosted) |
| Database | Local/Atlas | Managed service |
| CORS | localhost | domain |
| Domain | localhost | yoursite.com |
| SSL | Not used | Required |
| Logging | Console | File + monitoring |

## Next Steps

1. ✅ Servers running locally? 
2. ✅ Can access http://localhost:3000?
3. ✅ Can create account?
4. ✅ Can add products (admin)?

If all work, you have a fully functional local setup! 🎉

## Documentation Files

- [**README.md**](./README.md) - Project overview
- [**QUICKSTART.md**](./QUICKSTART.md) - Quick setup reference
- [**PROJECT_STRUCTURE.md**](./PROJECT_STRUCTURE.md) - Detailed file structure
- [**LOCAL_SETUP.md**](./LOCAL_SETUP.md) - This file (detailed local setup)

## Support

For issues:
1. Check this guide's "Common Issues" section
2. Check backend console for errors
3. Check browser console (F12) for frontend errors
4. Verify all services are running
5. Check MongoDB connection

---

**Happy coding! 🚀**
