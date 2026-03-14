const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const mongoURI = 'mongodb://localhost:27017/learning-platform';

async function createAdmin() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔌 Connected to MongoDB');

    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('🔄 Admin already exists, resetting password and role');
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(adminPassword, salt);
      admin.role = 'admin';
      admin.status = 'approved';
      await admin.save();
    } else {
      console.log('🆕 Creating new Admin account');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        status: 'approved'
      });
      await admin.save();
    }

    console.log('✅ Admin account ready:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createAdmin();
