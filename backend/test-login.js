const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 Connected to MongoDB - Testing login credentials');
    
    // Test admin login
    console.log('\n🔐 TESTING ADMIN LOGIN:');
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (admin) {
      console.log('✅ Admin found:', admin.name);
      
      // Test different passwords
      const passwords = ['admin', 'admin123', 'password', '123456'];
      for (const pwd of passwords) {
        const isMatch = await bcrypt.compare(pwd, admin.password);
        console.log(`🔑 Password "${pwd}": ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
        if (isMatch) {
          console.log('🎉 ADMIN PASSWORD FOUND:', pwd);
          break;
        }
      }
    } else {
      console.log('❌ Admin not found');
    }
    
    // Test instructor login
    console.log('\n🔐 TESTING INSTRUCTOR LOGIN (ki seydou):');
    const instructor = await User.findOne({ email: 'seydou@gmail.com' });
    if (instructor) {
      console.log('✅ Instructor found:', instructor.name);
      
      // Test different passwords
      const passwords = ['seydou', 'password', '123456', 'instructor'];
      for (const pwd of passwords) {
        const isMatch = await bcrypt.compare(pwd, instructor.password);
        console.log(`🔑 Password "${pwd}": ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
        if (isMatch) {
          console.log('🎉 INSTRUCTOR PASSWORD FOUND:', pwd);
          break;
        }
      }
    } else {
      console.log('❌ Instructor not found');
    }
    
    // Show all users with their roles
    console.log('\n📋 ALL USERS SUMMARY:');
    const allUsers = await User.find({});
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Password hash: ${user.password.substring(0, 30)}...`);
      console.log('---');
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
