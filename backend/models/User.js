const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      default: 'student'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    profileCompleted: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: String,
      default: ''
    },
    lastLogin: {
      type: Date
    },

    // ==========================================
    // PHASE 3: USER ONBOARDING & PROFILE FIELDS
    // ==========================================

    // Personal Details
    phone: {
      type: String,
      trim: true,
      default: ''
    },

    // Academic Profile
    college: {
      type: String,
      trim: true,
      default: ''
    },
    degree: {
      type: String,
      trim: true,
      default: ''
    },
    branch: {
      type: String,
      trim: true,
      default: ''
    },
    graduationYear: {
      type: Number,
      default: null
    },
    cgpa: {
      type: Number,
      default: null
    },

    // Career Ambitions
    targetRole: {
      type: String,
      trim: true,
      default: ''
    },
    experienceLevel: {
      type: String,
      enum: {
        values: ['Student', 'Fresher', 'Experienced'],
        message: 'Experience level must be Student, Fresher, or Experienced'
      },
      default: 'Student'
    },
    preferredCompanies: {
      type: [String],
      default: []
    },

    // Skillsets
    programmingLanguages: {
      type: [String],
      default: []
    },
    frameworks: {
      type: [String],
      default: []
    },
    databases: {
      type: [String],
      default: []
    },
    tools: {
      type: [String],
      default: []
    },

    // Social Links
    github: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    portfolio: {
      type: String,
      trim: true,
      default: ''
    },

    // Practice Preferences
    dailyGoal: {
      type: Number,
      default: 5
    },
    preferredDifficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Preferred difficulty must be Easy, Medium, or Hard'
      },
      default: 'Medium'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },

    // Resume Management & Parsing Metadata
    resumeMetadata: {
      resumeId: { type: String, default: '' },
      version: { type: Number, default: 1 },
      fileHash: { type: String, default: '' },
      status: {
        type: String,
        enum: ['Uploaded', 'Parsing', 'Parsed', 'Analyzed', 'Failed'],
        default: 'Uploaded'
      },
      uploadedAt: { type: Date, default: null },
      fileSize: { type: Number, default: 0 },
      storagePath: { type: String, default: '' },
      mimeType: { type: String, default: '' },
      originalFileName: { type: String, default: '' },
      storedFileName: { type: String, default: '' },
      rawText: { type: String, default: '' },
      parsedData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      parsingConfidence: { type: Number, default: 0 },
      parserVersion: { type: String, default: '1.0.0' },
      parsingLogs: {
        startedAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        duration: { type: Number, default: 0 },
        errors: { type: [String], default: [] }
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
      },
      atsScore: { type: Number, default: null },
      lastAnalyzed: { type: Date, default: null },
      skillsExtracted: { type: [String], default: [] }
    }
  },
  {
    timestamps: true
  }
);

// Hash password hook before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it is modified (or new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
