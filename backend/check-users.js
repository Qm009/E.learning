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
      console.log('  -', user.name, '(', user.email, ') - Status:', user.status, 'Requested Role:', user.requestedRole);
    });
    
    // Chercher Seydou spécifiquement
    const seydou = await User.findOne({ email: { $regex: 'seydou', $options: 'i' } });
    if (seydou) {
      console.log('👤 Seydou found:', seydou.name, '- Role:', seydou.role, '- Status:', seydou.status, '- RequestedRole:', seydou.requestedRole);
    } else {
      console.log('❌ Seydou not found');
    }
    
    // Tous les utilisateurs
    const allUsers = await User.find({});
    console.log('👥 All users:', allUsers.length);
    allUsers.forEach(user => {
      console.log('  -', user.name, '(', user.email, ') - Role:', user.role, '- Status:', user.status, '- RequestedRole:', user.requestedRole);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
