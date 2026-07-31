const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publicId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: 'https://i.pravatar.cc/150?img=1',
    },
    about: {
      type: String,
      default: '',
    },
    currentPosition: {
      type: String,
      required: true,
      trim: true,
    },
    currentDepartment: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: '0 Years',
    },
    location: {
      type: String,
      default: 'New York, NY',
    },
    cuisineType: {
      type: [String],
      default: ['General Culinary'],
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending Verification', 'Inactive'],
      default: 'Active',
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    publicViews: {
      type: Number,
      default: 0,
    },
    hasVoiceProfile: {
      type: Boolean,
      default: false,
    },
    voiceProfileUrl: {
      type: String,
      default: null,
    },
    voiceInputOriginalText: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for work history entries
profileSchema.virtual('workHistory', {
  ref: 'WorkExperience',
  localField: '_id',
  foreignField: 'profileId',
});

profileSchema.set('toObject', { virtuals: true });
profileSchema.set('toJSON', { virtuals: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
