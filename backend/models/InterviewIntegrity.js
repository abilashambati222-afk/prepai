const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['face_missing', 'multiple_faces', 'phone_detected', 'eye_looking_away', 'fullscreen_exit', 'webcam_disabled', 'mic_disabled', 'looking_left', 'looking_right', 'looking_up', 'looking_down', 'eyes_closed', 'head_left', 'head_right', 'head_down', 'head_away'],
    required: true
  },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // in seconds
  details: { type: String, default: '' }
});

const timelineEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['warning', 'info', 'system'], default: 'info' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const eyeMovementEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['looking_left', 'looking_right', 'looking_up', 'looking_down', 'eyes_closed'], required: true },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 } // in seconds
});

const headPoseEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['head_left', 'head_right', 'head_down', 'head_away'], required: true },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 } // in seconds
});

const evidenceClipSchema = new mongoose.Schema({
  violationType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // in seconds
  confidence: { type: Number, default: 100 },
  videoPath: { type: String, required: true },
  thumbnailPath: { type: String, default: '' },
  modelUsed: { type: String, default: 'Unknown' },
  modelVersion: { type: String, default: '1.0.0' },
  reviewed: { type: Boolean, default: false },
  reviewNotes: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null }
});

const sessionHealthSchema = new mongoose.Schema({
  averageFps: { type: Number, default: 0 },
  aiInferenceTimeMs: { type: Number, default: 0 },
  droppedFramesCount: { type: Number, default: 0 },
  cameraResolution: { type: String, default: '' },
  browserVersion: { type: String, default: '' }
});

const interviewIntegritySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true, index: true },
    integrityScore: { type: Number, default: 100, min: 0, max: 100 },
    warnings: { type: Number, default: 0 },
    violations: [violationSchema],
    timeline: [timelineEventSchema],
    eyeMovementEvents: [eyeMovementEventSchema],
    headPoseEvents: [headPoseEventSchema],
    evidenceClips: [evidenceClipSchema],
    sessionHealth: { type: sessionHealthSchema, default: () => ({}) },
    duration: { type: Number, default: 0 }, // total interview duration in seconds
    status: {
      type: String,
      enum: ['completed', 'terminated'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('InterviewIntegrity', interviewIntegritySchema);
