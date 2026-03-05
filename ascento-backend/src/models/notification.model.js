const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null, index: true },
    onlineClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'OnlineClass', default: null, index: true },
    type: { type: String, required: true, index: true },
    channel: { type: String, enum: ['push', 'email'], required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    reminderMinutes: { type: Number, default: null },
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'queued', index: true },
    sentAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
);

NotificationSchema.index({ userId: 1, onlineClassId: 1, reminderMinutes: 1, channel: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Notification', NotificationSchema);
