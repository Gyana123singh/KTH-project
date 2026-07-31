const express = require('express');
const router = express.Router();
const { getPublicProfile, searchTalent, getPublicProfileQR } = require('../controllers/publicController');

// Public Open Discovery (No login required)
router.get('/profiles/:publicId', getPublicProfile);
router.get('/profiles/:publicId/qr', getPublicProfileQR);
router.get('/talent/search', searchTalent);

module.exports = router;
