const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔧 Connected to MongoDB');
    
    // Mettre à jour les utilisateurs avec instructorName undefined
    const result = await User.updateMany(
      { 
        requestedRole: 'instructor', 
        status: 'pending',
        instructorName: { $exists: false }
      },
      { 
        $set: { 
          instructorName: function() {
            // Extraire le nom d'instructeur du nom complet
            const names = this.name.split(' ');
            if (names.length >= 2) {
              return names.slice(1).join(' ');
            }
            return this.name;
          }
        }
      }
    );
    
    console.log('✅ Updated', result.modifiedCount, 'users with instructorName');
    
    // Vérifier la mise à jour
    const updatedUsers = await User.find({ 
      requestedRole: 'instructor', 
      status: 'pending' 
    });
    
    console.log('🔍 Updated users:');
    updatedUsers.forEach(user => {
      console.log('  -', user.name, '→ InstructorName:', user.instructorName);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
