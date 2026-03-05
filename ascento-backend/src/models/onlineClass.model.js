const mongoose = require('mongoose');

const OnlineClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null, index: true },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    startDateTime: { type: Date, required: true, index: true },
    endDateTime: { type: Date, required: true },
    meetingLink: { type: String, required: true, trim: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true, index: true },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'onlineClasses'
  }
);

OnlineClassSchema.index({ classId: 1, startDateTime: 1 });

module.exports = mongoose.model('OnlineClass', OnlineClassSchema);
