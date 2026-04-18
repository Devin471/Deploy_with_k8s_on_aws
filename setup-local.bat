@echo off
REM Windows Local Development Setup Script
REM Creates .env files and provides setup instructions

echo.
echo ==================================================
echo   Fashion E-Commerce Local Setup (Windows)
echo ==================================================
echo.

REM Create backend .env
if not exist "backend\.env" (
    echo Creating backend\.env...
    (
        echo # Backend Environment Variables - Local Development
        echo PORT=5000
        echo NODE_ENV=development
        echo MONGO_URI=mongodb://127.0.0.1:27017/myfashion
        echo JWT_SECRET=dev-secret-key-change-in-production
        echo CLIENT_URL=http://localhost:3000
        echo GOOGLE_CLIENT_ID=your-google-client-id
        echo GOOGLE_CLIENT_SECRET=your-google-client-secret
        echo RAZORPAY_KEY_ID=your-razorpay-key-id
        echo RAZORPAY_KEY_SECRET=your-razorpay-key-secret
    ) > backend\.env
    echo [OK] backend\.env created
) else (
    echo [INFO] backend\.env already exists
)

REM Create frontend .env.local
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local...
    (
        echo # Frontend Environment Variables - Local Development
        echo REACT_APP_API_URL=http://localhost:5000
        echo REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
    ) > frontend\.env.local
    echo [OK] frontend\.env.local created
) else (
    echo [INFO] frontend\.env.local already exists
)

echo.
echo ==================================================
echo   Setup Summary
echo ==================================================
echo.
echo [OK] Environment files created successfully
echo.
echo Next Steps:
echo ═══════════════════════════════════════════════
echo 1. Ensure MongoDB is running:
echo    Start MongoDB Service or run: mongod
echo.
echo 2. Install dependencies (from project root):
echo    npm run setup
echo.
echo 3. Start development servers (open 2 terminals):
echo    Terminal 1: npm run dev:backend
echo    Terminal 2: npm run dev:frontend
echo.
echo 4. Open browser and visit:
echo    http://localhost:3000
echo ═══════════════════════════════════════════════
echo.
pause
