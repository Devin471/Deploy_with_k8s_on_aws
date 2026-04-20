/* ═══════════════════════════════════════════════════════
   Update Admin Credentials Script
   Run: node update-admin.js
   ═══════════════════════════════════════════════════════ */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

async function updateAdmin() {
  try {
    await connectDB();
    console.log('🔄 Updating admin credentials...');

    const updatedAdmin = await Admin.findOneAndUpdate(
      {}, // Update first admin (or specify email if you want to be more specific)
      {
        email: 'devintyagi471@gmail.com',
        password: 'TerabaapAdmin@471'
      },
      { new: true, runValidators: true }
    );

    if (updatedAdmin) {
      console.log('✅ Admin updated successfully!');
      console.log(`   Email: ${updatedAdmin.email}`);
      console.log(`   Name: ${updatedAdmin.name}`);
    } else {
      console.log('❌ No admin found to update');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating admin:', err.message);
    process.exit(1);
  }
}

updateAdmin();
