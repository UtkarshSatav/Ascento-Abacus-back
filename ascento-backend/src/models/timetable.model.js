const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  class: { type: Number, required: true },
  section: { type: String, required: true },
  entries: [{ day: String, period: Number, subject: String, teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } }]
}, { timestamps: true });

TimetableSchema.index({ class: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', TimetableSchema);
