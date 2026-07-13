const { generateContentWithRetry } = require('../ai/geminiClient');
const { buildAnswerEvaluationPrompt } = require('../ai/interviewPromptBuilder');
const { parseInterviewResponse } = require('../ai/interviewResponseParser');
const { validateEvaluation } = require('../ai/interviewValidator');

/**
 * Behavioral answer evaluation service (STAR framework)
 */
exports.evaluateBehavioralAnswer = async (question, answerText) => {
  try {
    const prompt = buildAnswerEvaluationPrompt(question, answerText, 'Behavioral Interview');
    const { text } = await generateContentWithRetry(prompt, { temperature: 0.2 });
    const parsed = parseInterviewResponse(text);
    validateEvaluation(parsed);
    
    // Ensure STAR attributes exist in behavioral reviews
    if (!parsed.starEvaluation) {
      parsed.starEvaluation = {
        situation: "Reviewing the scenario mentioned by the user.",
        task: "Assessing details about the task details.",
        action: "Assessing actions described.",
        result: "Analyzing the outcomes achieved."
      };
    }
    return parsed;
  } catch (err) {
    console.error('[Behavioral Evaluator] Evaluation failed:', err);
    return {
      technicalAccuracy: 60,
      communication: 50,
      completeness: 50,
      confidence: 50,
      keywords: 50,
      professionalism: 50,
      grammar: 50,
      explanation: "Evaluation fallback triggered due to processor error.",
      starEvaluation: {
        situation: "Not explicitly detected.",
        task: "Not explicitly detected.",
        action: "Not explicitly detected.",
        result: "Not explicitly detected."
      },
      improvementSuggestions: ["Apply the STAR framework: structure answer around a Situation, Task, Action, and Result."]
    };
  }
};
