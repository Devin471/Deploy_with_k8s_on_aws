#!/usr/bin/env node
/**
 * Local Development Setup Script
 * Automatically creates .env files for local development
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚀 Fashion E-Commerce Local Setup\n');

// Backend .env setup
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendEnvContent = `# Backend Environment Variables - Local Development
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/myfashion
JWT_SECRET=dev-secret-key-change-in-production
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
`;

// Frontend .env.local setup
const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
const frontendEnvContent = `# Frontend Environment Variables - Local Development
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
`;

try {
  // Create backend .env if not exists
  if (!fs.existsSync(backendEnvPath)) {
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend/.env');
  } else {
    console.log('ℹ️  backend/.env already exists');
  }

  // Create frontend .env.local if not exists
  if (!fs.existsSync(frontendEnvPath)) {
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created frontend/.env.local');
  } else {
    console.log('ℹ️  frontend/.env.local already exists');
  }

  console.log('\n📋 Setup Summary:');
  console.log('═══════════════════════════════════════════════');
  console.log('✅ Environment files created successfully');
  console.log('\n📝 Next Steps:');
  console.log('1. Ensure MongoDB is running:');
  console.log('   Windows: net start MongoDB');
  console.log('   Mac: brew services start mongodb-community');
  console.log('   Linux: systemctl start mongod');
  console.log('\n2. Install dependencies:');
  console.log('   npm run setup');
  console.log('\n3. Start backend & frontend:');
  console.log('   Terminal 1: npm run dev:backend');
  console.log('   Terminal 2: npm run dev:frontend');
  console.log('\n4. Open browser:');
  console.log('   http://localhost:3000');
  console.log('═══════════════════════════════════════════════\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
