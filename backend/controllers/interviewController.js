const interviewEngine = require('../services/interview/interviewEngine');
const interviewHistory = require('../services/interview/interviewHistory');
const companyInterviewEngine = require('../services/interview/companyInterviewEngine');
const roleInterviewEngine = require('../services/interview/roleInterviewEngine');
const analyticsEngine = require('../services/interview/analyticsEngine');
const reportGenerator = require('../services/interview/reportGenerator');
const transcriptGenerator = require('../services/interview/transcriptGenerator');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

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
    const { interviewId } = req.body;
    if (!interviewId) {
      throw new BadRequestError('interviewId is required.');
    }

    const result = await interviewEngine.endInterview(req.user._id, interviewId);

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

    if (session.status !== 'completed') {
      throw new BadRequestError('Cannot fetch report for an incomplete interview.');
    }

    const report = reportGenerator.generateReport(session);

    res.status(200).json({
      success: true,
      data: report
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
