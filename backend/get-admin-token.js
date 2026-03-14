require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');

async function getAdminToken() {
  try {
    // Connect to MongoDB
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/learning-platform');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    // Generate token
    const token = jwt.sign(
      { 
        id: admin._id, 
        name: admin.name, 
        email: admin.email, 
        role: admin.role, 
        status: admin.status, 
        requestedRole: admin.requestedRole 
      }, 
      process.env.JWT_SECRET || 'your_jwt_secret_here', 
      { expiresIn: '1h' }
    );
    
    console.log('✅ Admin token generated:');
    console.log(token);
    console.log('\n📋 User info:');
    console.log('ID:', admin._id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Status:', admin.status);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

getAdminToken();
