const mongoose = require('mongoose');

const mcqAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQQuestion',
    required: true
  },
  selectedOptionIndex: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const mcqQuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  accuracy: {
    type: Number, // percentage
    required: true
  },
  quizMode: {
    type: String,
    enum: ['Practice', 'Test'],
    required: true
  },
  answers: [mcqAnswerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index to query history of a specific user quickly
mcqQuizResultSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('MCQQuizResult', mcqQuizResultSchema);
