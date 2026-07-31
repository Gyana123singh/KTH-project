const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const WorkExperience = require('../models/WorkExperience');
const Employer = require('../models/Employer');
const Correction = require('../models/Correction');
const User = require('../models/User');

// @desc    Get Admin Dashboard summary stats (PRD 8 Success Metrics)
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Profile.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalWorkHistories = await WorkExperience.countDocuments();
    const pendingCorrections = await Correction.countDocuments({ status: 'Pending' });

    const totalViewsAggregate = await Profile.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$publicViews' } } },
    ]);
    const totalPublicViews = totalViewsAggregate.length > 0 ? totalViewsAggregate[0].totalViews : 0;

    const voiceProfilesCount = await Profile.countDocuments({ hasVoiceProfile: true });

    return res.json({
      success: true,
      stats: {
        totalEmployees,
        totalEmployers,
        totalProfiles: totalEmployees + totalEmployers,
        pendingCorrections,
        totalPublicViews,
        voiceProfiles: voiceProfilesCount,
        totalWorkHistories,
        voiceProfileAdoptionRate: totalEmployees > 0 ? `${((voiceProfilesCount / totalEmployees) * 100).toFixed(1)}%` : '0%',
      },
    });
  } catch (error) {
    console.error('[Admin Controller Dashboard Stats Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to aggregate dashboard stats', error: error.message });
  }
};

// @desc    Get all employee talent profiles with pagination and search
// @route   GET /api/admin/employees
// @access  Private (Admin)
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, position, status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { publicId: regex },
        { email: regex },
        { phone: regex },
        { currentPosition: regex },
        { currentDepartment: regex },
      ];
    }
    if (department) query.currentDepartment = department;
    if (position) query.currentPosition = position;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Profile.countDocuments(query);
    const employees = await Profile.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      employees,
    });
  } catch (error) {
    console.error('[Admin Controller Get Employees Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employees', error: error.message });
  }
};

// @desc    Get single employee details with full work history
// @route   GET /api/admin/employees/:id
// @access  Private (Admin)
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by ObjectId or publicId (EMP-1001)
    const profile = await Profile.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { publicId: id }],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const workHistory = await WorkExperience.find({ profileId: profile._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      employee: {
        ...profile.toObject(),
        workHistory,
      },
    });
  } catch (error) {
    console.error('[Admin Controller Get Employee By Id Error]:', error);
    return res.status(500).json({ success: false, message: 'Error fetching employee details', error: error.message });
  }
};

// @desc    Admin Direct Edit / Overwrite of candidate profile details (PRD 4.8)
// @route   PUT /api/admin/employees/:id
// @access  Private (Admin)
const updateEmployeeDirect = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const profile = await Profile.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { publicId: id }],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    // Direct overwrite of fields specified in PRD 4.8
    const allowedFields = [
      'name', 'photo', 'about', 'currentPosition', 'currentDepartment',
      'experienceYears', 'experience', 'location', 'cuisineType', 'languages',
      'status', 'rating', 'phone', 'email', 'nationality', 'socialLinks',
      'preferredJobTitle', 'preferredLocation', 'skills', 'education',
      'certifications', 'hasVoiceProfile', 'voiceProfileUrl', 'isPublished'
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        profile[field] = updates[field];
      }
    });

    await profile.save();

    const { emitProfileEvent, emitAdminEvent } = require('../config/socket');
    emitProfileEvent(profile.publicId, 'admin-profile-overwrite', {
      publicId: profile.publicId,
      profile: profile.toObject(),
    });
    emitAdminEvent('employee-details-overwritten', {
      publicId: profile.publicId,
      name: profile.name,
    });

    return res.json({
      success: true,
      message: 'Employee profile updated and overwritten immediately on public profile',
      employee: profile,
    });
  } catch (error) {
    console.error('[Admin Controller Direct Update Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update employee details', error: error.message });
  }
};

// @desc    Delete employee profile (Admin)
// @route   DELETE /api/admin/employees/:id
// @access  Private (Admin)
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { publicId: id }],
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    await WorkExperience.deleteMany({ profileId: profile._id });
    await Profile.deleteOne({ _id: profile._id });

    return res.json({ success: true, message: 'Employee profile and associated work experiences deleted' });
  } catch (error) {
    console.error('[Admin Controller Delete Employee Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete employee profile', error: error.message });
  }
};

// @desc    Get all employers for admin list
// @route   GET /api/admin/employers
// @access  Private (Admin)
const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: employers.length, employers });
  } catch (error) {
    console.error('[Admin Controller Get Employers Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employers', error: error.message });
  }
};

// @desc    Update employer profile directly (Admin)
// @route   PUT /api/admin/employers/:id
// @access  Private (Admin)
const updateEmployerDirect = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(404).json({ success: false, message: 'Employer record not found' });
    }

    Object.assign(employer, updates);
    await employer.save();

    return res.json({ success: true, message: 'Employer updated successfully', employer });
  } catch (error) {
    console.error('[Admin Controller Direct Update Employer Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update employer', error: error.message });
  }
};

// @desc    Get all work histories across candidates for admin auditing
// @route   GET /api/admin/work-histories
// @access  Private (Admin)
const getAllWorkHistories = async (req, res) => {
  try {
    const histories = await WorkExperience.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: histories.length, histories });
  } catch (error) {
    console.error('[Admin Controller Get Work Histories Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch work histories', error: error.message });
  }
};

// @desc    Update work history directly (Admin Direct Overwrite)
// @route   PUT /api/admin/work-histories/:id
// @access  Private (Admin)
const updateWorkHistoryDirect = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const history = await WorkExperience.findById(id);
    if (!history) {
      return res.status(404).json({ success: false, message: 'Work experience record not found' });
    }

    Object.assign(history, updates);
    await history.save();

    return res.json({ success: true, message: 'Work history entry updated immediately', history });
  } catch (error) {
    console.error('[Admin Controller Update Work History Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update work history entry', error: error.message });
  }
};

// @desc    Get data corrections queue (PRD 4.8)
// @route   GET /api/admin/corrections
// @access  Private (Admin)
const getCorrections = async (req, res) => {
  try {
    const corrections = await Correction.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: corrections.length, corrections });
  } catch (error) {
    console.error('[Admin Controller Get Corrections Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch corrections queue', error: error.message });
  }
};

// @desc    Approve or Reject correction request (PRD 4.8)
// @route   PUT /api/admin/corrections/:id
// @access  Private (Admin)
const resolveCorrection = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    const correction = await Correction.findOne({
      $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { correctionId: id }],
    });

    if (!correction) {
      return res.status(404).json({ success: false, message: 'Correction request not found' });
    }

    correction.status = status;
    await correction.save();

    // If approved, overwrite target candidate field immediately
    if (status === 'Approved') {
      const profile = await Profile.findOne({ publicId: correction.employeeId });
      if (profile) {
        const fieldKeyMap = {
          'Current Position': 'currentPosition',
          'Experience Years': 'experience',
          'About': 'about',
          'Department': 'currentDepartment',
        };
        const fieldToUpdate = fieldKeyMap[correction.fieldName] || correction.fieldName;
        profile[fieldToUpdate] = correction.newValue;
        await profile.save();
      }
    }

    return res.json({
      success: true,
      message: `Correction request marked as ${status}`,
      correction,
    });
  } catch (error) {
    console.error('[Admin Controller Resolve Correction Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to process correction request', error: error.message });
  }
};

module.exports = {
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
};
