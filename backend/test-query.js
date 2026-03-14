require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 Testing direct database query...');
    
    // Tester la même requête que dans la route
    const pendingUsers = await User.find({ 
      requestedRole: 'instructor', 
      status: 'pending' 
    }).select('-password');
    
    console.log('✅ Query successful, found:', pendingUsers.length, 'users');
    
    pendingUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} - ${user.instructorName}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
