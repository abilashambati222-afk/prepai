const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const starterCodeSchema = new mongoose.Schema({
  language: { type: String, required: true }, // 'javascript', 'python', 'java', 'cpp', 'c'
  code: { type: String, required: true }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true }, // e.g., 'Arrays', 'Strings', 'Linked Lists', etc.
  constraints: [{ type: String }],
  examples: [exampleSchema],
  starterCode: [starterCodeSchema],
  testCases: [testCaseSchema],
  tags: [{ type: String }],
  companyTags: [{ type: String }],
  acceptanceRate: { type: Number, default: 50.0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
