const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/serviceDashboardDB');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create default users
    const users = [
      {
        username: 'ns6',
        password: '1qaz!QAZ',
        role: 'admin',
        isActive: true
      },
      {
        username: 'mobitel',
        password: '1qaz!QAZ',
        role: 'user',
        isActive: true
      },
      {
        username: 'huawei',
        password: '1qaz!QAZ',
        role: 'user',
        isActive: true
      }
    ];

    // Insert users (password will be hashed automatically by the pre-save middleware)
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username} (${user.role})`);
    }

    console.log('Users seeded successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Admin - Username: ns6, Password: 1qaz!QAZ');
    console.log('User - Username: mobitel, Password: 1qaz!QAZ');
    console.log('User - Username: huawei, Password: 1qaz!QAZ');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Run seeder
connectDB().then(() => {
  seedUsers();
});
