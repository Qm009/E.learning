require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(async () => {
    console.log('🔍 Connected to MongoDB');
    
    // Trouver l'utilisateur admin
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:');
    console.log('  - Name:', adminUser.name);
    console.log('  - Email:', adminUser.email);
    console.log('  - Role:', adminUser.role);
    console.log('  - Status:', adminUser.status);
    
    // Générer un token admin valide
    const token = jwt.sign({ 
      id: adminUser._id, 
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      status: adminUser.status,
      requestedRole: adminUser.requestedRole
    }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h'
    });
    
    console.log('✅ Generated admin token:');
    console.log(token);
    
    // Tester la route avec ce token
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/pending-instructors',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    const req = http.request(options, (res) => {
      console.log('🔑 Status:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('✅ Response length:', data.length);
        console.log('✅ Response preview:', data.substring(0, 200));
        
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Parsed data count:', jsonData.length);
          jsonData.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.name} - ${item.instructorName}`);
          });
        } catch (err) {
          console.error('❌ JSON parse error:', err.message);
        }
        
        process.exit(0);
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request error:', err.message);
      process.exit(1);
    });

    req.end();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
