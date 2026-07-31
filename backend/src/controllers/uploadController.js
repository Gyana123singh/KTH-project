const { uploadToCloudinary } = require('../config/cloudinary');
const Profile = require('../models/Profile');
const Employer = require('../models/Employer');

// @desc    Upload Candidate Profile Photo to Cloudinary
// @route   POST /api/upload/photo
// @access  Private (Employee) or Public
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo file uploaded' });
    }

    // Upload image buffer to Cloudinary folder 'kth/photos'
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'kth/photos',
      resource_type: 'image',
    });

    // If user is authenticated as employee, update profile photo automatically
    if (req.user && req.user.role === 'employee') {
      const profile = await Profile.findOne({ userId: req.user._id });
      if (profile) {
        profile.photo = result.secure_url;
        await profile.save();
      }
    }

    return res.json({
      success: true,
      message: 'Profile photo uploaded to Cloudinary successfully',
      photoUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('[Upload Controller Photo Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload photo to Cloudinary', error: error.message });
  }
};

// @desc    Upload Candidate Voice Profile Audio to Cloudinary
// @route   POST /api/upload/voice-audio
// @access  Private (Employee) or Public
const uploadVoiceAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file uploaded' });
    }

    // Upload audio buffer to Cloudinary folder 'kth/voice' with auto resource_type
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'kth/voice',
      resource_type: 'video', // Cloudinary handles audio files under video resource_type
    });

    // If user is authenticated as employee, update profile voiceUrl automatically
    if (req.user && req.user.role === 'employee') {
      const profile = await Profile.findOne({ userId: req.user._id });
      if (profile) {
        profile.voiceProfileUrl = result.secure_url;
        profile.hasVoiceProfile = true;
        await profile.save();
      }
    }

    return res.json({
      success: true,
      message: 'Voice profile audio uploaded to Cloudinary successfully',
      audioUrl: result.secure_url,
      publicId: result.public_id,
      duration: result.duration || 0,
      format: result.format,
    });
  } catch (error) {
    console.error('[Upload Controller Voice Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload voice audio to Cloudinary', error: error.message });
  }
};

// @desc    Upload Employer Restaurant Banner Image to Cloudinary
// @route   POST /api/upload/banner
// @access  Private (Employer) or Public
const uploadEmployerBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No banner image file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'kth/banners',
      resource_type: 'image',
    });

    if (req.user && req.user.role === 'employer') {
      const employer = await Employer.findOne({ userId: req.user._id });
      if (employer) {
        employer.banner = result.secure_url;
        await employer.save();
      }
    }

    return res.json({
      success: true,
      message: 'Employer banner image uploaded to Cloudinary successfully',
      bannerUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('[Upload Controller Banner Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload banner to Cloudinary', error: error.message });
  }
};

// @desc    Generic multi-purpose file upload to Cloudinary
// @route   POST /api/upload/file
// @access  Public or Private
const uploadGenericFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { folder = 'kth/assets' } = req.body;
    const isAudio = req.file.mimetype.startsWith('audio/') || req.file.mimetype.includes('webm');

    const result = await uploadToCloudinary(req.file.buffer, {
      folder,
      resource_type: isAudio ? 'video' : 'auto',
    });

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('[Upload Controller Generic Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload file', error: error.message });
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadVoiceAudio,
  uploadEmployerBanner,
  uploadGenericFile,
};
