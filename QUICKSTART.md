# Quick Start Guide - Fashion E-Commerce on Local Machine

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [Atlas](https://www.mongodb.com/cloud/atlas))

### Quick Commands

**Windows:**
```bash
setup-local.bat
```

**Mac/Linux:**
```bash
node setup-local.js
```

**Or Manual Setup:**

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend  
npm install
npm start
```

✅ **Visit:** http://localhost:3000

---

## Detailed Setup

### Step 1: Environment Setup

**Option A: Automatic (Windows)**
```bash
# Double-click setup-local.bat
setup-local.bat
```

**Option B: Manual**
1. Copy `backend/.env.example` → `backend/.env`
2. Copy `frontend/.env.example` → `frontend/.env.local`
3. Update values if needed (defaults work for local)

### Step 2: Backend Setup (Node.js/Express)

Open Terminal 1:
```bash
cd backend
npm install
npm run dev
```

✅ Backend runs at: `http://localhost:5000`

The backend includes:
- Express.js server with MongoDB
- JWT authentication
- Complete REST API for products, orders, and admin

### Step 3: Frontend Setup (React.js)

Open Terminal 2:
```bash
cd frontend
npm install
npm start
```

✅ Frontend runs at: `http://localhost:3000`

React will automatically open in your browser!

## Access Points

### 🛍️ Customer Interface
- **Home:** http://localhost:3000
- **Shop:** http://localhost:3000/shop
- **Browse Products, Add to Cart, Checkout**

### 👨‍💼 Admin/Seller Interface
- **Admin Login:** http://localhost:3000/admin-login
- **Seller Login:** http://localhost:3000/seller-login
- **Dashboard:** After login

### First Time Setup
1. **Customer:** Click "Register" on homepage, create account
2. **Admin:** Click "Create Account" on admin login page
3. **Seller:** Click "Register" on seller login page

## What Each Technology Does

### Frontend (React.js)
- **App.js** - Main component with routing
- **Navbar.js** - Navigation between pages
- **Shop.js** - Products page with search/filter
- **Admin.js** - Dashboard, add/edit/delete products
- **Login.js** - Admin authentication
- **ProductCard.js** - Reusable product component
- **Pages/** - Home, Shop, Admin, Login pages

### Backend (Node.js/Express)
- **server.js** - Main server file with all API routes
- **Routes:**
  - `/api/designs` - Product management
  - `/api/orders` - Order management
  - `/api/auth` - Login/registration
  - `/api/stats` - Dashboard statistics
- **Database:** SQLite (auto-created as `fashion_store.db`)
- **Authentication:** JWT tokens

## File Structure Reference

```
frontend/
├── public/index.html           # HTML root
├── src/
│   ├── App.js                  # Main app with routes
│   ├── index.js                # React entry point
│   ├── components/
│   │   ├── Navbar.js          # Top navigation
│   │   └── ProductCard.js      # Product display
│   └── pages/
│       ├── Home.js            # Landing page
│       ├── Shop.js            # Product catalog
│       ├── Admin.js           # Admin panel
│       └── Login.js           # Login form
└── package.json

backend/
├── server.js                   # Express server with ALL routes
├── .env                        # Config (PORT, JWT_SECRET)
├── package.json                # Dependencies
├── schema.sql                  # Database structure (reference)
└── sample_data.sql            # Sample products (reference)
```

## Common Tasks

### Add a New Product (as Admin)
1. Log in: http://localhost:3000/login
2. Go to "Add Design" in admin panel
3. Fill in: Name, Description, Category, Price, Stock, Image URL
4. Click "Add Design"
5. Product appears on shop page

### View All Products (as Customer)
1. Go to http://localhost:3000/shop
2. See all designs
3. Use search box to find specific designs
4. Filter by category

### Check Database
Database file: `backend/fashion_store.db`

### API Testing
```bash
# Get all designs
curl http://localhost:5000/api/designs

# Get all orders
curl http://localhost:5000/api/orders
```

## Troubleshooting

### "Cannot GET /"
- Make sure both backend AND frontend are running
- Frontend at 3000, Backend at 5000

### "API Error" in browser console
- Check backend is running: `http://localhost:5000/api/designs` (in browser)
- Check CORS settings in server.js

### Port 5000 or 3000 already in use
```bash
# Find what's using the port and close it
# Or change PORT in backend/.env and proxy in frontend/package.json
```

### Database issues
```bash
# Delete the database and restart backend
rm backend/fashion_store.db
npm start (in backend folder)
# It will recreate the database automatically
```

### React app won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## Environment Variables

**Backend (backend/.env)**
```
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

Change these for production!

## Development vs Production

**Development** (Current)
- `NODE_ENV=development` in .env
- Debug console logs enabled
- Hot reload on file changes
- SQLite file-based database

**Production** (Later)**
```bash
# Frontend
npm run build
# Creates optimized build/ folder for deployment

# Backend
NODE_ENV=production npm start
```

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express, SQLite |
| Auth | JWT tokens, bcryptjs hashing |
| Database | SQLite (auto-created) |
| API | RESTful with CORS |

## What's Included

✅ Complete CRUD for products (Create, Read, Update, Delete)
✅ Admin authentication with JWT
✅ Product search and filtering
✅ Order management
✅ Dashboard with stats
✅ Responsive design (mobile-friendly)
✅ Sample data included
✅ SQLite database (no setup needed)

## Next Steps

1. ✅ Run backend and frontend
2. ✅ View products on shop page
3. ✅ Log in as admin
4. ✅ Add new products
5. ✅ Test filtering and search
6. 📝 Customize styling in CSS files
7. 🚀 Deploy to production

## Useful Links

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- Node.js Docs: https://nodejs.org/docs

---

**Happy coding! Questions? Check README.md or backend/README.md**
