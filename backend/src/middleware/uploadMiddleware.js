const multer = require('multer');

// Configure Memory Storage to buffer files in RAM before streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter for images and audio files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/ogg',
    'audio/webm',
    'video/webm', // WebM audio clips
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file format: ${file.mimetype}. Allowed formats: JPG, PNG, WEBP, MP3, WAV, M4A, OGG, WEBM`), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
  fileFilter,
});

module.exports = upload;
