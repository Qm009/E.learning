const express = require('express');
const supabase = require('./config/supabase');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Appliquer helmet après CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Injecter Supabase dans l'objet "req" pour l'utiliser partout dans les routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Vérifier la connexion Supabase basique
supabase.from('users').select('id').limit(1)
  .then(({ error }) => {
    if (error) {
       console.log('⚠️ La table "users" n\'existe pas encore ou erreur de connexion :', error.message);
    } else {
       console.log('✅ Supabase connected to learning-platform successfully');
    }
  })
  .catch(err => console.log('❌ Supabase connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/upload', require('./routes/upload'));
// app.use('/api/quizzes', require('./routes/quizzes')); // Temporairement désactivé

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: 'supabase' });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));