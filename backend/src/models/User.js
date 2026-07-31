const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Synchronous password hashing method using bcryptjs
userSchema.statics.hashPassword = function (password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Method to verify password matching using bcryptjs
userSchema.methods.matchPassword = function (enteredPassword) {
  if (!this.password) return false;
  // Fallback for legacy unhashed or pbkdf2 passwords during migration
  if (this.password.includes(':')) {
    const crypto = require('crypto');
    const [salt, storedHash] = this.password.split(':');
    const hash = crypto.pbkdf2Sync(enteredPassword, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
  }
  return bcrypt.compareSync(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
