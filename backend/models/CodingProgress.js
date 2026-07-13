const mongoose = require('mongoose');

const codingProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' }],
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  dailyStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  monthlySubmissions: [{
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    count: { type: Number, default: 0 }
  }],
  successRate: { type: Number, default: 0.0 },
  languagesUsed: [{
    language: { type: String, required: true },
    count: { type: Number, default: 0 }
  }],
  problemNotes: [{
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
    content: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('CodingProgress', codingProgressSchema);
