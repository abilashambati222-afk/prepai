const { SCORING_WEIGHTS } = require('./interviewRules');

/**
 * Calculates a single deterministic score based on the sub-metric ratings
 * @param {object} feedback - Individual metric ratings (0-100)
 * @returns {number} Weighted final score (rounded)
 */
exports.calculateAnswerScore = (feedback) => {
  if (!feedback) return 0;
  
  let score = 0;
  score += (Number(feedback.technicalAccuracy) || 0) * SCORING_WEIGHTS.technicalAccuracy;
  score += (Number(feedback.communication) || 0) * SCORING_WEIGHTS.communication;
  score += (Number(feedback.completeness) || 0) * SCORING_WEIGHTS.completeness;
  score += (Number(feedback.confidence) || 0) * SCORING_WEIGHTS.confidence;
  score += (Number(feedback.keywords) || 0) * SCORING_WEIGHTS.keywords;
  score += (Number(feedback.professionalism) || 0) * SCORING_WEIGHTS.professionalism;
  score += (Number(feedback.grammar) || 0) * SCORING_WEIGHTS.grammar;
  
  return Math.min(Math.round(score), 100);
};

/**
 * Calculates aggregate scores across multiple questions in an interview session
 * @param {Array} questions - Questions list containing answers and feedbacks
 * @returns {object} Aggregated scores
 */
exports.calculateSessionAnalytics = (questions) => {
  const answered = questions.filter(q => q.answer && q.answer.answerText);
  if (answered.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      hrScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      behaviorScore: 0,
      codingScore: 0,
      averageAnswerScore: 0
    };
  }

  let totalScore = 0;
  let totalTechAccuracy = 0;
  let totalComm = 0;
  let totalCompleteness = 0;
  let totalConfidence = 0;
  let totalKeywords = 0;
  let totalProf = 0;
  let totalGrammar = 0;

  let hrCount = 0;
  let techCount = 0;
  let codingCount = 0;
  let behaviorCount = 0;

  let hrSum = 0;
  let techSum = 0;
  let codingSum = 0;
  let behaviorSum = 0;

  answered.forEach(q => {
    const f = q.feedback || {};
    const qScore = f.score || 0;
    totalScore += qScore;
    
    totalTechAccuracy += f.technicalAccuracy || 0;
    totalComm += f.communication || 0;
    totalCompleteness += f.completeness || 0;
    totalConfidence += f.confidence || 0;
    totalKeywords += f.keywordsScore || f.keywords || 0; // handle keywords as raw score
    totalProf += f.professionalism || 0;
    totalGrammar += f.grammar || 0;

    const qType = q.type ? q.type.toLowerCase() : 'technical';
    if (qType === 'hr') {
      hrCount++;
      hrSum += qScore;
    } else if (qType === 'coding') {
      codingCount++;
      codingSum += qScore;
    } else if (qType === 'behavioral') {
      behaviorCount++;
      behaviorSum += qScore;
    } else {
      techCount++;
      techSum += qScore;
    }
  });

  const count = answered.length;
  const averageAnswerScore = Math.round(totalScore / count);

  return {
    overallScore: averageAnswerScore,
    technicalScore: techCount > 0 ? Math.round(techSum / techCount) : averageAnswerScore,
    hrScore: hrCount > 0 ? Math.round(hrSum / hrCount) : averageAnswerScore,
    communicationScore: Math.round(totalComm / count),
    confidenceScore: Math.round(totalConfidence / count),
    behaviorScore: behaviorCount > 0 ? Math.round(behaviorSum / behaviorCount) : averageAnswerScore,
    codingScore: codingCount > 0 ? Math.round(codingSum / codingCount) : averageAnswerScore,
    averageAnswerScore: averageAnswerScore
  };
};
