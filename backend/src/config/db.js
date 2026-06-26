const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let isConnected = false;

async function seedUsers() {
  try {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default test user accounts...');
      
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
      const defaultPasswordHash = await bcrypt.hash('Password123!', saltRounds);

      await User.create([
        {
          name: 'Test Admin',
          email: 'admin@bloodbank.com',
          passwordHash: defaultPasswordHash,
          role: 'admin',
          isEmailVerified: true
        },
        {
          name: 'Test Donor',
          email: 'donor@bloodbank.com',
          passwordHash: defaultPasswordHash,
          role: 'donor',
          isEmailVerified: true
        },
        {
          name: 'Test Hospital',
          email: 'hospital@bloodbank.com',
          passwordHash: defaultPasswordHash,
          role: 'hospital',
          isEmailVerified: true
        }
      ]);
      console.log('Default test users seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding default test users:', err);
  }
}

async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  await mongoose.connect(uri);
  isConnected = true;
  
  // Seed the test users in background
  seedUsers();
}

module.exports = connectDB;

