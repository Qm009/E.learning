const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  image: {
    type: String,
    default: ''
  },
  files: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String,
    type: {
      type: String,
      enum: ['image', 'document'],
      default: 'document'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  chapters: [{
    title: String,
    content: String,
    duration: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  lessons: [{
    title: String,
    content: String,
    videoUrl: String
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);