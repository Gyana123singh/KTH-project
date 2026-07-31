const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  requestCorrection,
} = require('../controllers/talentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRoles } = require('../middleware/roleMiddleware');

// Protect all talent routes with authentication and role authorization (Employee or Admin)
router.use(protect);
router.use(requireRoles('employee', 'admin'));

router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);
router.post('/work-experience', addWorkExperience);
router.put('/work-experience/:id', updateWorkExperience);
router.delete('/work-experience/:id', deleteWorkExperience);
router.post('/correction-request', requestCorrection);

module.exports = router;
