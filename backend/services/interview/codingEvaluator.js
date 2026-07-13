const { generateContentWithRetry } = require('../ai/geminiClient');
const { buildAnswerEvaluationPrompt } = require('../ai/interviewPromptBuilder');
const { parseInterviewResponse } = require('../ai/interviewResponseParser');
const { validateEvaluation } = require('../ai/interviewValidator');

/**
 * Coding answer evaluation service
 */
exports.evaluateCodingAnswer = async (question, answerText) => {
  try {
    const prompt = buildAnswerEvaluationPrompt(question, answerText, 'Coding Interview');
    const { text } = await generateContentWithRetry(prompt, { temperature: 0.2 });
    const parsed = parseInterviewResponse(text);
    validateEvaluation(parsed);
    return parsed;
  } catch (err) {
    console.error('[Coding Evaluator] Evaluation failed:', err);
    return {
      technicalAccuracy: 40,
      communication: 50,
      completeness: 40,
      confidence: 50,
      keywords: 40,
      professionalism: 50,
      grammar: 50,
      explanation: "Evaluation fallback triggered. The system experienced issues analyzing your solution.",
      improvementSuggestions: ["Review standard data structures and algorithmic complexity."]
    };
  }
};
