const CareerHistory = require('../../models/CareerHistory');

/**
 * Saves a career analysis checkpoint in MongoDB, including detailed skills/projects inventory.
 */
exports.saveSnapshot = async (userId, careerScore, skillsCount, readyCompaniesCount, resumeHash, skills = [], projects = [], eligibleCompanies = []) => {
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
      skills,
      projects,
      eligibleCompanies,
      analyzedAt: new Date()
    });
  } catch (err) {
    console.error('[History Tracker] Failed to save career snapshot:', err);
    throw err;
  }
};

/**
 * Computes progress comparisons between current and previous resume/profile snapshots, including details of what changed.
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
        newSkills: [],
        projectsAdded: [],
        companiesUnlocked: [],
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

    // Identify what changed (Resume Evolution details)
    const newSkills = [];
    const projectsAdded = [];
    const companiesUnlocked = [];

    if (previous) {
      const prevSkillsLower = new Set((previous.skills || []).map(s => s.toLowerCase().trim()));
      (current.skills || []).forEach(skill => {
        if (!prevSkillsLower.has(skill.toLowerCase().trim())) {
          newSkills.push(skill);
        }
      });

      const prevProjectsLower = new Set((previous.projects || []).map(p => p.toLowerCase().trim()));
      (current.projects || []).forEach(proj => {
        if (!prevProjectsLower.has(proj.toLowerCase().trim())) {
          projectsAdded.push(proj);
        }
      });

      const prevCompaniesLower = new Set((previous.eligibleCompanies || []).map(c => c.toLowerCase().trim()));
      (current.eligibleCompanies || []).forEach(company => {
        if (!prevCompaniesLower.has(company.toLowerCase().trim())) {
          companiesUnlocked.push(company);
        }
      });
    } else {
      // First upload: all current items are considered "new/added"
      newSkills.push(...(current.skills || []).slice(0, 5));
      projectsAdded.push(...(current.projects || []));
      companiesUnlocked.push(...(current.eligibleCompanies || []).slice(0, 3));
    }

    return {
      previousCareerScore,
      currentCareerScore,
      improvementPercent,
      skillGrowth,
      readinessGrowth,
      newSkills,
      projectsAdded,
      companiesUnlocked,
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
