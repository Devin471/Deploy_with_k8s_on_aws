/* ═══════════════════════════════════════════════════════
   Check Admin Credentials
   Run: node check-admin.js
   ═══════════════════════════════════════════════════════ */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

async function checkAdmin() {
  try {
    await connectDB();
    console.log('🔍 Checking admin records...\n');

    const admins = await Admin.find();
    
    if (admins.length === 0) {
      console.log('❌ No admin found in database');
    } else {
      console.log(`Found ${admins.length} admin(s):\n`);
      admins.forEach((admin, i) => {
        console.log(`${i + 1}. Email: ${admin.email}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   ID: ${admin._id}\n`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkAdmin();
