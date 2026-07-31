const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema(
  {
    correctionId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeePhoto: {
      type: String,
      default: '',
    },
    fieldName: {
      type: String,
      required: true,
    },
    oldValue: {
      type: String,
      default: '',
    },
    newValue: {
      type: String,
      required: true,
    },
    requestedBy: {
      type: String,
      required: true,
    },
    requestedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    reason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Correction = mongoose.model('Correction', correctionSchema);
module.exports = Correction;
