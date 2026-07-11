/**
 * Prompt template placeholder for ATS score and keyword matching
 */
exports.ATS_ANALYSIS_TEMPLATE = `
You are an ATS (Applicant Tracking System) optimizer.
Compare the parsed resume details against the specified job description to calculate score matches.
Resume Data: {{PARSED_DATA}}
Job Description: {{JOB_DESCRIPTION}}
`;
