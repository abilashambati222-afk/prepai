const technicalEvaluator = require('./technicalEvaluator');
const hrEvaluator = require('./hrEvaluator');
const behavioralEvaluator = require('./behavioralEvaluator');
const codingEvaluator = require('./codingEvaluator');
const communicationEvaluator = require('./communicationEvaluator');
const scoreCalculator = require('./scoreCalculator');

/**
 * Primary coordinator for question and answer scoring.
 * Compiles AI evaluations and runs deterministic score calculations.
 */
exports.evaluateAnswer = async (interviewType, question, answerText) => {
  // 1. Core Q&A assessment based on interview type
  let coreFeedback = {};
  
  const typeNorm = (interviewType || '').toLowerCase();
  
  if (typeNorm.includes('hr')) {
    coreFeedback = await hrEvaluator.evaluateHRAnswer(question, answerText);
  } else if (typeNorm.includes('behavioral')) {
    coreFeedback = await behavioralEvaluator.evaluateBehavioralAnswer(question, answerText);
  } else if (typeNorm.includes('coding')) {
    coreFeedback = await codingEvaluator.evaluateCodingAnswer(question, answerText);
  } else {
    // Technical, Resume Based, Project Based, Managerial
    coreFeedback = await technicalEvaluator.evaluateTechnicalAnswer(question, answerText);
  }

  // 2. Perform detailed communication evaluation
  const commFeedback = await communicationEvaluator.evaluateCommunication(question.questionText, answerText);

  // 3. Merge results
  // Communication-specific fields override or average out the sub-scores
  const feedback = {
    ...coreFeedback,
    grammar: commFeedback.grammar || coreFeedback.grammar || 60,
    confidence: commFeedback.confidence || coreFeedback.confidence || 60,
    communication: commFeedback.fluency || commFeedback.clarity || coreFeedback.communication || 60,
    professionalism: commFeedback.professionalism || coreFeedback.professionalism || 60
  };

  // 4. Calculate backend deterministic score
  const finalScore = scoreCalculator.calculateAnswerScore(feedback);
  feedback.score = finalScore;

  return feedback;
};
