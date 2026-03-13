require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/user.model');

const { hashPassword } = require('../utils/password');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.ADMIN_PASSWORD || 'admin@123';

  await User.deleteMany({ email: null });

  const existing = await User.findOne({ email, role: 'admin' });
  if (existing) {
    return { created: false, email, password: 'already_set' };
  }

  await User.create({
    fullName: 'Super Admin',
    email,
    password: await hashPassword(password),
    role: 'admin'
  });

  return { created: true, email, password };
}

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/school_erp';
  await connectDB(mongoUri);

  const admin = await seedAdmin();

  console.log('\nSEED SUMMARY');
  console.log('Admin:', admin);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
