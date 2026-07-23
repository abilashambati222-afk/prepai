const mongoose = require('mongoose');

const mcqBookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQQuestion',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate bookmarks per user
mcqBookmarkSchema.index({ user: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('MCQBookmark', mcqBookmarkSchema);
