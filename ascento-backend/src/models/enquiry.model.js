const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'reviewed', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);
