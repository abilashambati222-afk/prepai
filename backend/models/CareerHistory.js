const mongoose = require('mongoose');

const careerHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  careerScore: { type: Number, required: true },
  skillsCount: { type: Number, required: true },
  readyCompaniesCount: { type: Number, required: true },
  resumeHash: { type: String, default: '' },
  skills: { type: [String], default: [] },
  projects: { type: [String], default: [] },
  eligibleCompanies: { type: [String], default: [] },
  analyzedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerHistory', careerHistorySchema);
