const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 DIAGNOSTIC COMPLET DE L\'AUTHENTIFICATION');
    
    // 1. Vérifier la connexion à la base
    console.log('\n📊 1. ÉTAT DE LA BASE DE DONNÉES:');
    const db = mongoose.connection;
    console.log('   Nom:', db.name);
    console.log('   Host:', db.host);
    console.log('   Port:', db.port);
    console.log('   État:', db.readyState === 1 ? '✅ Connecté' : '❌ Non connecté');
    
    // 2. Compter tous les utilisateurs
    console.log('\n👥 2. COMPTAGE DES UTILISATEURS:');
    const totalUsers = await User.countDocuments();
    console.log('   Total:', totalUsers, 'utilisateurs');
    
    // 3. Vérifier l'utilisateur admin
    console.log('\n👨‍💼 3. VÉRIFICATION ADMIN:');
    const admin = await User.findOne({ email: 'admin@test.com' });
    if (admin) {
      console.log('   ✅ Admin trouvé:', admin.name);
      console.log('   📧 Email:', admin.email);
      console.log('   🔑 Role:', admin.role);
      console.log('   📊 Status:', admin.status);
      console.log('   🔐 Hash:', admin.password.substring(0, 30) + '...');
      
      // Test direct du mot de passe
      console.log('\n   🧪 TEST DIRECT DU MOT DE PASSE:');
      const testPasswords = ['admin', 'admin123', 'password', '123456'];
      for (const pwd of testPasswords) {
        try {
          const match = await bcrypt.compare(pwd, admin.password);
          console.log(`      "${pwd}": ${match ? '✅ VALIDE' : '❌ INVALIDE'}`);
          if (match) {
            console.log('      🎉 MOT DE PASSE TROUVÉ:', pwd);
            break;
          }
        } catch (err) {
          console.log(`      "${pwd}": ❌ ERREUR DE TEST:`, err.message);
        }
      }
    } else {
      console.log('   ❌ Admin NON TROUVÉ');
    }
    
    // 4. Vérifier l'instructeur
    console.log('\n👨‍🏫 4. VÉRIFICATION INSTRUCTEUR:');
    const instructor = await User.findOne({ email: 'seydou@gmail.com' });
    if (instructor) {
      console.log('   ✅ Instructeur trouvé:', instructor.name);
      console.log('   📧 Email:', instructor.email);
      console.log('   🔑 Role:', instructor.role);
      console.log('   📊 Status:', instructor.status);
      console.log('   🔐 Hash:', instructor.password.substring(0, 30) + '...');
      
      // Test direct du mot de passe
      console.log('\n   🧪 TEST DIRECT DU MOT DE PASSE:');
      const testPasswords = ['seydou', 'seydou123', 'password', '123456'];
      for (const pwd of testPasswords) {
        try {
          const match = await bcrypt.compare(pwd, instructor.password);
          console.log(`      "${pwd}": ${match ? '✅ VALIDE' : '❌ INVALIDE'}`);
          if (match) {
            console.log('      🎉 MOT DE PASSE TROUVÉ:', pwd);
            break;
          }
        } catch (err) {
          console.log(`      "${pwd}": ❌ ERREUR DE TEST:`, err.message);
        }
      }
    } else {
      console.log('   ❌ Instructeur NON TROUVÉ');
    }
    
    // 5. Créer un utilisateur de test si nécessaire
    console.log('\n➕ 5. CRÉATION D\'UTILISATEUR DE TEST:');
    const testUser = await User.findOne({ email: 'test@test.com' });
    if (!testUser) {
      console.log('   📝 Création d\'un utilisateur de test...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123', salt);
      
      const newUser = new User({
        name: 'Test User',
        email: 'test@test.com',
        password: hashedPassword,
        role: 'student',
        status: 'approved'
      });
      
      await newUser.save();
      console.log('   ✅ Utilisateur de test créé:');
      console.log('      📧 Email: test@test.com');
      console.log('      🔑 Mot de passe: test123');
    } else {
      console.log('   ℹ️ Utilisateur de test déjà existe');
    }
    
    console.log('\n🎯 6. RÉCAPITULATIF DES IDENTIFIANTS VALIDES:');
    console.log('   👨‍💼 ADMIN:');
    console.log('      📧 admin@test.com');
    console.log('      🔑 admin');
    console.log('   👨‍🏫 INSTRUCTEUR:');
    console.log('      📧 seydou@gmail.com');
    console.log('      🔑 seydou123');
    console.log('   👨‍🎓 TEST:');
    console.log('      📧 test@test.com');
    console.log('      🔑 test123');
    
    console.log('\n✅ DIAGNOSTIC TERMINÉ - Essayez ces identifiants!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });
