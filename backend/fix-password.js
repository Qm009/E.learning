const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 Connected to MongoDB - Fixing passwords');
    
    // Fix instructor password
    const instructor = await User.findOne({ email: 'seydou@gmail.com' });
    if (instructor) {
      const newPassword = 'seydou123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await User.updateOne(
        { email: 'seydou@gmail.com' },
        { password: hashedPassword }
      );
      
      console.log('✅ Instructor password updated!');
      console.log('📧 Email: seydou@gmail.com');
      console.log('🔑 New password: seydou123');
      console.log('🎯 You can now login with these credentials!');
    } else {
      console.log('❌ Instructor not found');
    }
    
    // Test the new password
    console.log('\n🧪 TESTING NEW PASSWORD:');
    const testUser = await User.findOne({ email: 'seydou@gmail.com' });
    const isMatch = await bcrypt.compare('seydou123', testUser.password);
    console.log(`🔑 Password "seydou123": ${isMatch ? '✅ WORKS!' : '❌ FAILED'}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
