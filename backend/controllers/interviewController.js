const interviewEngine = require('../services/interview/interviewEngine');
const interviewHistory = require('../services/interview/interviewHistory');
const companyInterviewEngine = require('../services/interview/companyInterviewEngine');
const roleInterviewEngine = require('../services/interview/roleInterviewEngine');
const analyticsEngine = require('../services/interview/analyticsEngine');
const reportGenerator = require('../services/interview/reportGenerator');
const transcriptGenerator = require('../services/interview/transcriptGenerator');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InterviewIntegrity = require('../models/InterviewIntegrity');

/**
 * Controller exposing all Phase 10 Mock Interview operations
 */

/**
 * POST /api/v1/interview/start
 */
exports.startInterview = async (req, res, next) => {
  try {
    const { interviewType, company, role, difficulty } = req.body;
    if (!interviewType) {
      throw new BadRequestError('interviewType is required.');
    }

    const session = await interviewEngine.startInterview(req.user, {
      interviewType,
      company: company || '',
      role: role || req.user.targetRole || 'Software Engineer',
      difficulty: difficulty || 'Medium'
    });

    // Create the InterviewIntegrity tracking document
    await InterviewIntegrity.create({
      user: req.user._id,
      interview: session._id,
      integrityScore: 100,
      warnings: 0,
      violations: [],
      timeline: [{ type: 'info', message: 'Readiness check complete. Session proctoring started.', timestamp: new Date() }]
    });

    res.status(201).json({
      success: true,
      message: 'Interview session started successfully.',
      data: session
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/interview/answer
 */
exports.submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, answerText, duration } = req.body;
    if (!interviewId || answerText === undefined) {
      throw new BadRequestError('interviewId and answerText are required.');
    }

    const result = await interviewEngine.submitAnswer(req.user._id, {
      interviewId,
      answerText,
      duration: duration || 0
    });

    res.status(200).json({
      success: true,
      message: 'Answer processed successfully.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/interview/end
 */
exports.endInterview = async (req, res, next) => {
  try {
    const { interviewId, status } = req.body;
    if (!interviewId) {
      throw new BadRequestError('interviewId is required.');
    }

    const result = await interviewEngine.endInterview(req.user._id, interviewId);

    // Save final status in proctor logs
    const integrity = await InterviewIntegrity.findOne({ interview: interviewId, user: req.user._id });
    if (integrity) {
      if (status) integrity.status = status;
      if (req.body.sessionHealth) {
        const sh = req.body.sessionHealth;
        integrity.sessionHealth = {
          averageFps: Number(sh.averageFps) || 0,
          aiInferenceTimeMs: Number(sh.aiInferenceTimeMs) || 0,
          droppedFramesCount: Number(sh.droppedFramesCount) || 0,
          cameraResolution: String(sh.cameraResolution || ''),
          browserVersion: String(sh.browserVersion || '')
        };
      }
      integrity.timeline.push({
        type: 'info',
        message: `Interview proctoring finalized. Status: ${status || 'completed'}. Final integrity score: ${integrity.integrityScore}%`,
        timestamp: new Date()
      });
      await integrity.save();
    }

    res.status(200).json({
      success: true,
      message: 'Interview completed and analytics saved.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/interview/session/:id
 */
exports.getSessionDetails = async (req, res, next) => {
  try {
    const session = await interviewHistory.getSession(req.user._id, req.params.id);
    if (!session) {
      throw new NotFoundError('Interview session not found.');
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/interview/history
 */
exports.getHistory = async (req, res, next) => {
  try {
    const history = await interviewHistory.getHistory(req.user._id);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/interview/report/:id
 */
exports.getReport = async (req, res, next) => {
  try {
    const session = await interviewHistory.getSession(req.user._id, req.params.id);
    if (!session) {
      throw new NotFoundError('Interview session not found.');
    }

    if (session.status !== 'completed' && session.status !== 'ended') {
      throw new BadRequestError('Cannot fetch report for an incomplete interview.');
    }

    const report = reportGenerator.generateReport(session);

    // Retrieve corresponding integrity logs
    const integrity = await InterviewIntegrity.findOne({ interview: req.params.id, user: req.user._id }).lean();

    res.status(200).json({
      success: true,
      data: {
        ...report,
        integrity: integrity || null
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/interview/analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsEngine.generateUserAnalytics(req.user._id);
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/interview/readiness
 */
exports.getCompanyReadiness = async (req, res, next) => {
  try {
    const Career = require('../models/Career');
    const career = await Career.findOne({ user: req.user._id });
    
    res.status(200).json({
      success: true,
      data: {
        companyReadiness: career ? career.companyReadiness : [],
        targetCompany: req.user.targetCompany,
        readinessPercent: req.user.interviewReadiness || 0
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/interview/generate
 * (Generates/fetches company-wise recruitment tracks patterns)
 */
exports.generateCompanyTrack = async (req, res, next) => {
  try {
    const { company } = req.body;
    if (!company) {
      throw new BadRequestError('company name is required.');
    }

    const pattern = companyInterviewEngine.getCompanyInterviewPattern(company);
    res.status(200).json({
      success: true,
      data: pattern
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Short-cut handlers to start specific tracks (HR, Coding, Behavioral)
 */
exports.startHRInterview = async (req, res, next) => {
  req.body.interviewType = 'HR Interview';
  return this.startInterview(req, res, next);
};

exports.startCodingInterview = async (req, res, next) => {
  req.body.interviewType = 'Coding Interview';
  return this.startInterview(req, res, next);
};

exports.startBehavioralInterview = async (req, res, next) => {
  req.body.interviewType = 'Behavioral Interview';
  return this.startInterview(req, res, next);
};

/**
 * GET /api/v1/interview/:id/transcript
 * Returns printable raw text transcript
 */
exports.getTranscript = async (req, res, next) => {
  try {
    const session = await interviewHistory.getSession(req.user._id, req.params.id);
    if (!session) {
      throw new NotFoundError('Session not found.');
    }

    const transcript = transcriptGenerator.generateTranscript(session);
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(transcript);
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/interview/event
exports.logProctorEvent = async (req, res, next) => {
  try {
    const { interviewId, eventType, details, duration = 0 } = req.body;
    if (!interviewId || !eventType) {
      return res.status(400).json({ success: false, message: 'interviewId and eventType are required.' });
    }

    const integrity = await InterviewIntegrity.findOne({ interview: interviewId, user: req.user._id });
    if (!integrity) {
      return res.status(404).json({ success: false, message: 'Integrity record not found.' });
    }

    // Sort events into specialized arrays for granular analytics
    const eyeEvents = ['looking_left', 'looking_right', 'looking_up', 'looking_down', 'eyes_closed'];
    const headEvents = ['head_left', 'head_right', 'head_down', 'head_away'];

    if (eyeEvents.includes(eventType)) {
      integrity.eyeMovementEvents.push({
        type: eventType,
        duration,
        timestamp: new Date()
      });
    } else if (headEvents.includes(eventType)) {
      integrity.headPoseEvents.push({
        type: eventType,
        duration,
        timestamp: new Date()
      });
    } else {
      integrity.violations.push({
        type: eventType,
        duration,
        details: details || '',
        timestamp: new Date()
      });
    }

    integrity.timeline.push({
      type: 'info',
      message: `System flag logged: ${eventType.replace('_', ' ')}. Details: ${details || 'None'}`,
      timestamp: new Date()
    });

    await integrity.save();

    res.status(200).json({ success: true, message: 'Proctor event logged successfully.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/interview/warning
exports.logProctorWarning = async (req, res, next) => {
  try {
    const { interviewId, warningType, details } = req.body;
    if (!interviewId || !warningType) {
      return res.status(400).json({ success: false, message: 'interviewId and warningType are required.' });
    }

    const integrity = await InterviewIntegrity.findOne({ interview: interviewId, user: req.user._id });
    if (!integrity) {
      return res.status(404).json({ success: false, message: 'Integrity record not found.' });
    }

    const { PROCTOR_POLICIES } = require('../config/proctorConfig');
    const policy = PROCTOR_POLICIES[warningType] || { scoreDeduction: 5 };
    const deduction = policy.scoreDeduction;

    integrity.warnings += 1;
    integrity.integrityScore = Math.max(0, integrity.integrityScore - deduction);

    integrity.violations.push({
      type: warningType,
      duration: 0,
      details: details || `Warning triggered for ${warningType.replace('_', ' ')}`,
      timestamp: new Date()
    });

    integrity.timeline.push({
      type: 'warning',
      message: `WARNING #${integrity.warnings}: Prohibited activity: ${warningType.replace('_', ' ')}. Integrity score: ${integrity.integrityScore}%`,
      timestamp: new Date()
    });

    await integrity.save();

    res.status(200).json({
      success: true,
      message: 'Warning logged successfully.',
      data: {
        warnings: integrity.warnings,
        integrityScore: integrity.integrityScore
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/interview/evidence
exports.uploadProctorEvidence = async (req, res, next) => {
  try {
    const { 
      interviewId, 
      violationType, 
      confidence = 100, 
      duration = 10, 
      modelUsed = 'Unknown', 
      modelVersion = '1.0.0' 
    } = req.body;

    if (!interviewId || !violationType || !req.files || !req.files['video']) {
      return res.status(400).json({
        success: false,
        message: 'interviewId, violationType, and video file are required.'
      });
    }

    const integrity = await InterviewIntegrity.findOne({ interview: interviewId, user: req.user._id });
    if (!integrity) {
      return res.status(404).json({ success: false, message: 'Integrity record not found.' });
    }

    const videoFile = req.files['video'][0];
    const videoPath = `/uploads/${videoFile.filename}`;
    
    const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    const thumbnailPath = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : '';

    integrity.evidenceClips.push({
      violationType,
      duration: parseInt(duration),
      confidence: parseFloat(confidence),
      videoPath,
      thumbnailPath,
      modelUsed,
      modelVersion,
      reviewed: false,
      reviewNotes: '',
      reviewedBy: null,
      reviewedAt: null
    });

    integrity.timeline.push({
      type: 'info',
      message: `Evidence clip recorded for: ${violationType.replace('_', ' ')}. Method: ${modelUsed} v${modelVersion} (Confidence: ${confidence}%)`,
      timestamp: new Date()
    });

    await integrity.save();

    res.status(201).json({
      success: true,
      message: 'Evidence clip uploaded and linked successfully.',
      data: integrity
    });
  } catch (err) {
    next(err);
  }
};
