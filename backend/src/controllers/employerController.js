const Employer = require('../models/Employer');

// @desc    Get logged in employer profile
// @route   GET /api/employer/profile/me
// @access  Private (Employer)
const getEmployerProfile = async (req, res) => {
  try {
    let employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) {
      const count = await Employer.countDocuments();
      const employerId = `EMP-GRP-${200 + count + 1}`;
      employer = await Employer.create({
        userId: req.user._id,
        employerId,
        restaurant: `${req.user.name}'s Restaurant Group`,
        poc: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '+1 (555) 123-4567',
        designation: 'General Manager',
      });
    }

    return res.json({
      success: true,
      employer,
    });
  } catch (error) {
    console.error('[Employer Controller Get Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch employer profile', error: error.message });
  }
};

// @desc    Create or update employer profile details (PRD 4.5)
// @route   PUT /api/employer/profile/me
// @access  Private (Employer)
const updateEmployerProfile = async (req, res) => {
  try {
    const { restaurant, owner, poc, phone, email, designation, hqArea, hqCity, hqState, hqCountry, outletCount, location, banner } = req.body;

    let employer = await Employer.findOne({ userId: req.user._id });
    if (!employer) {
      const count = await Employer.countDocuments();
      employer = new Employer({
        userId: req.user._id,
        employerId: `EMP-GRP-${200 + count + 1}`,
      });
    }

    if (restaurant) employer.restaurant = restaurant;
    if (owner !== undefined) employer.owner = owner;
    if (poc) employer.poc = poc;
    if (phone) employer.phone = phone;
    if (email) employer.email = email;
    if (designation) employer.designation = designation;
    if (hqArea !== undefined) employer.hqArea = hqArea;
    if (hqCity !== undefined) employer.hqCity = hqCity;
    if (hqState !== undefined) employer.hqState = hqState;
    if (hqCountry !== undefined) employer.hqCountry = hqCountry;
    if (outletCount !== undefined) employer.outletCount = Number(outletCount);
    if (location) employer.location = location;
    if (banner) employer.banner = banner;

    await employer.save();

    return res.json({
      success: true,
      message: 'Employer profile updated successfully',
      employer,
    });
  } catch (error) {
    console.error('[Employer Controller Update Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update employer profile', error: error.message });
  }
};

module.exports = {
  getEmployerProfile,
  updateEmployerProfile,
};
