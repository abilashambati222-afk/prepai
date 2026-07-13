const User = require('../models/User');

/**
 * Calculate Profile Completion Percentage
 * @param {object} user - User document
 * @returns {number} Completion percentage (0 to 100)
 */
const calculateCompletion = (user) => {
  let percentage = 0;

  // 1. Personal (20%)
  if (user.fullName && user.fullName.trim() !== '') percentage += 5;
  if (user.email && user.email.trim() !== '') percentage += 5;
  if (user.phone && user.phone.trim() !== '') percentage += 5;
  if (user.avatar && user.avatar.trim() !== '') percentage += 5;

  // 2. Education (20%)
  if (user.college && user.college.trim() !== '') percentage += 5;
  if (user.degree && user.degree.trim() !== '') percentage += 5;
  if (user.branch && user.branch.trim() !== '') percentage += 5;
  if (user.graduationYear && !isNaN(user.graduationYear)) percentage += 5;

  // 3. Career (20%)
  if (user.targetRole && user.targetRole.trim() !== '') percentage += 7;
  if (user.experienceLevel && user.experienceLevel.trim() !== '') percentage += 7;
  if (user.preferredCompanies && user.preferredCompanies.length > 0) percentage += 6;

  // 4. Skills (20%)
  if (user.programmingLanguages && user.programmingLanguages.length > 0) percentage += 5;
  if (user.frameworks && user.frameworks.length > 0) percentage += 5;
  if (user.databases && user.databases.length > 0) percentage += 5;
  if (user.tools && user.tools.length > 0) percentage += 5;

  // 5. Links (15%)
  if (user.github && user.github.trim() !== '') percentage += 5;
  if (user.linkedin && user.linkedin.trim() !== '') percentage += 5;
  if (user.portfolio && user.portfolio.trim() !== '') percentage += 5;

  // 6. Preferences (5%)
  if (user.dailyGoal !== undefined && user.dailyGoal !== null) percentage += 2.5;
  if (user.preferredDifficulty && user.preferredDifficulty.trim() !== '') percentage += 2.5;

  return Math.min(Math.round(percentage), 100);
};

/**
 * Get aggregate dashboard details for the logged in user
 * GET /api/v1/dashboard
 */
exports.getDashboardData = async (req, res, next) => {
  try {
    const user = req.user;
    const Career = require('../models/Career');
    const career = await Career.findOne({ user: user._id });
    const careerScore = career ? career.careerScore : 0;
    
    // 1. Calculate profile completion ratio
    const completionPercent = calculateCompletion(user);

    // 2. Count skills count across arrays
    const skillsCount = 
      (user.programmingLanguages ? user.programmingLanguages.length : 0) +
      (user.frameworks ? user.frameworks.length : 0) +
      (user.databases ? user.databases.length : 0) +
      (user.tools ? user.tools.length : 0);

    // 3. Calculate streak count based on lastLogin
    let activeStreak = 1;
    if (user.lastLogin) {
      const diffMs = new Date() - new Date(user.lastLogin);
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        activeStreak = 1; // Default active session streak
      }
    }

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully.',
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          targetRole: user.targetRole,
          targetCompany: user.targetCompany || '',
          targetTimeline: user.targetTimeline || '',
          experienceLevel: user.experienceLevel,
          preferredCompanies: user.preferredCompanies || [],
          notificationsEnabled: user.notificationsEnabled,
          preferredDifficulty: user.preferredDifficulty
        },
        careerScore: careerScore,
        overallCareerScore: career ? career.overallCareerScore : 0,
        targetCompanyReadiness: career ? career.targetCompanyReadiness : 0,
        careerScoreFactors: career ? career.careerScoreFactors : null,
        profileCompletion: completionPercent,
        resumeStatus: {
          uploaded: !!(user.resumeMetadata && user.resumeMetadata.storedFileName),
          originalFileName: user.resumeMetadata?.originalFileName || "",
          fileSize: user.resumeMetadata?.fileSize || 0,
          uploadedAt: user.resumeMetadata?.uploadedAt || null,
          storagePath: user.resumeMetadata?.storagePath || "",
          version: user.resumeMetadata?.version || 1,
          status: user.resumeMetadata?.status || 'Uploaded',
          parsingConfidence: user.resumeMetadata?.parsingConfidence || 0,
          lastParsed: user.resumeMetadata?.parsingLogs?.completedAt || user.resumeMetadata?.uploadedAt || null
        },
        streak: activeStreak,
        interviewReadiness: user.interviewReadiness || 0,
        completedInterviews: user.interviewHistory ? user.interviewHistory.length : 0,
        averageScore: user.overallInterviewScore || 0,
        bestCompanyScore: user.companyScores && Object.keys(user.companyScores).length > 0 ? Math.max(...Object.values(user.companyScores).map(Number)) : 0,
        technicalScore: user.interviewAnalytics?.technicalScore || 0,
        hrScore: user.interviewAnalytics?.hrScore || 0,
        communication: user.interviewAnalytics?.communicationScore || 0,
        confidence: user.interviewAnalytics?.confidenceScore || 0,
        coding: user.interviewAnalytics?.codingScore || 0,
        weakTopics: user.interviewAnalytics?.weakAreas || [],
        strongTopics: user.interviewAnalytics?.strongAreas || [],
        todaysGoal: {
          target: user.dailyGoal || 5,
          completed: user.interviewHistory ? user.interviewHistory.length : 0
        },
        quickStats: {
          skillsCount,
          companiesCount: user.preferredCompanies ? user.preferredCompanies.length : 0,
          preferredDifficulty: user.preferredDifficulty || 'Medium',
          notificationsStatus: user.notificationsEnabled ? 'Active' : 'Muted'
        },
        quickActions: [
          { id: 'profile', name: 'Complete Profile', action: '/profile/edit', available: true },
          { id: 'resume', name: 'Upload Resume', action: '/resume-analyzer', available: true },
          { id: 'interview', name: 'Start Mock Interview', action: '/mock-interviews', available: true },
          { id: 'coding', name: 'Practice Coding', action: '/coding-practice', available: false }, // Upcoming
          { id: 'mcq', name: 'Solve MCQs', action: '/mcq-practice', available: false }, // Upcoming
          { id: 'analytics', name: 'View Analytics', action: '/analytics', available: true }
        ]
      }
    });
  } catch (err) {
    next(err);
  }
};
