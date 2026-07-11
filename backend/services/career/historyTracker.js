const CareerHistory = require('../../models/CareerHistory');

/**
 * Saves a career analysis checkpoint in MongoDB.
 */
exports.saveSnapshot = async (userId, careerScore, skillsCount, readyCompaniesCount, resumeHash) => {
  try {
    // Avoid duplicate snapshots for identical hashes in same session
    if (resumeHash && resumeHash !== 'manual_profile') {
      const existing = await CareerHistory.findOne({ user: userId, resumeHash });
      if (existing) return existing;
    }
    
    return await CareerHistory.create({
      user: userId,
      careerScore,
      skillsCount,
      readyCompaniesCount,
      resumeHash,
      analyzedAt: new Date()
    });
  } catch (err) {
    console.error('[History Tracker] Failed to save career snapshot:', err);
    throw err;
  }
};

/**
 * Computes progress comparisons between current and previous resume/profile snapshots.
 */
exports.getProgressComparison = async (userId) => {
  try {
    const history = await CareerHistory.find({ user: userId }).sort({ analyzedAt: 1 });
    
    if (history.length === 0) {
      return {
        previousCareerScore: 0,
        currentCareerScore: 0,
        improvementPercent: 0,
        skillGrowth: 0,
        readinessGrowth: 0,
        historyList: []
      };
    }

    const current = history[history.length - 1];
    const previous = history.length > 1 ? history[history.length - 2] : null;

    const previousCareerScore = previous ? previous.careerScore : 0;
    const currentCareerScore = current.careerScore;
    
    let improvementPercent = 0;
    if (previousCareerScore > 0) {
      improvementPercent = Math.round(((currentCareerScore - previousCareerScore) / previousCareerScore) * 100);
    }

    const skillGrowth = current.skillsCount - (previous ? previous.skillsCount : 0);
    const readinessGrowth = current.readyCompaniesCount - (previous ? previous.readyCompaniesCount : 0);

    return {
      previousCareerScore,
      currentCareerScore,
      improvementPercent,
      skillGrowth,
      readinessGrowth,
      historyList: history.map(h => ({
        score: h.careerScore,
        skillsCount: h.skillsCount,
        readyCompaniesCount: h.readyCompaniesCount,
        date: new Date(h.analyzedAt).toLocaleDateString(),
        resumeHash: h.resumeHash
      }))
    };
  } catch (err) {
    console.error('[History Tracker] Failed to retrieve progress comparison:', err);
    throw err;
  }
};
