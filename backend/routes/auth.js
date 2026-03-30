const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, requestedRole = 'student', instructorName = '', expertise = '', motivation = '' } = req.body;
  
  try {
    // 1. Vérifier si l'utilisateur existe dans Supabase
    const { data: existingUser } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = requestedRole === 'instructor' ? 'student' : requestedRole;
    const status = requestedRole === 'instructor' ? 'pending' : 'approved';

    // 2. Créer l'utilisateur dans Supabase
    const { data: user, error } = await req.supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          role,
          requestedRole,
          status,
          instructorName: requestedRole === 'instructor' ? instructorName : '',
          expertise: requestedRole === 'instructor' ? expertise : '',
          motivation: requestedRole === 'instructor' ? motivation : ''
        }
      ])
      .select()
      .single();

    if (error) {
       console.error("Erreur insertion Supabase:", error);
       return res.status(500).json({ message: 'Error creating user in Supabase', details: error.message });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, requestedRole: user.requestedRole }, 
      process.env.JWT_SECRET || 'your_jwt_secret_here', 
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, requestedRole: user.requestedRole } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Chercher l'utilisateur avec Supabase
    const { data: user, error } = await req.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials - User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials - Password mismatch' });
    }

    const payload = { 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      status: user.status,
      requestedRole: user.requestedRole
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_here', { expiresIn: '1h' });

    res.json({ token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const { data: user, error } = await req.supabase
      .from('users')
      .select('id, name, email, role, status, requestedRole, instructorName, expertise, motivation')
      .eq('id', req.user.id)
      .single();
      
    if (error || !user) throw new Error('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { data: users, error } = await req.supabase
      .from('users')
      .select('id, name, email, role, status, requestedRole, instructorName, expertise, motivation');
      
    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;