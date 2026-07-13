const { generateContentWithRetry } = require('../ai/geminiClient');
const { buildQuestionGenerationPrompt } = require('../ai/interviewPromptBuilder');
const { parseInterviewResponse } = require('../ai/interviewResponseParser');
const { validateQuestions } = require('../ai/interviewValidator');
const { FALLBACK_QUESTIONS, CODING_PROBLEMS } = require('./interviewRules');

/**
 * Question Generator Service
 */
exports.generateQuestions = async (user, params) => {
  const { interviewType, difficulty, count = 5 } = params;

  try {
    const prompt = buildQuestionGenerationPrompt(user, params);
    
    // In coding interviews we can load presets or ask Gemini for fresh ones
    if (interviewType === 'Coding Interview') {
      // Return predefined list for reliability or use AI. Let's try AI first but fall back immediately.
      try {
        const { text } = await generateContentWithRetry(prompt, { temperature: 0.3 });
        const parsed = parseInterviewResponse(text);
        validateQuestions(parsed);
        return parsed.slice(0, count);
      } catch (innerErr) {
        console.warn('[Interview Generator] Coding AI generation failed, using static coding set:', innerErr.message);
        return CODING_PROBLEMS.slice(0, count);
      }
    }

    // Call Gemini with retry
    const { text } = await generateContentWithRetry(prompt, { temperature: 0.3 });
    const parsed = parseInterviewResponse(text);
    validateQuestions(parsed);
    return parsed.slice(0, count);

  } catch (err) {
    console.error('[Interview Generator] Question generation failed, using fallback questions:', err);
    
    // Format fallback questions to match standard question schema
    const fallbacks = FALLBACK_QUESTIONS[interviewType] || FALLBACK_QUESTIONS['Technical Interview'];
    return fallbacks.slice(0, count).map((text, idx) => ({
      questionText: text,
      type: interviewType.toLowerCase().replace(' interview', ''),
      category: 'Core Concepts'
    }));
  }
};
