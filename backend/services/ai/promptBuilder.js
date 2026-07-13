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

  const metadata = user.resumeMetadata || {};
  const sectionScores = metadata.sectionScores || {};
  const atsChecklist = metadata.atsChecklist || {};
  const candidateSkills = (metadata.skillsExtracted || []).join(', ') || 'None extracted';
  const jobDesc = jobDescriptionText || 'Not provided';

  return RESUME_ANALYSIS_TEMPLATE
    .replace('{{ATS_SCORE}}', metadata.atsScore || 0)
    .replace('{{RESUME_HEALTH}}', metadata.resumeHealth || 'Average')
    .replace('{{CONTACT_SCORE}}', sectionScores.contactInfo || 0)
    .replace('{{SUMMARY_SCORE}}', sectionScores.summary || 0)
    .replace('{{EDUCATION_SCORE}}', sectionScores.education || 0)
    .replace('{{EXPERIENCE_SCORE}}', sectionScores.experience || 0)
    .replace('{{PROJECTS_SCORE}}', sectionScores.projects || 0)
    .replace('{{SKILLS_SCORE}}', sectionScores.skills || 0)
    .replace('{{CERT_SCORE}}', sectionScores.certifications || 0)
    .replace('{{ACH_SCORE}}', sectionScores.achievements || 0)
    .replace('{{EMAIL_FOUND}}', atsChecklist.emailFound ? '✔ Yes' : '✘ No')
    .replace('{{PHONE_FOUND}}', atsChecklist.phoneFound ? '✔ Yes' : '✘ No')
    .replace('{{LINKEDIN_FOUND}}', atsChecklist.linkedinFound ? '✔ Yes' : '✘ No')
    .replace('{{GITHUB_FOUND}}', atsChecklist.githubFound ? '✔ Yes' : '✘ No')
    .replace('{{EDUCATION_FOUND}}', atsChecklist.educationFound ? '✔ Yes' : '✘ No')
    .replace('{{EXPERIENCE_FOUND}}', atsChecklist.experienceFound ? '✔ Yes' : '✘ No')
    .replace('{{PROJECTS_FOUND}}', atsChecklist.projectsFound ? '✔ Yes' : '✘ No')
    .replace('{{SKILLS_FOUND}}', atsChecklist.skillsFound ? '✔ Yes' : '✘ No')
    .replace('{{BULLETS_FOUND}}', atsChecklist.bulletPointsFound ? '✔ Yes' : '✘ No')
    .replace('{{VERBS_FOUND}}', atsChecklist.actionVerbsFound ? '✔ Yes' : '✘ No')
    .replace('{{CERT_FOUND}}', atsChecklist.certificationsFound ? '✔ Yes' : '✘ No')
    .replace('{{PORTFOLIO_FOUND}}', atsChecklist.portfolioFound ? '✔ Yes' : '✘ No')
    .replace('{{ACH_FOUND}}', atsChecklist.achievementsFound ? '✔ Yes' : '✘ No')
    .replace('{{CANDIDATE_SKILLS}}', candidateSkills)
    .replace('{{JOB_DESCRIPTION}}', jobDesc);
};
