const User = require('../models/User');
const Profile = require('../models/Profile');
const Employer = require('../models/Employer');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user (employee, employer, admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const hashedPassword = User.hashPassword(password);
    const assignedRole = role && ['employee', 'employer', 'admin'].includes(role) ? role : 'employee';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: assignedRole,
      avatar: avatar || '',
    });

    // If registering as employee, automatically initialize a talent profile
    if (assignedRole === 'employee') {
      const profileCount = await Profile.countDocuments();
      const publicId = `EMP-${1000 + profileCount + 1}`;

      await Profile.create({
        userId: user._id,
        publicId,
        name: user.name,
        photo: user.avatar || 'https://i.pravatar.cc/150?img=1',
        email: user.email,
        phone: user.phone,
        currentPosition: 'Line Cook',
        currentDepartment: 'Culinary Arts',
        about: `${user.name} is a kitchen professional on Kitchen Talent Hub.`,
      });
    }

    // If registering as employer, automatically initialize an employer profile
    if (assignedRole === 'employer') {
      const employerCount = await Employer.countDocuments();
      const employerId = `EMP-GRP-${200 + employerCount + 1}`;

      await Employer.create({
        userId: user._id,
        employerId,
        restaurant: `${user.name}'s Kitchen`,
        poc: user.name,
        email: user.email,
        phone: user.phone || '+1 (555) 000-0000',
        designation: 'General Manager',
      });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    const { emitAdminEvent } = require('../config/socket');
    emitAdminEvent('new-user-registered', {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[Auth Controller Register Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('[Auth Controller Login Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let profileData = null;
    if (req.user.role === 'employee') {
      profileData = await Profile.findOne({ userId: req.user._id }).populate('workHistory');
    } else if (req.user.role === 'employer') {
      profileData = await Employer.findOne({ userId: req.user._id });
    }

    return res.json({
      success: true,
      user: req.user,
      profile: profileData,
    });
  } catch (error) {
    console.error('[Auth Controller GetMe Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user profile', error: error.message });
  }
};

// @desc    Send 6-digit OTP to user email for mobile onboarding (PRD Mobile Flow)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    // Generate dynamic 6-digit OTP code (e.g. 849204)
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString(); 
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    if (!user) {
      // Create candidate user placeholder if registering via mobile email
      const userName = cleanEmail.split('@')[0];
      user = await User.create({
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: cleanEmail,
        role: 'employee',
        otp: generatedOTP,
        otpExpiresAt,
      });

      // Create talent profile
      const profileCount = await Profile.countDocuments();
      const publicId = `EMP-${1000 + profileCount + 1}`;
      await Profile.create({
        userId: user._id,
        publicId,
        name: user.name,
        email: user.email,
        currentPosition: 'Line Cook',
        currentDepartment: 'Culinary Arts',
      });
    } else {
      user.otp = generatedOTP;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    // Trigger real-time email dispatch using Nodemailer email service
    const { sendOTPEmail } = require('../utils/emailService');
    await sendOTPEmail(cleanEmail, generatedOTP);

    return res.json({
      success: true,
      message: `OTP code sent successfully to ${cleanEmail}`,
      otp: generatedOTP, // Also returned in API response for easy local testing
    });
  } catch (error) {
    console.error('[Auth Controller Send OTP Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

// @desc    Verify 6-digit OTP & return token with create-profile redirection (PRD Mobile Flow)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP code' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }

    // Verify OTP code (Accepts generatedOTP or test bypass '000000' or '123456')
    if (otp !== '000000' && otp !== '123456' && user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
    }

    user.isEmailVerified = true;
    user.otp = null;
    await user.save();

    let profile = await Profile.findOne({ userId: user._id });

    // If profile doesn't exist, create initial candidate profile
    if (!profile) {
      const profileCount = await Profile.countDocuments();
      const publicId = `EMP-${1000 + profileCount + 1}`;
      profile = await Profile.create({
        userId: user._id,
        publicId,
        name: user.name,
        email: user.email,
        currentPosition: 'Line Cook',
        currentDepartment: 'Culinary Arts',
      });
    }

    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    // Determine redirection route: if profile is not published, send to /create-profile
    const redirectTo = profile.isPublished ? '/profile-dashboard' : '/create-profile';

    return res.json({
      success: true,
      message: 'OTP verified successfully! Redirecting to profile setup.',
      token,
      redirectTo,
      isProfileComplete: profile.isPublished,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      profile,
    });
  } catch (error) {
    console.error('[Auth Controller Verify OTP Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP', error: error.message });
  }
};

// @desc    Authenticate or register candidate via Google Auth (PRD Mobile Flow Image 1)
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email from Google Authentication' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      // Auto-register candidate user via Google Auth
      user = await User.create({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'employee',
        avatar: avatar || 'https://i.pravatar.cc/150?img=1',
        isEmailVerified: true,
      });

      const profileCount = await Profile.countDocuments();
      const publicId = `EMP-${1000 + profileCount + 1}`;
      await Profile.create({
        userId: user._id,
        publicId,
        name: user.name,
        email: user.email,
        photo: user.avatar,
        currentPosition: 'Line Cook',
        currentDepartment: 'Culinary Arts',
      });
    }

    let profile = await Profile.findOne({ userId: user._id });

    const token = generateToken({ id: user._id, role: user.role, email: user.email });
    const redirectTo = profile.isPublished ? '/profile-dashboard' : '/create-profile';

    return res.json({
      success: true,
      message: 'Google login successful',
      token,
      redirectTo,
      isProfileComplete: profile.isPublished,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    console.error('[Auth Controller Google Login Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete Google authentication', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  sendOTP,
  verifyOTP,
  googleLogin,
};


