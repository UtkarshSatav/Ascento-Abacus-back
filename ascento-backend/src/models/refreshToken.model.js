const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, required: true },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
