const mongoose = require('mongoose');

const codingBookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Compound unique index to prevent duplicate bookmarks per user
codingBookmarkSchema.index({ user: 1, problem: 1 }, { unique: true });

module.exports = mongoose.model('CodingBookmark', codingBookmarkSchema);
