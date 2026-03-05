const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  authorRole: { type: String, enum: ['teacher', 'student', 'admin'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  visibility: { type: String, enum: ['public', 'private', 'class'], default: 'public' },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  isPinned: { type: Boolean, default: false },
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
