const express = require('express');
const router = express.Router();
const { getEmployerProfile, updateEmployerProfile } = require('../controllers/employerController');
const { protect } = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');

// Protect all employer routes with authentication and role authorization (Employer or Admin)
router.use(protect);
router.use(requireRoles('employer', 'admin'));

router.get('/profile/me', getEmployerProfile);
router.put('/profile/me', updateEmployerProfile);

module.exports = router;
