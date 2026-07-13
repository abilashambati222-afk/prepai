const mongoose = require('mongoose');

const codingSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  language: { type: String, required: true }, // 'javascript', 'python', 'java', 'cpp', 'c'
  code: { type: String, required: true },
  verdict: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
    required: true
  },
  executionTime: { type: Number, default: 0 }, // in ms
  memory: { type: Number, default: 0 }, // in KB
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
