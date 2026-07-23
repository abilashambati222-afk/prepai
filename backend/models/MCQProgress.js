const mongoose = require('mongoose');

const mcqProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalSolved: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  wrongCount: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  dailyGoal: {
    type: Number,
    default: 10
  },
  dailySolvedCount: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  },
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  subjectStats: [{
    subject: { type: String, required: true },
    solved: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }
  }],
  topicStats: [{
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    solved: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }
  }],
  weeklyProgress: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 }
  }],
  badges: [{
    name: { type: String, required: true },
    awardedAt: { type: Date, default: Date.now }
  }],
  lastUpdateTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MCQProgress', mcqProgressSchema);
