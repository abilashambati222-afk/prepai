const Interview = require('../../models/Interview');

/**
 * Historical session log controller
 */
exports.getHistory = async (userId) => {
  return await Interview.find({ user: userId })
    .select('_id interviewType company role difficulty status createdAt analytics')
    .sort({ createdAt: -1 });
};

/**
 * Gets specific session details
 */
exports.getSession = async (userId, sessionId) => {
  return await Interview.findOne({ _id: sessionId, user: userId });
};
