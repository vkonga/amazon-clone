require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user.model');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI not set in environment.');
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB Atlas for User Service...');
  await mongoose.connect(uri);

  // Clear existing
  await User.deleteMany({});
  console.log('Cleared existing users.');

  // Create default admin
  const adminUser = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpassword123',
    role: 'Admin'
  });

  await adminUser.save();
  console.log('Successfully seeded Admin User!');
  console.log('Email: admin@example.com');
  console.log('Password: adminpassword123');

  await mongoose.disconnect();
  console.log('Seeding complete. Connection closed.');
}

run().catch(err => {
  console.error('Error seeding users:', err);
  process.exit(1);
});
