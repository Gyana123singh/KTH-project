// Translation dictionary for kitchen positions, departments, and common culinary descriptions
const CULINARY_HINDI_MAP = {
  // Positions
  'Executive Chef': 'मुख्य कार्यकारी शेफ (Executive Chef)',
  'Head Chef': 'प्रधान शेफ (Head Chef)',
  'Sous Chef': 'सहायक शेफ (Sous Chef)',
  'Chef de Partie': 'स्टेशन शेफ (Chef de Partie)',
  'Commis Chef': 'कनिष्ठ शेफ (Commis Chef)',
  'Pastry Chef': 'पेस्ट्री शेफ (Pastry Chef)',
  'Head Sommelier': 'मुख्य सोमेलियर / पेय विशेषज्ञ',
  'Restaurant Manager': 'रेस्टोरेंट प्रबंधक (Restaurant Manager)',
  'Line Cook': 'लाइन कुक (Line Cook)',
  'Sushi Master': 'सुशी मास्टर (Sushi Master)',

  // Departments
  'Culinary Arts': 'पाक कला (Culinary Arts)',
  'Pastry & Bakery': 'पेस्ट्री और बेकरी',
  'Beverage & Mixology': 'पेय पदार्थ और मिक्सोलॉजी',
  'Front of House': 'फ्रंट ऑफ हाउस (अतिथि सेवा)',
  'Kitchen Operations': 'रसोई संचालन (Kitchen Operations)',
  'Quality Control': 'गुणवत्ता नियंत्रण',
  'Catering & Events': 'केटरिंग एवं कार्यक्रम',

  // Common phrase translations
  'Years': 'साल',
  'Year': 'साल',
  'Verified': 'सत्यापित (Verified)',
  'Pending Verification': 'सत्यापन लंबित',
  'Disputed': 'विवादित',
  'Active': 'सक्रिय',
  'Inactive': 'निष्क्रिय',
  'Present': 'वर्तमान में कार्यरत',
};

// Converts local language / voice transcribed text into clean, standardized English text (PRD 4.2)
function standardizeVoiceInputToEnglish(rawInputText) {
  if (!rawInputText) return '';

  let processed = rawInputText.trim();

  // Simple normalization & correction dictionary for voice misheard words
  const voiceCorrections = {
    'sauce chef': 'Sous Chef',
    'so chef': 'Sous Chef',
    'chief de partie': 'Chef de Partie',
    'commis 1': 'Commis Chef',
    'head cook': 'Head Chef',
    'bakery chef': 'Pastry Chef',
    'rasoi': 'Kitchen Operations',
    'khana': 'Culinary Arts',
  };

  const lower = processed.toLowerCase();
  for (const [key, val] of Object.entries(voiceCorrections)) {
    if (lower.includes(key)) {
      processed = processed.replace(new RegExp(key, 'gi'), val);
    }
  }

  return processed;
}

// Translates profile object to Hindi payload dynamically for frontend display (PRD 4.4)
function translateProfileToHindi(profileObj) {
  const profile = profileObj.toObject ? profileObj.toObject() : { ...profileObj };

  const translatedPosition = CULINARY_HINDI_MAP[profile.currentPosition] || profile.currentPosition;
  const translatedDept = CULINARY_HINDI_MAP[profile.currentDepartment] || profile.currentDepartment;
  const translatedStatus = CULINARY_HINDI_MAP[profile.status] || profile.status;
  const translatedExperience = profile.experience ? profile.experience.replace('Years', 'साल').replace('Year', 'साल') : profile.experience;

  let translatedAbout = profile.about || '';
  if (translatedAbout) {
    translatedAbout = `[हिंदी अनुवाद] ${profile.name} एक अनुभवी ${translatedPosition} हैं। ${translatedAbout}`;
  }

  const translatedWorkHistory = (profile.workHistory || []).map((wh) => ({
    ...wh,
    position: CULINARY_HINDI_MAP[wh.position] || wh.position,
    status: CULINARY_HINDI_MAP[wh.status] || wh.status,
    endDate: wh.endDate === 'Present' ? 'वर्तमान में' : wh.endDate,
  }));

  return {
    ...profile,
    currentPosition: translatedPosition,
    currentDepartment: translatedDept,
    status: translatedStatus,
    experience: translatedExperience,
    about: translatedAbout,
    workHistory: translatedWorkHistory,
    currentLanguage: 'Hindi',
  };
}

module.exports = {
  standardizeVoiceInputToEnglish,
  translateProfileToHindi,
  CULINARY_HINDI_MAP,
};
