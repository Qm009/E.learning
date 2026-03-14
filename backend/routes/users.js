const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Routes (order matters - specific routes first)
router.get('/pending-instructors', auth, roleAuth(['admin']), async (req, res) => {
  try {
    console.log('🔍 Fetching pending instructors...');
    console.log('👤 User from req.user:', req.user);
    
    const pendingUsers = await User.find({ 
      requestedRole: 'instructor', 
      status: 'pending' 
    }).select('-password');
    
    console.log('✅ Found pending users:', pendingUsers.length);
    console.log('✅ Pending users details:', pendingUsers.map(u => ({ name: u.name, instructorName: u.instructorName })));
    
    res.json(pendingUsers);
  } catch (err) {
    console.error('❌ Error in pending-instructors route:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('❌ Error in user by ID route:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (admin only)
router.get('/', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve instructor request (admin only)
router.post('/approve-instructor/:userId', auth, roleAuth(['admin']), async (req, res) => {
  try {
    console.log('🔓 Approving instructor request...');
    console.log('👤 User from req.user:', req.user);
    
    const user = await User.findById(req.params.userId);
    
    console.log('✅ Found user to approve:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = 'instructor';
    user.status = 'approved';
    await user.save();

    // Stocker la notification pour le frontend
    const notificationTimestamp = Date.now().toString();
    
    res.json({ 
      message: 'Instructor request approved', 
      user,
      notificationTimestamp 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject instructor request (admin only)
router.post('/reject-instructor/:userId', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.requestedRole = 'student';
    user.status = 'rejected';
    await user.save();

    res.json({ message: 'Instructor request rejected', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;