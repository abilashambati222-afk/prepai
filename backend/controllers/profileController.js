const User = require('../models/User');
const BadRequestError = require('../errors/BadRequestError');
const { validateProfileUpdate } = require('../validators/profileValidator');

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
 * Get profile of logged in user
 * GET /api/v1/profile
 */
exports.getProfile = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully.',
    data: {
      user: req.user
    }
  });
};

/**
 * Update profile of logged in user
 * PUT /api/v1/profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // 1. Validate inputs
    const errors = validateProfileUpdate(req.body, req.user);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Profile validation failed.',
        errors
      });
    }

    // 2. List of safe fields allowed to be updated (filters email, password, role)
    const allowedFields = [
      'fullName',
      'phone',
      'avatar',
      'college',
      'degree',
      'branch',
      'graduationYear',
      'cgpa',
      'targetRole',
      'targetCompany',
      'targetTimeline',
      'experienceLevel',
      'preferredCompanies',
      'programmingLanguages',
      'frameworks',
      'databases',
      'tools',
      'github',
      'linkedin',
      'portfolio',
      'dailyGoal',
      'preferredDifficulty',
      'notificationsEnabled'
    ];

    // Apply edits
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    // 3. Automated Check: If essential onboarding fields are completed, mark profileCompleted = true
    const hasCoreOnboarding = 
      req.user.fullName && 
      req.user.college && 
      req.user.degree && 
      req.user.branch && 
      req.user.graduationYear && 
      req.user.targetRole;

    if (hasCoreOnboarding) {
      req.user.profileCompleted = true;
    }

    // Save document
    const updatedUser = await req.user.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get profile completion percentage metric
 * GET /api/v1/profile/completion
 */
exports.getProfileCompletion = async (req, res, next) => {
  const completionPercentage = calculateCompletion(req.user);

  res.status(200).json({
    success: true,
    message: 'Profile completion percentage calculated.',
    data: {
      completionPercentage
    }
  });
};
