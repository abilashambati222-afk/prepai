const Interview = require('../../models/Interview');

/**
 * Computes career/interview statistics across historical runs
 */
exports.generateUserAnalytics = async (userId) => {
  const history = await Interview.find({ user: userId, status: 'completed' }).sort({ createdAt: 1 });
  
  if (history.length === 0) {
    return {
      overallInterviewScore: 0,
      technicalScore: 0,
      hrScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      behaviorScore: 0,
      codingScore: 0,
      completedInterviewsCount: 0,
      weakAreas: [],
      strongAreas: [],
      topicDistribution: {},
      progressHistory: []
    };
  }

  let totalScore = 0;
  let techSum = 0, techCount = 0;
  let hrSum = 0, hrCount = 0;
  let commSum = 0;
  let confSum = 0;
  let behaviorSum = 0, behaviorCount = 0;
  let codingSum = 0, codingCount = 0;

  const topicsMap = {}; // topic -> { sum, count }

  history.forEach(session => {
    const anal = session.analytics || {};
    totalScore += anal.overallScore || 0;
    commSum += anal.communicationScore || 0;
    confSum += anal.confidenceScore || 0;

    if (anal.technicalScore) {
      techSum += anal.technicalScore;
      techCount++;
    }
    if (anal.hrScore) {
      hrSum += anal.hrScore;
      hrCount++;
    }
    if (anal.behaviorScore) {
      behaviorSum += anal.behaviorScore;
      behaviorCount++;
    }
    if (anal.codingScore) {
      codingSum += anal.codingScore;
      codingCount++;
    }

    // Question-level topic tracking
    (session.questions || []).forEach(q => {
      if (q.feedback && q.feedback.score) {
        const cat = q.category || 'General';
        if (!topicsMap[cat]) {
          topicsMap[cat] = { sum: 0, count: 0 };
        }
        topicsMap[cat].sum += q.feedback.score;
        topicsMap[cat].count++;
      }
    });
  });

  const totalCount = history.length;
  const averageScore = Math.round(totalScore / totalCount);

  // Distinguish weak vs strong areas (threshold = 70%)
  const weakAreas = [];
  const strongAreas = [];
  const topicDistribution = {};

  Object.entries(topicsMap).forEach(([topic, data]) => {
    const avg = Math.round(data.sum / data.count);
    topicDistribution[topic] = avg;
    if (avg < 70) {
      weakAreas.push(topic);
    } else {
      strongAreas.push(topic);
    }
  });

  const progressHistory = history.map(session => ({
    date: session.createdAt.toLocaleDateString(),
    score: session.analytics?.overallScore || 0,
    role: session.role || 'General',
    type: session.interviewType
  }));

  return {
    overallInterviewScore: averageScore,
    technicalScore: techCount > 0 ? Math.round(techSum / techCount) : averageScore,
    hrScore: hrCount > 0 ? Math.round(hrSum / hrCount) : averageScore,
    communicationScore: Math.round(commSum / totalCount),
    confidenceScore: Math.round(confSum / totalCount),
    behaviorScore: behaviorCount > 0 ? Math.round(behaviorSum / behaviorCount) : averageScore,
    codingScore: codingCount > 0 ? Math.round(codingSum / codingCount) : averageScore,
    completedInterviewsCount: totalCount,
    weakAreas: weakAreas.slice(0, 5),
    strongAreas: strongAreas.slice(0, 5),
    topicDistribution,
    progressHistory
  };
};
