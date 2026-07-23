const mongoose = require('mongoose');

const mcqQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide the question text']
  },
  options: {
    type: [String],
    required: [true, 'Please provide option choices'],
    validate: {
      validator: function(val) {
        return val && val.length >= 2;
      },
      message: 'A question must have at least 2 options'
    }
  },
  correctOptionIndex: {
    type: Number,
    required: [true, 'Please provide the correct option index'],
    min: [0, 'Correct option index cannot be less than 0']
  },
  explanation: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Please specify the subject'],
    enum: {
      values: ['Aptitude', 'Computer Science', 'Company Prep'],
      message: 'Subject must be Aptitude, Computer Science, or Company Prep'
    }
  },
  topic: {
    type: String,
    required: [true, 'Please specify the topic'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Please specify the difficulty'],
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Difficulty must be Easy, Medium, or Hard'
    }
  },
  tags: {
    type: [String],
    default: []
  },
  companyTags: {
    type: [String],
    default: []
  },
  negativeMarks: {
    type: Number,
    default: 0.25
  },
  estimatedTime: {
    type: Number,
    default: 60 // in seconds
  },
  marks: {
    type: Number,
    default: 1
  },
  hints: {
    type: [String],
    default: []
  },
  references: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for fast querying by subject, topic, and difficulty
mcqQuestionSchema.index({ subject: 1, topic: 1 });
mcqQuestionSchema.index({ difficulty: 1 });

module.exports = mongoose.model('MCQQuestion', mcqQuestionSchema);
