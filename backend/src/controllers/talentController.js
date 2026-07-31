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
    const {
      name,
      photo,
      about,
      currentPosition,
      currentDepartment,
      experienceYears,
      experience,
      location,
      cuisineType,
      languages,
      phone,
      nationality,
      socialLinks,
      preferredJobTitle,
      preferredLocation,
      skills,
      education,
      certifications,
      voiceProfileUrl,
      hasVoiceProfile,
      isPublished,
      status,
      workHistory: workHistoryPayload,
    } = req.body;

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
    if (nationality) profile.nationality = nationality;
    if (socialLinks) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...socialLinks,
      };
    }
    if (preferredJobTitle !== undefined) profile.preferredJobTitle = preferredJobTitle;
    if (preferredLocation !== undefined) profile.preferredLocation = preferredLocation;
    if (skills) profile.skills = Array.isArray(skills) ? skills : [skills];
    if (education) profile.education = Array.isArray(education) ? education : [education];
    if (certifications) profile.certifications = Array.isArray(certifications) ? certifications : [certifications];
    if (voiceProfileUrl !== undefined) profile.voiceProfileUrl = voiceProfileUrl;
    if (hasVoiceProfile !== undefined) profile.hasVoiceProfile = Boolean(hasVoiceProfile);
    if (isPublished !== undefined) profile.isPublished = Boolean(isPublished);
    if (status) profile.status = status;

    await profile.save();

    // If workHistory payload provided, synchronize work experience entries
    if (Array.isArray(workHistoryPayload)) {
      for (const entry of workHistoryPayload) {
        if (entry._id || entry.id) {
          await WorkExperience.updateOne(
            { _id: entry._id || entry.id, profileId: profile._id },
            { $set: { ...entry, profileId: profile._id, employeeId: profile.publicId } }
          );
        } else if (entry.restaurant && entry.position) {
          await WorkExperience.create({
            profileId: profile._id,
            employeeId: profile.publicId,
            employeeName: profile.name,
            restaurant: entry.restaurant,
            position: entry.position,
            department: entry.department || profile.currentDepartment || 'Main Kitchen',
            startDate: entry.startDate || new Date().toISOString().split('T')[0],
            endDate: entry.isCurrent ? 'Present' : entry.endDate || 'Present',
            isCurrent: Boolean(entry.isCurrent),
            referenceName: entry.referenceName || '',
            referencePhone: entry.referencePhone || '',
            status: entry.status || 'Pending Verification',
            notes: entry.notes || '',
          });
        }
      }
    }

    const updatedWorkHistory = await WorkExperience.find({ profileId: profile._id }).sort({ startDate: -1 });

    const { emitAdminEvent, emitProfileEvent } = require('../config/socket');
    emitAdminEvent('candidate-profile-updated', {
      publicId: profile.publicId,
      name: profile.name,
      currentPosition: profile.currentPosition,
    });
    emitProfileEvent(profile.publicId, 'profile-updated', {
      profile: {
        ...profile.toObject(),
        workHistory: updatedWorkHistory,
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
    const { restaurant, position, department, startDate, endDate, isCurrent, referenceName, referencePhone, notes } = req.body;

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
      department: department || profile.currentDepartment || 'Main Kitchen',
      startDate,
      endDate: isCurrent ? 'Present' : endDate || 'Present',
      isCurrent: Boolean(isCurrent),
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

// @desc    Get preview profile data for candidate (Preview Profile Screen)
// @route   GET /api/talent/profile/preview
// @access  Private (Employee)
const previewProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const workHistory = await WorkExperience.find({ profileId: profile._id }).sort({ startDate: -1 });

    return res.json({
      success: true,
      preview: {
        publicId: profile.publicId,
        name: profile.name,
        photo: profile.photo,
        currentPosition: profile.currentPosition,
        experienceCount: `${workHistory.length} Experiences`,
        seeking: profile.preferredJobTitle || profile.currentPosition,
        preferredLocation: profile.preferredLocation || profile.location,
        about: profile.about,
        nationality: profile.nationality || 'Indian',
        socialLinks: profile.socialLinks || {},
        skills: profile.skills || [],
        education: profile.education || [],
        certifications: profile.certifications || [],
        languages: profile.languages || ['English'],
        workHistory,
        isPublished: profile.isPublished,
        shareableUrl: `kth.app/u/${profile.publicId}`,
      },
    });
  } catch (error) {
    console.error('[Talent Controller Preview Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate profile preview', error: error.message });
  }
};

