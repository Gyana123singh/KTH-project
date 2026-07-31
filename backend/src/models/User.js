const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['employee', 'employer', 'admin'],
      default: 'employee',
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Method to hash password using Node native crypto
userSchema.statics.hashPassword = function (password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// Method to verify password
userSchema.methods.matchPassword = function (enteredPassword) {
  if (!this.password.includes(':')) {
    return enteredPassword === this.password;
  }
  const [salt, storedHash] = this.password.split(':');
  const hash = crypto.pbkdf2Sync(enteredPassword, salt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
