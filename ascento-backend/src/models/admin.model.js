const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
