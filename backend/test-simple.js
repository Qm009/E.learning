require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware dans le bon ordre
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser JSON AVANT les routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de test simple
app.post('/api/test-course', (req, res) => {
  console.log('🔍 Test route hit!');
  console.log('📝 req.body:', req.body);
  console.log('📝 req.body keys:', Object.keys(req.body));
  console.log('📝 req.body.duration:', req.body.duration);
  
  res.json({ 
    message: 'Test successful', 
    receivedData: req.body,
    durationReceived: req.body.duration
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/learning-platform')
  .then(() => {
    console.log('✅ MongoDB connected');
    
    const PORT = 5001; // Port différent pour éviter les conflits
    app.listen(PORT, () => {
      console.log(`🚀 Test server running on port ${PORT}`);
      console.log(`📡 Test URL: http://localhost:${PORT}/api/test-course`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
