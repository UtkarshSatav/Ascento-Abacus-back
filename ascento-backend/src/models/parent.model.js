const mongoose = require('mongoose');

const ParentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  {
    timestamps: true,
    collection: 'parents'
  }
);

module.exports = mongoose.model('Parent', ParentSchema);
