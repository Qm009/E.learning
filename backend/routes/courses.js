const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Configuration de multer pour l'upload d'images
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
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Si pas de fichier, continuer
    if (!file) {
      return cb(null, false);
    }
    
    // Vérifier si c'est une image
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
    cb(null, true);
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email').populate('enrolledStudents', 'name email');
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
    const courses = await Course.find({ instructor: req.user.id }).populate('enrolledStudents', 'name email');
    res.json(courses);
  } catch (err) {
    console.error('❌ Error getting instructor courses:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course (instructor/admin only)
router.post('/', auth, roleAuth(['instructor', 'admin']), async (req, res) => {
  try {
    console.log('🔍 Creating course...');
    console.log('👤 User from req.user:', req.user);
    console.log('👤 User role:', req.user.role);
    console.log('📝 req.body:', req.body);
    console.log('📝 req.body.duration:', req.body.duration);
    console.log('📝 req.body.files:', req.body.files);
    console.log('📝 req.body.chapters:', req.body.chapters);
    console.log('📝 req.body keys:', Object.keys(req.body));
    
    const courseData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      duration: req.body.duration,
      instructor: req.user.id,
      image: req.body.image || '',
      files: req.body.files || [],
      chapters: req.body.chapters || [],
      status: req.body.status || 'draft'
    };
    
    console.log('✅ Course data prepared:', courseData);
    console.log('📁 Files in courseData:', courseData.files);
    
    const course = new Course(courseData);
    await course.save();
    
    console.log('✅ Course created successfully:', course);
    console.log('📁 Files in saved course:', course.files);
    res.json(course);
  } catch (err) {
    console.error('❌ Error creating course:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update course (instructor/admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('🔍 Updating course...');
    console.log('👤 User from req.user:', req.user);
    console.log('👤 User role:', req.user.role);
    console.log('📝 req.body:', req.body);
    console.log('📝 req.body keys:', Object.keys(req.body));
    
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (instructor/admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    course.enrolledStudents.push(req.user.id);
    await course.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;