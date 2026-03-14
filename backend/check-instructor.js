const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 Connected to MongoDB');
    
    // Chercher les utilisateurs avec demande instructeur
    const pendingInstructors = await User.find({ 
      requestedRole: 'instructor', 
      status: 'pending' 
    });
    
    console.log('📋 Pending instructor requests:', pendingInstructors.length);
    pendingInstructors.forEach(user => {
      console.log('  - Nom:', user.name);
      console.log('  - Email:', user.email);
      console.log('  - Nom d instructeur:', user.instructorName);
      console.log('  - Status:', user.status);
      console.log('  - RequestedRole:', user.requestedRole);
      console.log('  ---');
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
