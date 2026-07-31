const express = require('express');
const router = express.Router();
const { processVoiceInput, saveVoiceProfile } = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/process', processVoiceInput);
router.post('/save-profile', protect, saveVoiceProfile);

module.exports = router;
