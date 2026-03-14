const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, requestedRole = 'student', instructorName = '' } = req.body;
  
  console.log(' REGISTRATION ATTEMPT:');
  console.log('   Name:', name);
  console.log('   Email:', email);
  console.log('   Password length:', password?.length);
  console.log('   Requested Role:', requestedRole);
  console.log('   Instructor Name:', instructorName);

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log(' User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log(' Email available, creating user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Si demande de rôle instructeur, mettre en pending
    const role = requestedRole === 'instructor' ? 'student' : requestedRole;
    const status = requestedRole === 'instructor' ? 'pending' : 'approved';

    console.log(' Role assignment:', { role, status });

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      requestedRole,
      status,
      instructorName: requestedRole === 'instructor' ? instructorName : ''
    });

    await user.save();
    console.log(' User saved successfully:', user.name);

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, requestedRole: user.requestedRole }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
      expiresIn: '1h'
    });

    console.log(' Token generated for registration');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole
      } 
    });
  } catch (err) {
    console.error(' Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Login attempt:', { email, passwordLength: password?.length });
  
  try {
    // Forcer la recherche avec la connexion actuelle
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found');
      
      // Debug: lister tous les utilisateurs
      const allUsers = await User.find({});
      console.log('📋 All users in database:');
      if (allUsers.length === 0) {
        console.log('  (No users found - DATABASE EMPTY!)');
      } else {
        allUsers.forEach(u => {
          console.log('  -', u.email, '(role:', u.role, ')');
        });
      }
      
      return res.status(400).json({ message: 'Invalid credentials - User not found' });
    }

    console.log('✅ User found:', user.name, '(role:', user.role, ')');
    console.log('🔑 Stored password hash:', user.password.substring(0, 20) + '...');
    console.log('🔑 Comparing with provided password...');
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch');
      
      // Debug: tester avec un mot de passe connu
      if (email === 'admin@test.com') {
        console.log('🔧 DEBUG: Testing admin login...');
        const testMatch = await bcrypt.compare('admin123', user.password);
        console.log('🔧 Test with "admin123":', testMatch ? 'SUCCESS' : 'FAILED');
      }
      
      return res.status(400).json({ message: 'Invalid credentials - Password mismatch' });
    }

    console.log('✅ Password correct, generating token...');
    const payload = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      status: user.status,
      requestedRole: user.requestedRole
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', {
      expiresIn: '1h'
    });

    console.log('🎫 Token generated successfully');
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        status: user.status,
        requestedRole: user.requestedRole
      } 
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find().select('-password');
    console.log('📋 All users from database:', users);
    res.json(users);
  } catch (error) {
    console.error(' Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;