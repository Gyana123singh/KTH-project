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

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
