const mongoose = require('mongoose');

const companyReadinessSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  readinessPercent: { type: Number, required: true },
  readinessLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Ready'], required: true },
  confidence: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  reasons: { type: [String], default: [] },
  explanation: { type: String, default: '' },
  improvementSuggestions: { type: [String], default: [] },
  strengths: { type: [String], default: [] },
  missing: { type: [String], default: [] },
  projectsRequired: { type: String, default: '' },
  estimatedPrepTime: { type: String, default: '' }
});

const companyRecommendationsSchema = new mongoose.Schema({
  ready: { type: [String], default: [] },
  almostReady: { type: [String], default: [] },
  needImprovement: { type: [String], default: [] },
  explanation: { type: String, default: '' }
});

const recommendedRoleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  score: { type: Number, required: true },
  matchPercentage: { type: Number, required: true },
  reasons: { type: [String], default: [] }
});

const skillGapSchema = new mongoose.Schema({
  jobDescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', required: true },
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  existingSkills: { type: mongoose.Schema.Types.Mixed, default: {} },
  missingSkills: { type: mongoose.Schema.Types.Mixed, default: {} },
  criticalSkills: { type: mongoose.Schema.Types.Mixed, default: {} },
  optionalSkills: { type: mongoose.Schema.Types.Mixed, default: {} },
  analyzedAt: { type: Date, default: Date.now }
});

const weeklyGoalSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  goal: { type: String, required: true },
  topics: { type: [String], default: [] },
  milestone: { type: String, default: '' }
});

const monthlyGoalSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  goal: { type: String, required: true },
  milestones: { type: [String], default: [] }
});

const roadmapSchema = new mongoose.Schema({
  weeklyGoals: { type: [weeklyGoalSchema], default: [] },
  monthlyGoals: { type: [monthlyGoalSchema], default: [] },
  estimatedCompletionTime: { type: String, default: '' }
});

const resourceSchema = new mongoose.Schema({
  category: { type: String, default: 'Courses' }, // Courses, Books, Documentation, YouTube, Practice Platforms
  name: { type: String, required: true },
  type: { type: String, default: 'Free' }, // Free, Paid
  link: { type: String, default: '' }
});

const projectRecommendationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  techStack: { type: [String], default: [] },
  duration: { type: String, default: '' },
  difficulty: { type: String, default: 'Intermediate' }, // Beginner, Intermediate, Advanced
  learningOutcome: { type: String, default: '' }
});

const certificationRecommendationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, default: '' }, // AWS, Azure, Google Cloud, Oracle, MongoDB, Docker, etc.
  difficulty: { type: String, default: 'Intermediate' },
  rationale: { type: String, default: '' }
});

const salaryPredictionSchema = new mongoose.Schema({
  currentSalaryMin: { type: Number, default: 0 },
  currentSalaryMax: { type: Number, default: 0 },
  expectedSalaryMin: { type: Number, default: 0 },
  expectedSalaryMax: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  explanation: { type: String, default: '' },
  factors: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const timelineSchema = new mongoose.Schema({
  threeMonths: { type: String, default: '' },
  sixMonths: { type: String, default: '' },
  nineMonths: { type: String, default: '' },
  twelveMonths: { type: String, default: '' },
  studyHoursPerWeek: { type: Number, default: 15 }
});

const richResourceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  primary: { type: String, default: '' },
  practice: { type: String, default: '' },
  reference: { type: String, default: '' },
  videos: { type: String, default: '' },
  estimatedTime: { type: String, default: '' }
});

const careerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  careerScore: { type: Number, default: 0 },
  companyReadiness: { type: [companyReadinessSchema], default: [] },
  companyRecommendations: { type: companyRecommendationsSchema, default: () => ({}) },
  recommendedRoles: { type: [recommendedRoleSchema], default: [] },
  skillGaps: { type: [skillGapSchema], default: [] },
  roadmap: { type: roadmapSchema, default: () => ({}) },
  resources: { type: [resourceSchema], default: [] },
  richResources: { type: [richResourceSchema], default: [] },
  projects: { type: [projectRecommendationSchema], default: [] },
  certifications: { type: [certificationRecommendationSchema], default: [] },
  salaryPrediction: { type: salaryPredictionSchema, default: () => ({}) },
  timeline: { type: timelineSchema, default: () => ({}) },
  motivationalSummary: { type: String, default: '' },
  resumeHash: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Career', careerSchema);
