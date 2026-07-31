const Profile = require('../models/Profile');
const WorkExperience = require('../models/WorkExperience');

// @desc    Get logged in candidate's profile
// @route   GET /api/talent/profile/me
// @access  Private (Employee)
const getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      const count = await Profile.countDocuments();
      const publicId = `EMP-${1000 + count + 1}`;
      profile = await Profile.create({
        userId: req.user._id,
        publicId,
        name: req.user.name,
        email: req.user.email,
        currentPosition: 'Line Cook',
        currentDepartment: 'Culinary Arts',
      });
    }

    const workHistory = await WorkExperience.find({ profileId: profile._id }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      profile: {
        ...profile.toObject(),
        workHistory,
        shareableUrl: `kth.app/u/${profile.publicId}`,
      },
    });
  } catch (error) {
    console.error('[Talent Controller Get Profile Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch candidate profile', error: error.message });
  }
};

// @desc    Create or Update candidate's profile details
// @route   PUT /api/talent/profile/me
// @access  Private (Employee)
const updateMyProfile = async (req, res) => {
  try {
    const { name, photo, about, currentPosition, currentDepartment, experienceYears, experience, location, cuisineType, languages, phone } = req.body;

    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    if (name) profile.name = name;
    if (photo) profile.photo = photo;
    if (about !== undefined) profile.about = about;
    if (currentPosition) profile.currentPosition = currentPosition;
    if (currentDepartment) profile.currentDepartment = currentDepartment;
    if (experienceYears !== undefined) {
      profile.experienceYears = Number(experienceYears);
      profile.experience = `${experienceYears} Years`;
    } else if (experience) {
      profile.experience = experience;
    }
    if (location) profile.location = location;
    if (cuisineType) profile.cuisineType = Array.isArray(cuisineType) ? cuisineType : [cuisineType];
    if (languages) profile.languages = Array.isArray(languages) ? languages : [languages];
    if (phone) profile.phone = phone;

    await profile.save();

    const workHistory = await WorkExperience.find({ profileId: profile._id });

    const { emitAdminEvent, emitProfileEvent } = require('../config/socket');
    emitAdminEvent('candidate-profile-updated', {
      publicId: profile.publicId,
      name: profile.name,
      currentPosition: profile.currentPosition,
    });
    emitProfileEvent(profile.publicId, 'profile-updated', {
      profile: {
        ...profile.toObject(),
        workHistory,
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        ...profile.toObject(),
        workHistory,
        shareableUrl: `kth.app/u/${profile.publicId}`,
      },
    });
  } catch (error) {
    console.error('[Talent Controller Update Profile Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update candidate profile', error: error.message });
  }
};

// @desc    Add work experience to candidate profile
// @route   POST /api/talent/work-experience
// @access  Private (Employee)
const addWorkExperience = async (req, res) => {
  try {
    const { restaurant, position, startDate, endDate, referenceName, referencePhone, notes } = req.body;

    if (!restaurant || !position || !startDate) {
      return res.status(400).json({ success: false, message: 'Restaurant name, position, and start date are required' });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const workHistoryEntry = await WorkExperience.create({
      profileId: profile._id,
      employeeId: profile.publicId,
      employeeName: profile.name,
      restaurant,
      position,
      startDate,
      endDate: endDate || 'Present',
      referenceName: referenceName || '',
      referencePhone: referencePhone || '',
      status: 'Pending Verification',
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Work experience added successfully',
      workExperience: workHistoryEntry,
    });
  } catch (error) {
    console.error('[Talent Controller Add Work Experience Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to add work experience', error: error.message });
  }
};

// @desc    Update candidate work experience entry
// @route   PUT /api/talent/work-experience/:id
// @access  Private (Employee)
const updateWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurant, position, startDate, endDate, referenceName, referencePhone, notes } = req.body;

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const workEntry = await WorkExperience.findOne({ _id: id, profileId: profile._id });
    if (!workEntry) {
      return res.status(404).json({ success: false, message: 'Work experience record not found' });
    }

    if (restaurant) workEntry.restaurant = restaurant;
    if (position) workEntry.position = position;
    if (startDate) workEntry.startDate = startDate;
    if (endDate) workEntry.endDate = endDate;
    if (referenceName !== undefined) workEntry.referenceName = referenceName;
    if (referencePhone !== undefined) workEntry.referencePhone = referencePhone;
    if (notes !== undefined) workEntry.notes = notes;

    await workEntry.save();

    return res.json({
      success: true,
      message: 'Work experience updated successfully',
      workExperience: workEntry,
    });
  } catch (error) {
    console.error('[Talent Controller Update Work Experience Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update work experience', error: error.message });
  }
};

// @desc    Delete candidate work experience entry
// @route   DELETE /api/talent/work-experience/:id
// @access  Private (Employee)
const deleteWorkExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const result = await WorkExperience.deleteOne({ _id: id, profileId: profile._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Work experience entry not found' });
    }

    return res.json({ success: true, message: 'Work experience entry removed successfully' });
  } catch (error) {
    console.error('[Talent Controller Delete Work Experience Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete work experience', error: error.message });
  }
};

// @desc    Submit data correction request to admin queue
// @route   POST /api/talent/correction-request
// @access  Private (Employee)
const requestCorrection = async (req, res) => {
  try {
    const { fieldName, oldValue, newValue, reason } = req.body;

    if (!fieldName || !newValue) {
      return res.status(400).json({ success: false, message: 'fieldName and newValue are required' });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const Correction = require('../models/Correction');
    const count = await Correction.countDocuments();
    const correctionId = `CORR-${100 + count + 1}`;

    const correction = await Correction.create({
      correctionId,
      employeeId: profile.publicId,
      employeeName: profile.name,
      employeePhoto: profile.photo,
      fieldName,
      oldValue: oldValue || profile[fieldName] || '',
      newValue,
      requestedBy: `${profile.name} (Self)`,
      reason: reason || 'Correction submitted by candidate',
      status: 'Pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Data correction request submitted to Admin queue',
      correction,
    });
  } catch (error) {
    console.error('[Talent Controller Request Correction Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit correction request', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  requestCorrection,
};

