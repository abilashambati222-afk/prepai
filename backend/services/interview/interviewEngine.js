const User = require('../../models/User');
const Career = require('../../models/Career');
const Interview = require('../../models/Interview');
const interviewFlow = require('./interviewFlow');
const scoreCalculator = require('./scoreCalculator');
const reportGenerator = require('./reportGenerator');
const transcriptGenerator = require('./transcriptGenerator');
const analyticsEngine = require('./analyticsEngine');

/**
 * Main Coordinator Engine for the Phase 10 Mock Interview & Analytics Platform.
 */

/**
 * Initialize a mock interview session
 */
exports.startInterview = async (user, params) => {
  return await interviewFlow.startSession(user, params);
};

/**
 * Submit an answer, evaluate it, and return the next question
 */
exports.submitAnswer = async (userId, params) => {
  const { interviewId, answerText, duration } = params;

  // Retrieve active session
  const session = await Interview.findOne({ _id: interviewId, user: userId });
  if (!session) {
    throw new Error('Interview session not found or unauthorized.');
  }

  if (session.status === 'completed' || session.status === 'ended') {
    throw new Error('This interview session is already complete.');
  }

  // Progress the flow
  const result = await interviewFlow.submitAnswer(session, answerText, duration);

  // If completed, trigger termination hook immediately to save steps
  if (result.isCompleted) {
    await this.endInterview(userId, interviewId);
  }

  return result;
};

/**
 * Terminate/Complete interview session, calculate analytics, update readiness, issue certificates
 */
exports.endInterview = async (userId, interviewId) => {
  // Retrieve session
  const session = await Interview.findOne({ _id: interviewId, user: userId });
  if (!session) {
    throw new Error('Interview session not found or unauthorized.');
  }

  // 1. Calculate and populate analytics
  const scores = scoreCalculator.calculateSessionAnalytics(session.questions);
  
  // Distinguish weak vs strong areas
  const weakAreas = [];
  const strongAreas = [];
  const topicDistribution = {};

  (session.questions || []).forEach(q => {
    if (q.feedback) {
      const topic = q.category || 'General';
      const score = q.feedback.score || 0;
      
      if (!topicDistribution[topic]) {
        topicDistribution[topic] = [];
      }
      topicDistribution[topic].push(score);
    }
  });

  Object.entries(topicDistribution).forEach(([topic, scoresList]) => {
    const avg = Math.round(scoresList.reduce((a, b) => a + b, 0) / scoresList.length);
    topicDistribution[topic] = avg;
    if (avg < 70) {
      weakAreas.push(topic);
    } else {
      strongAreas.push(topic);
    }
  });

  session.analytics = {
    overallScore: scores.overallScore,
    technicalScore: scores.technicalScore,
    hrScore: scores.hrScore,
    communicationScore: scores.communicationScore,
    confidenceScore: scores.confidenceScore,
    behaviorScore: scores.behaviorScore,
    codingScore: scores.codingScore,
    averageAnswerScore: scores.averageAnswerScore,
    weakAreas,
    strongAreas,
    topicDistribution
  };

  session.status = 'completed';

  // 2. Certificate Issuance (score >= 70%)
  let certificate = null;
  if (scores.overallScore >= 70) {
    const certId = `CERT-INT-${session.interviewType.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    certificate = {
      certificateId: certId,
      issuedAt: new Date(),
      pdfUrl: `/api/v1/interview/${session._id}/certificate/pdf` // virtual URL endpoint
    };
    session.certificate = certificate;
  }

  await session.save();

  // 3. Update Company Readiness Transition (Phase 10 Module 15)
  let readinessTransition = null;
  const user = await User.findById(userId);
  if (user) {
    let career = await Career.findOne({ user: userId });
    
    // Fallback: initialize career if missing
    if (!career) {
      const { analyzeCareerProfile } = require('../career/careerEngine');
      const initial = await analyzeCareerProfile(user, null);
      career = await Career.create({
        user: userId,
        ...initial
      });
    }

    // Determine target company (fall back to interview company or user's target company)
    const targetComp = session.company || user.targetCompany;
    if (targetComp && career.companyReadiness) {
      const idx = career.companyReadiness.findIndex(
        c => c.companyName.toLowerCase() === targetComp.toLowerCase().trim()
      );

      if (idx >= 0) {
        const oldVal = career.companyReadiness[idx].readinessPercent;
        
        // Blend resume readiness with actual mock interview performance:
        // 60% profile matching + 40% performance score
        const newVal = Math.round((oldVal * 0.6) + (scores.overallScore * 0.4));
        
        career.companyReadiness[idx].readinessPercent = newVal;
        career.companyReadiness[idx].readinessLevel = newVal >= 90 ? 'Ready' : (newVal >= 75 ? 'High' : (newVal >= 50 ? 'Medium' : 'Low'));
        
        readinessTransition = {
          company: targetComp,
          oldReadiness: oldVal,
          newReadiness: newVal,
          level: career.companyReadiness[idx].readinessLevel
        };
      }
    }

    // Append to user's general interview aggregates for fast dashboard reads
    user.overallInterviewScore = scores.overallScore;
    user.interviewReadiness = readinessTransition ? readinessTransition.newReadiness : scores.overallScore;
    
    if (session.interviewType.includes('Technical')) user.technicalScores.push(scores.technicalScore);
    if (session.interviewType.includes('HR')) user.hrScores.push(scores.hrScore);
    if (session.interviewType.includes('Behavioral')) user.behaviorScores.push(scores.behaviorScore);
    if (session.interviewType.includes('Coding')) user.codingScores.push(scores.codingScore);

    if (session.company) {
      if (!user.companyScores) user.companyScores = {};
      user.companyScores[session.company] = scores.overallScore;
    }

    user.interviewHistory.push(session._id);
    user.mockInterviews.push(session._id);
    
    if (certificate) {
      user.interviewCertificates.push({
        certificateId: certificate.certificateId,
        issuedAt: certificate.issuedAt,
        role: session.role,
        company: session.company,
        score: scores.overallScore,
        type: session.interviewType
      });
    }

    // Aggregate overall progress dashboard statistics
    const finalUserAnalytics = await analyticsEngine.generateUserAnalytics(userId);
    user.interviewAnalytics = finalUserAnalytics;

    user.markModified('companyScores');
    user.markModified('interviewAnalytics');
    await user.save();
    await career.save();
  }

  // 4. Generate report summary object
  const report = reportGenerator.generateReport(session);

  return {
    session,
    report,
    readinessTransition,
    certificate
  };
};
