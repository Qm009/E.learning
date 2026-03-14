const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Créer les dossiers s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../uploads');
const coursesDir = path.join(uploadsDir, 'courses');
const documentsDir = path.join(uploadsDir, 'documents');

[uploadsDir, coursesDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration de multer pour différents types de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Déterminer le dossier selon le type de fichier
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/courses/');
    } else {
      cb(null, 'uploads/documents/');
    }
  },
  filename: function (req, file, cb) {
    // Nom de fichier unique avec timestamp et extension originale
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour accepter images et documents
const fileFilter = (req, file, cb) => {
  console.log('🔍 File filter checking:', file.originalname, 'mimetype:', file.mimetype);
  
  // Types de fichiers acceptés
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    // Archives
    'application/zip',
    'application/x-rar-compressed'
  ];

  console.log('📋 Allowed types:', allowedTypes);
  console.log('✅ Is allowed?', allowedTypes.includes(file.mimetype));

  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'Type:', file.mimetype);
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}. Types acceptés: images (jpg, png, gif), documents (pdf, doc, docx, txt, xls, xlsx, ppt, pptx), archives (zip, rar)`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: fileFilter
});

// Route pour uploader une image de cours
router.post('/course-image', auth, roleAuth(['instructor', 'admin']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const imageUrl = `/uploads/courses/${req.file.filename}`;
    
    console.log('✅ Image uploaded:', imageUrl);
    res.json({ 
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('❌ Error uploading image:', err);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image', error: err.message });
  }
});

// Route pour uploader des documents de cours
router.post('/course-document', auth, roleAuth(['instructor', 'admin']), upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const documentUrl = `/uploads/documents/${req.file.filename}`;
    
    console.log('✅ Document uploaded:', documentUrl);
    res.json({ 
      message: 'Document uploadé avec succès',
      documentUrl: documentUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (err) {
    console.error('❌ Error uploading document:', err);
    res.status(500).json({ message: 'Erreur lors de l\'upload du document', error: err.message });
  }
});

// Route pour uploader plusieurs fichiers à la fois
router.post('/course-files', auth, roleAuth(['instructor', 'admin']), upload.array('files', 5), async (req, res) => {
  try {
    console.log('🔍 Starting file upload...');
    console.log('📁 req.files:', req.files);
    console.log('📁 req.files length:', req.files?.length);
    
    if (!req.files || req.files.length === 0) {
      console.log('❌ No files provided');
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const uploadedFiles = req.files.map(file => {
      console.log('📄 Processing file:', file.originalname, 'mimetype:', file.mimetype);
      
      const folder = file.mimetype.startsWith('image/') ? 'courses' : 'documents';
      return {
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${folder}/${file.filename}`,
        size: file.size,
        mimeType: file.mimetype,
        type: file.mimetype.startsWith('image/') ? 'image' : 'document'
      };
    });

    console.log('✅ Files uploaded successfully:', uploadedFiles.length);
    console.log('📋 Uploaded files details:', uploadedFiles);
    
    res.json({ 
      message: 'Fichiers uploadés avec succès',
      files: uploadedFiles
    });
  } catch (err) {
    console.error('❌ Error uploading files:', err);
    console.error('❌ Error stack:', err.stack);
    res.status(500).json({ message: 'Erreur lors de l\'upload des fichiers', error: err.message });
  }
});

// Route pour supprimer un fichier
router.delete('/file/:filename', auth, roleAuth(['instructor', 'admin']), async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Rechercher le fichier dans les deux dossiers
    const possiblePaths = [
      path.join(__dirname, '../uploads/courses/', filename),
      path.join(__dirname, '../uploads/documents/', filename)
    ];

    let deleted = false;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
        console.log('✅ File deleted:', filePath);
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    res.json({ message: 'Fichier supprimé avec succès' });
  } catch (err) {
    console.error('❌ Error deleting file:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err.message });
  }
});

module.exports = router;
