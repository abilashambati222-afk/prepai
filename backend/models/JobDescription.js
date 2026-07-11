const mongoose = require('mongoose');

const JobDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    jobRole: {
      type: String,
      trim: true,
      default: ''
    },
    jobDescriptionText: {
      type: String,
      required: true,
      trim: true
    },
    favorite: {
      type: Boolean,
      default: false
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    // Cache linkage parameters
    analyzedResumeHash: {
      type: String,
      default: ''
    },
    aiAnalysisStatus: {
      type: String,
      enum: ['Idle', 'Analyzing', 'Analyzed', 'Failed'],
      default: 'Idle'
    },
    aiAnalysisData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    aiAnalysisMetadata: {
      modelName: { type: String, default: 'gemini-2.5-flash' },
      promptVersion: { type: String, default: '1.0.0' },
      analyzedAt: { type: Date, default: null },
      responseTime: { type: Number, default: 0 },
      tokenUsage: {
        promptTokens: { type: Number, default: 0 },
        candidatesTokens: { type: Number, default: 0 },
        totalTokens: { type: Number, default: 0 }
      },
      analysisVersion: { type: String, default: '1.0.0' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobDescription', JobDescriptionSchema);