// @desc    Publish Candidate Profile to KTH Platform (Publish Profile Screen)
// @route   POST /api/talent/profile/publish
// @access  Private (Employee)
const publishProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    profile.isPublished = true;
    profile.status = 'Active';
    await profile.save();

    const workHistory = await WorkExperience.find({ profileId: profile._id });

    const { emitAdminEvent, emitProfileEvent } = require('../config/socket');
    emitAdminEvent('new-candidate-published', {
      publicId: profile.publicId,
      name: profile.name,
      currentPosition: profile.currentPosition,
      experienceYears: profile.experienceYears,
    });
    emitProfileEvent(profile.publicId, 'profile-published', {
      publicId: profile.publicId,
      shareableUrl: `kth.app/u/${profile.publicId}`,
    });

    return res.json({
      success: true,
      message: '🎉 Congratulations! Your KTH profile is now live and shareable.',
      publicId: profile.publicId,
      shareableUrl: `kth.app/u/${profile.publicId}`,
      profile: {
        ...profile.toObject(),
        workHistory,
      },
    });
  } catch (error) {
    console.error('[Talent Controller Publish Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to publish profile', error: error.message });
  }
};

// @desc    Get Candidate Dashboard Status (Image 1: Profile Completeness 100%, Profile Views)
// @route   GET /api/talent/profile/status
// @access  Private (Employee)
const getProfileStatus = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const workHistory = await WorkExperience.find({ profileId: profile._id });

    // Calculate completeness score
    let score = 0;
    if (profile.name) score += 15;
    if (profile.about && profile.about.length > 5) score += 15;
    if (profile.currentPosition) score += 15;
    if (workHistory.length > 0) score += 20;
    if (profile.education && profile.education.length > 0) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 10;
    if (profile.photo) score += 10;
    const completeness = Math.min(score, 100);

    return res.json({
      success: true,
      greeting: `Hi, ${profile.name.split(' ')[0]} 👋`,
      profileCompleteness: {
        percentage: `${completeness}%`,
        number: completeness,
        message: completeness >= 80 ? 'Excellent! Your profile looks great.' : 'Complete a few more details to reach 100%.',
      },
      stats: {
        publicViews: profile.publicViews || 0,
        workHistoryCount: workHistory.length,
        isPublished: profile.isPublished,
      },
      shareableUrl: `kth.app/u/${profile.publicId}`,
      profile,
    });
  } catch (error) {
    console.error('[Talent Controller Status Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile status', error: error.message });
  }
};

// @desc    Get Share Your Profile payload with backend-generated QR Code (Image 2)
// @route   GET /api/talent/profile/share
// @access  Private (Employee)
const getShareProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const publicUrl = `https://kth.app/u/${profile.publicId}`;
    const displayUrl = `kth.app/u/${profile.publicId}`;

    const { generateQRCodeDataUrl, generateQRCodeSVG } = require('../utils/qrGenerator');
    const qrCodeDataUrl = await generateQRCodeDataUrl(publicUrl);
    const qrCodeSvg = await generateQRCodeSVG(publicUrl);

    // Dynamic social share links
    const shareText = encodeURIComponent(`Check out my professional kitchen profile on Kitchen Talent Hub (KTH): ${publicUrl}`);
    const encodedPublicUrl = encodeURIComponent(publicUrl);

    return res.json({
      success: true,
      publicId: profile.publicId,
      name: profile.name,
      displayUrl,
      publicUrl,
      qrCodeDataUrl, // Base64 PNG image for <img> or mobile Image component
      qrCodeSvg,
      shareOptions: {
        whatsapp: `https://api.whatsapp.com/send?text=${shareText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedPublicUrl}`,
        email: `mailto:?subject=${encodeURIComponent('Kitchen Talent Hub Profile')}&body=${shareText}`,
      },
    });
  } catch (error) {
    console.error('[Talent Controller Share Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate profile share payload', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  requestCorrection,
  previewProfile,
  publishProfile,
  getProfileStatus,
  getShareProfile,
};



