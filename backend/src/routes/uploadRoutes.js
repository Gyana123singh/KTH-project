const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadProfilePhoto,
  uploadVoiceAudio,
  uploadEmployerBanner,
  uploadGenericFile,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Optional authentication middleware for uploads (populates req.user if token present, but doesn't block)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

// Cloudinary Upload Endpoints
router.post('/photo', optionalAuth, upload.single('photo'), uploadProfilePhoto);
router.post('/voice-audio', optionalAuth, upload.single('audio'), uploadVoiceAudio);
router.post('/banner', optionalAuth, upload.single('banner'), uploadEmployerBanner);
router.post('/file', optionalAuth, upload.single('file'), uploadGenericFile);

module.exports = router;
