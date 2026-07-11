const { RESUME_ANALYSIS_TEMPLATE } = require('./promptTemplates/resumeAnalysis');

/**
 * Compile prompt template by injecting actual candidate context
 * @param {object} parsedData - Structured resume JSON
 * @param {object} user - User model context (role, experience, goal)
 * @param {string} jobDescriptionText - Target job description text
 * @returns {string} Final compiled prompt string
 */
exports.buildResumeAnalysisPrompt = (parsedData, user, jobDescriptionText) => {
  if (!parsedData) {
    throw new Error('Parsed resume data is required to construct the AI prompt.');
  }

  const targetRole = user.targetRole || 'Software Engineer';
  const experienceLevel = user.experienceLevel || 'Entry Level';
  const parsedDataString = JSON.stringify(parsedData, null, 2);
  const jobDesc = jobDescriptionText || 'Not provided';

  return RESUME_ANALYSIS_TEMPLATE
    .replace('{{TARGET_ROLE}}', targetRole)
    .replace('{{EXPERIENCE_LEVEL}}', experienceLevel)
    .replace('{{JOB_DESCRIPTION}}', jobDesc)
    .replace('{{PARSED_DATA}}', parsedDataString);
};
