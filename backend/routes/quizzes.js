const express = require('express');
const QuizResult = require('../models/QuizResult');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Save quiz result
router.post('/results', auth, async (req, res) => {
  try {
    const { courseId, score, answers, totalQuestions } = req.body;

    const quizResult = new QuizResult({
      user: req.user.id,
      course: courseId,
      score,
      answers,
      totalQuestions
    });

    await quizResult.save();
    res.status(201).json({ message: 'Quiz result saved successfully', quizResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz results for a user
router.get('/results/:userId', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ user: req.params.userId })
      .populate('course', 'title category')
      .sort({ completedAt: -1 });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz results for a course
router.get('/course/:courseId/results', auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ course: req.params.courseId })
      .populate('user', 'name email')
      .sort({ completedAt: -1 });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's quiz result for a specific course
router.get('/results/:userId/course/:courseId', auth, async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      user: req.params.userId,
      course: req.params.courseId
    }).sort({ completedAt: -1 });

    if (!result) {
      return res.status(404).json({ message: 'Quiz result not found' });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;