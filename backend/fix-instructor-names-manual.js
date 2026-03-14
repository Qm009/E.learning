const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔧 Connected to MongoDB');
    
    // Mettre à jour manuellement chaque utilisateur
    const updates = [
      { email: 'aboubakar@gmail.com', instructorName: 'Aboubakar' },
      { email: 'basafia@gmail.com', instructorName: 'Safiatou' },
      { email: 'oumou@gmail.com', instructorName: 'Oumou' },
      { email: 'seydou@gmail.com', instructorName: 'Seydou' }
    ];
    
    for (const update of updates) {
      const result = await User.updateOne(
        { email: update.email },
        { $set: { instructorName: update.instructorName } }
      );
      console.log('✅ Updated', update.email, '→', update.instructorName, ':', result.modifiedCount > 0 ? 'SUCCESS' : 'NO CHANGE');
    }
    
    // Vérifier la mise à jour
    const updatedUsers = await User.find({ 
      requestedRole: 'instructor', 
      status: 'pending' 
    });
    
    console.log('🔍 Final verification:');
    updatedUsers.forEach(user => {
      console.log('  -', user.name, '(', user.email, ') → InstructorName:', user.instructorName);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
