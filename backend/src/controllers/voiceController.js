const { standardizeVoiceInputToEnglish } = require('../utils/translator');
const Profile = require('../models/Profile');

// @desc    Process Voice / Local Language input into standardized English text
// @route   POST /api/voice/process
// @access  Public or Private
const processVoiceInput = async (req, res) => {
  try {
    const { rawText, spokenLanguage } = req.body;

    if (!rawText) {
      return res.status(400).json({ success: false, message: 'No voice transcript or raw text provided' });
    }

    // Standardize input text to English using translator engine
    const englishText = standardizeVoiceInputToEnglish(rawText);

    // Extract potential kitchen metadata (position, department, experience years)
    let extractedPosition = 'Line Cook';
    let extractedDepartment = 'Culinary Arts';
    let extractedExperienceYears = 3;

    const lower = englishText.toLowerCase();
    if (lower.includes('executive chef') || lower.includes('head chef')) {
      extractedPosition = 'Executive Chef';
    } else if (lower.includes('sous chef')) {
      extractedPosition = 'Sous Chef';
    } else if (lower.includes('pastry') || lower.includes('bakery')) {
      extractedPosition = 'Pastry Chef';
      extractedDepartment = 'Pastry & Bakery';
    } else if (lower.includes('sommelier') || lower.includes('bar') || lower.includes('beverage')) {
      extractedPosition = 'Head Sommelier';
      extractedDepartment = 'Beverage & Mixology';
    } else if (lower.includes('manager')) {
      extractedPosition = 'Restaurant Manager';
      extractedDepartment = 'Front of House';
    }

    const expMatch = lower.match(/(\d+)\s*(year|yr|sal|saal)/i);
    if (expMatch && expMatch[1]) {
      extractedExperienceYears = parseInt(expMatch[1], 10);
    }

    return res.json({
      success: true,
      spokenLanguage: spokenLanguage || 'Hindi / Local Language',
      originalInputText: rawText,
      standardizedEnglishText: englishText,
      extractedFields: {
        position: extractedPosition,
        department: extractedDepartment,
        experienceYears: extractedExperienceYears,
        experience: `${extractedExperienceYears} Years`,
        about: englishText,
      },
    });
  } catch (error) {
    console.error('[Voice Controller Process Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to process voice input', error: error.message });
  }
};

// @desc    Save voice profile input directly to candidate profile
// @route   POST /api/voice/save-profile
// @access  Private (Employee)
const saveVoiceProfile = async (req, res) => {
  try {
    const { rawText, voiceAudioUrl, spokenLanguage } = req.body;

    if (!rawText) {
      return res.status(400).json({ success: false, message: 'No voice transcript provided' });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const englishText = standardizeVoiceInputToEnglish(rawText);

    profile.voiceInputOriginalText = rawText;
    profile.hasVoiceProfile = true;
    if (voiceAudioUrl) profile.voiceProfileUrl = voiceAudioUrl;
    if (!profile.about || profile.about.includes('kitchen professional on Kitchen Talent Hub')) {
      profile.about = englishText;
    }

    await profile.save();

    return res.json({
      success: true,
      message: 'Voice profile processed and saved to candidate profile',
      profile,
      standardizedEnglishText: englishText,
    });
  } catch (error) {
    console.error('[Voice Controller Save Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to save voice profile', error: error.message });
  }
};

module.exports = {
  processVoiceInput,
  saveVoiceProfile,
};

