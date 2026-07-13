const { generateContentWithRetry } = require('../ai/geminiClient');
const { buildAnswerEvaluationPrompt } = require('../ai/interviewPromptBuilder');
const { parseInterviewResponse } = require('../ai/interviewResponseParser');
const { validateEvaluation } = require('../ai/interviewValidator');

/**
 * HR answer evaluation service
 */
exports.evaluateHRAnswer = async (question, answerText) => {
  try {
    const prompt = buildAnswerEvaluationPrompt(question, answerText, 'HR Interview');
    const { text } = await generateContentWithRetry(prompt, { temperature: 0.2 });
    const parsed = parseInterviewResponse(text);
    validateEvaluation(parsed);
    return parsed;
  } catch (err) {
    console.error('[HR Evaluator] Evaluation failed:', err);
    return {
      technicalAccuracy: 60,
      communication: 50,
      completeness: 50,
      confidence: 50,
      keywords: 50,
      professionalism: 50,
      grammar: 50,
      explanation: "Evaluation fallback triggered due to processor error.",
      improvementSuggestions: ["Focus on explaining your motivations and achievements."]
    };
  }
};
