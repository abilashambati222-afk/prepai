const mongoose = require('mongoose');

const mcqSubmissionSchema = new mongoose.Schema({
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
  selectedOptionIndex: {
    type: Number,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQTest'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

mcqSubmissionSchema.index({ user: 1, submittedAt: -1 });
mcqSubmissionSchema.index({ question: 1 });

module.exports = mongoose.model('MCQSubmission', mcqSubmissionSchema);
