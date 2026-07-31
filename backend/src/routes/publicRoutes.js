const express = require('express');
const router = express.Router();
const { getPublicProfile, searchTalent } = require('../controllers/publicController');

// Public Open Discovery (No login required)
router.get('/profiles/:publicId', getPublicProfile);
router.get('/talent/search', searchTalent);

module.exports = router;
