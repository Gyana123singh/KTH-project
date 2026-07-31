const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeDirect,
  deleteEmployee,
  getAllEmployers,
  updateEmployerDirect,
  getAllWorkHistories,
  updateWorkHistoryDirect,
  getCorrections,
  resolveCorrection,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Protect all admin endpoints with auth + strict admin role authorization
router.use(protect);
router.use(adminOnly);

router.get('/dashboard/stats', getDashboardStats);

// Employee Admin Management
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployeeDirect);
router.delete('/employees/:id', deleteEmployee);

// Employer Admin Management
router.get('/employers', getAllEmployers);
router.put('/employers/:id', updateEmployerDirect);

// Work History Auditing
router.get('/work-histories', getAllWorkHistories);
router.put('/work-histories/:id', updateWorkHistoryDirect);

// Corrections Queue (Data Quality)
router.get('/corrections', getCorrections);
router.put('/corrections/:id', resolveCorrection);

module.exports = router;
