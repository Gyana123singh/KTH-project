const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      default: '',
    },
    restaurant: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: 'Present',
    },
    referenceName: {
      type: String,
      default: '',
      trim: true,
    },
    referencePhone: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending Verification', 'Disputed'],
      default: 'Verified',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);
module.exports = WorkExperience;
