const REQUIRED_FIELDS = [
  'resumeSummary',
  'strengths',
  'weaknesses',
  'missingSkills',
  'recommendedTechnologies',
  'recommendedCertifications',
  'careerRecommendations',
  'improvementSuggestions',
  'atsAnalysis',
  'overallFeedback',
  'confidence'
];

/**
 * Validate that all required audit attributes exist inside the AI analysis response
 * @param {object} data - Decoded JSON response
 * @throws {Error} If fields are missing or have incorrect types
 */
exports.validateAnalysisResult = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('AI analysis result is empty or not an object.');
  }

  const missingFields = [];
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(`AI response validation failed. Missing mandatory fields: ${missingFields.join(', ')}`);
  }

  // Type checks
  if (typeof data.resumeSummary !== 'string') throw new Error('Field "resumeSummary" must be a string.');
  if (typeof data.overallFeedback !== 'string') throw new Error('Field "overallFeedback" must be a string.');
  if (typeof data.confidence !== 'number') throw new Error('Field "confidence" must be a number.');
  if (typeof data.atsAnalysis !== 'object') throw new Error('Field "atsAnalysis" must be an object.');

  const arraysToCheck = [
    'strengths',
    'weaknesses',
    'missingSkills',
    'recommendedTechnologies',
    'recommendedCertifications',
    'careerRecommendations',
    'improvementSuggestions'
  ];

  for (const arrField of arraysToCheck) {
    if (!Array.isArray(data[arrField])) {
      throw new Error(`Field "${arrField}" must be an array.`);
    }
  }
};
