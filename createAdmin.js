// Run once to create your first admin login: node scripts/createAdmin.js you@example.com yourPassword
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function run() {
  const [,, email, password] = process.argv;
  if (!email || !password) {
    console.log('Usage: node scripts/createAdmin.js <email> <password>');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash },
    { upsert: true, new: true }
  );
  console.log('Admin ready:', admin.email);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
