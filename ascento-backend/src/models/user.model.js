const mongoose = require('mongoose');
const { ROLES } = require('../config/constants');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, sparse: true, unique: true, index: true },
    phone: { type: String, trim: true, sparse: true, unique: true, index: true },
    username: { type: String, trim: true, sparse: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), required: true, index: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

module.exports = mongoose.model('User', UserSchema);
