/**
 * Standardize and parse JSON responses from Gemini for the Interview Module
 */
const { parseAiResponse } = require('./responseParser');

exports.parseInterviewResponse = (rawResponse) => {
  return parseAiResponse(rawResponse);
};
