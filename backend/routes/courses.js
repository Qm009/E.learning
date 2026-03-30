const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Configuration de multer pour l'upload d'images local (inchangé)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file) return cb(null, false);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
    cb(null, true);
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    // Dans Supabase, pour faire l'équivalent d'un .populate('instructor'), 
    // on demande explicitement les colonnes liées si la clé étrangère est configurée.
    const { data: courses, error } = await req.supabase
      .from('courses')
      .select(`
        *,
        instructor (id, name, email)
      `);
      
    if (error) throw error;
    res.json(courses || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: course, error } = await req.supabase
      .from('courses')
      .select(`
        *,
        instructor (id, name, email)
      `)
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get instructor's courses
router.get('/instructor', auth, roleAuth(['instructor', 'admin']), async (req, res) => {
  try {
    const { data: courses, error } = await req.supabase
      .from('courses')
      .select('*')
      // Selon ton schéma, la colonne référençant l'instructeur peut s'appeler "instructor" (UUID) ou "instructor_id"
      .eq('instructor', req.user.id);

    if (error) throw error;
    res.json(courses || []);
  } catch (err) {
    console.error('❌ Error getting instructor courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course (instructor/admin only)
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing form data/image', error: err.message });
    }
    next();
  });
}, auth, roleAuth(['instructor', 'admin']), async (req, res) => {
  try {
    let chapters = req.body.chapters;
    if (typeof chapters === 'string') {
      try { chapters = JSON.parse(chapters); } 
      catch (e) { chapters = []; }
    }

    const courseData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price ? Number(req.body.price) : 0,
      duration: req.body.duration,
      instructor: req.user.id, // ID local UUID
      image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || ''),
      files: req.body.files || [],
      chapters: chapters || [],
      status: req.body.status || 'draft',
      enrolledStudents: [] // initialisé vide
    };
    
    const { data: course, error } = await req.supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(course);
  } catch (err) {
    console.error('❌ Error creating course:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update course (instructor/admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Vérifier l'appartenance
    const { data: course } = await req.supabase.from('courses').select('instructor').eq('id', req.params.id).maybeSingle();
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.instructor !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { data: updatedCourse, error } = await req.supabase
      .from('courses')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (instructor/admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { data: course } = await req.supabase.from('courses').select('instructor').eq('id', req.params.id).maybeSingle();
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { error } = await req.supabase.from('courses').delete().eq('id', req.params.id);
    if (error) throw error;
    
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const { data: course, error } = await req.supabase.from('courses').select('enrolledStudents').eq('id', req.params.id).maybeSingle();
    
    if (error || !course) return res.status(404).json({ message: 'Course not found' });
    
    const enrolledIds = course.enrolledStudents || [];
    
    if (enrolledIds.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    
    enrolledIds.push(req.user.id);
    
    const { error: updateError } = await req.supabase
      .from('courses')
      .update({ enrolledStudents: enrolledIds })
      .eq('id', req.params.id);
      
    if (updateError) throw updateError;
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;