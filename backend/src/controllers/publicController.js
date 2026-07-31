const Profile = require('../models/Profile');
const WorkExperience = require('../models/WorkExperience');
const { translateProfileToHindi } = require('../utils/translator');

// @desc    Get public candidate CV by publicId (slug) (PRD 4.3)
// @route   GET /api/public/profiles/:publicId
// @access  Public (No Login Required)
const getPublicProfile = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { lang } = req.query;

    const profile = await Profile.findOne({ publicId: publicId.toUpperCase() });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Talent profile not found' });
    }

    // Increment public profile views count
    profile.publicViews += 1;
    await profile.save();

    // Trigger real-time notification to candidate
    const { sendNotification } = require('./notificationController');
    sendNotification({
      userId: profile.userId,
      userPublicId: profile.publicId,
      title: 'Profile Viewed! 👀',
      message: `Someone just viewed your KTH professional identity CV profile (${profile.publicViews} total views).`,
      type: 'profile_view',
      link: `/u/${profile.publicId}`,
      icon: 'eye',
    });

    const workHistory = await WorkExperience.find({ profileId: profile._id }).sort({ createdAt: -1 });

    const fullProfile = {
      ...profile.toObject(),
      workHistory,
      shareableUrl: `kth.app/u/${profile.publicId}`,
    };

    // If Hindi language requested (PRD 4.4 Multi-language viewing)
    if (lang && lang.toLowerCase() === 'hi') {
      const translatedPayload = translateProfileToHindi(fullProfile);
      return res.json({
        success: true,
        language: 'Hindi',
        profile: translatedPayload,
      });
    }

    return res.json({
      success: true,
      language: 'English',
      profile: fullProfile,
    });
  } catch (error) {
    console.error('[Public Controller Get Profile Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile', error: error.message });
  }
};

// @desc    Open Discovery candidate search & filter (PRD 4.6 & 4.7)
// @route   GET /api/public/talent/search
// @access  Public (No Login Required)
const searchTalent = async (req, res) => {
  try {
    const { query, position, department, location, experienceMin, experienceMax, cuisine, status, page = 1, limit = 20 } = req.query;

    const filter = {};

    // Search by Name, Workplace, Cuisine, Position, or Department (PRD 4.7)
    if (query) {
      const regex = new RegExp(query, 'i');
      filter.$or = [
        { name: regex },
        { currentPosition: regex },
        { currentDepartment: regex },
        { location: regex },
        { cuisineType: regex },
        { about: regex },
      ];
    }

    if (position) {
      filter.currentPosition = new RegExp(position, 'i');
    }

    if (department) {
      filter.currentDepartment = new RegExp(department, 'i');
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (status) {
      filter.status = status;
    }

    if (cuisine) {
      filter.cuisineType = new RegExp(cuisine, 'i');
    }

    if (experienceMin !== undefined || experienceMax !== undefined) {
      filter.experienceYears = {};
      if (experienceMin !== undefined) filter.experienceYears.$gte = Number(experienceMin);
      if (experienceMax !== undefined) filter.experienceYears.$lte = Number(experienceMax);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await Profile.countDocuments(filter);
    const candidates = await Profile.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Enrich with public share link
    const formattedCandidates = candidates.map((c) => ({
      ...c.toObject(),
      shareableUrl: `kth.app/u/${c.publicId}`,
    }));

    return res.json({
      success: true,
      totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      candidates: formattedCandidates,
    });
  } catch (error) {
    console.error('[Public Controller Search Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error performing search', error: error.message });
  }
};

// @desc    Get QR Code for public profile
// @route   GET /api/public/profiles/:publicId/qr
// @access  Public (No Login Required)
const getPublicProfileQR = async (req, res) => {
  try {
    const { publicId } = req.params;
    const profile = await Profile.findOne({ publicId: publicId.toUpperCase() });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Talent profile not found' });
    }

    const publicUrl = `https://kth.app/u/${profile.publicId}`;
    const { generateQRCodeDataUrl, generateQRCodeSVG } = require('../utils/qrGenerator');
    const qrCodeDataUrl = await generateQRCodeDataUrl(publicUrl);
    const qrCodeSvg = await generateQRCodeSVG(publicUrl);

    return res.json({
      success: true,
      publicId: profile.publicId,
      publicUrl,
      qrCodeDataUrl,
      qrCodeSvg,
    });
  } catch (error) {
    console.error('[Public Controller QR Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate QR Code', error: error.message });
  }
};

module.exports = {
  getPublicProfile,
  searchTalent,
  getPublicProfileQR,
};

