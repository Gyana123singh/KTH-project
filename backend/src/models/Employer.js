const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employerId: {
      type: String,
      unique: true,
      required: true,
    },
    restaurant: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      default: '',
    },
    poc: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    designation: {
      type: String,
      enum: ['Owner', 'General Manager', 'Manager', 'Chef', 'Other', 'Executive Vice President', 'Culinary Director', 'HR Partner', 'Operations Head'],
      default: 'General Manager',
    },
    hqArea: {
      type: String,
      default: '',
    },
    hqCity: {
      type: String,
      default: 'New York',
    },
    hqState: {
      type: String,
      default: 'NY',
    },
    hqCountry: {
      type: String,
      default: 'USA',
    },
    location: {
      type: String,
      default: 'New York, NY',
    },
    outletCount: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Active Partner', 'Pending Audit'],
      default: 'Active Partner',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    activeListings: {
      type: Number,
      default: 2,
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
  },
  {
    timestamps: true,
  }
);

const Employer = mongoose.model('Employer', employerSchema);
module.exports = Employer;
