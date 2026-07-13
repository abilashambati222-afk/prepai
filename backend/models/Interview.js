const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['technical', 'hr', 'behavioral', 'coding', 'resume', 'project'],
    required: true 
  },
  category: { type: String, default: 'General' },
  
  // For coding questions
  constraints: { type: [String], default: [] },
  examples: { type: [mongoose.Schema.Types.Mixed], default: [] },
  hints: { type: [String], default: [] },
  expectedComplexity: { type: String, default: '' },
  referenceSolution: { type: String, default: '' },
  testCases: { type: [mongoose.Schema.Types.Mixed], default: [] },

  // Candidate answer details
  answer: {
    answerText: { type: String, default: '' },
    submittedAt: { type: Date, default: null },
    duration: { type: Number, default: 0 } // in seconds
  },

  // Dynamic feedback parameters
  feedback: {
    score: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    keywords: { type: [String], default: [] },
    depth: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    professionalism: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    technicalAccuracy: { type: Number, default: 0 },
    
    // For behavioral evaluation
    starEvaluation: {
      situation: { type: String, default: '' },
      task: { type: String, default: '' },
      action: { type: String, default: '' },
      result: { type: String, default: '' }
    },
    
    explanation: { type: String, default: '' },
    improvementSuggestions: { type: [String], default: [] }
  }
});

const interviewAnalyticsSchema = new mongoose.Schema({
  overallScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  hrScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  behaviorScore: { type: Number, default: 0 },
  codingScore: { type: Number, default: 0 },
  averageAnswerScore: { type: Number, default: 0 },
  weakAreas: { type: [String], default: [] },
  strongAreas: { type: [String], default: [] },
  topicDistribution: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const interviewCertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  pdfUrl: { type: String, default: '' }
});

const interviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    interviewType: {
      type: String,
      enum: [
        'HR Interview',
        'Technical Interview',
        'Behavioral Interview',
        'Managerial Interview',
        'Resume Based Interview',
        'Project Based Interview',
        'Coding Interview'
      ],
      required: true
    },
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    status: {
      type: String,
      enum: ['started', 'in_progress', 'completed', 'ended'],
      default: 'started'
    },
    duration: { type: Number, default: 0 }, // in seconds
    questions: { type: [interviewQuestionSchema], default: [] },
    analytics: { type: interviewAnalyticsSchema, default: () => ({}) },
    certificate: { type: interviewCertificateSchema, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
