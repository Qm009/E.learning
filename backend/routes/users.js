const express = require('express');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Routes (order matters - specific routes first)
router.get('/pending-instructors', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const { data: pendingUsers, error } = await req.supabase
      .from('users')
      .select('id, name, email, instructorName, expertise, motivation, requestedRole, status')
      .eq('status', 'pending')
      .eq('requestedRole', 'instructor');
      
    if (error) throw error;
    res.json(pendingUsers || []);
  } catch (err) {
    console.error('Error in pending-instructors route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { data: user, error } = await req.supabase
      .from('users')
      .select('id, name, email, role, status, requestedRole, instructorName, expertise, motivation')
      .eq('id', req.params.id)
      .maybeSingle();
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users (admin only)
router.get('/', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const { data: users, error } = await req.supabase
      .from('users')
      .select('id, name, email, role, status, requestedRole, instructorName, expertise, motivation');
      
    if (error) throw error;
    res.json(users || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve instructor request (admin only)
router.post('/approve-instructor/:userId', auth, roleAuth(['admin']), async (req, res) => {
  try {
    // Vérifier d'abord si l'utilisateur existe
    const { data: checkUser } = await req.supabase.from('users').select('id').eq('id', req.params.userId).maybeSingle();
    if (!checkUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: user, error } = await req.supabase
      .from('users')
      .update({ role: 'instructor', status: 'approved' })
      .eq('id', req.params.userId)
      .select('id, name, email, role, status')
      .single();

    if (error) throw error;

    const notificationTimestamp = Date.now().toString();
    res.json({ message: 'Instructor request approved', user, notificationTimestamp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject instructor request (admin only)
router.post('/reject-instructor/:userId', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const { data: checkUser } = await req.supabase.from('users').select('id').eq('id', req.params.userId).maybeSingle();
    if (!checkUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: user, error } = await req.supabase
      .from('users')
      .update({ requestedRole: 'student', status: 'rejected' })
      .eq('id', req.params.userId)
      .select('id, name, email, role, status, requestedRole')
      .single();

    if (error) throw error;
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
    // Si on essaie de mettre à jour le mot de passe dans cette route, on le gère à part (ou on le bloque)
    // Pour l'instant on enlève le mot de passe si jamais il est envoyé
    const updates = { ...req.body };
    delete updates.password; 

    const { data: user, error } = await req.supabase
      .from('users')
      .update(updates)
      .eq('id', req.params.id)
      .select('id, name, email, role, status, requestedRole, instructorName, expertise, motivation')
      .single();

    if (error) throw error;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const { error } = await req.supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;