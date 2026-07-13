const { generateContentWithRetry } = require('../ai/geminiClient');
const { parseInterviewResponse } = require('../ai/interviewResponseParser');

/**
 * Communication fluency and presentation assessment
 */
exports.evaluateCommunication = async (questionText, answerText) => {
  try {
    const prompt = `
    Analyze the communication quality of the candidate's answer.
    
    QUESTION:
    "${questionText}"

    CANDIDATE'S ANSWER:
    "${answerText}"

    Provide ratings from 0 to 100 for the following areas:
    - grammar: Subject-verb agreement, tenses, sentence structure.
    - confidence: Assertive vocabulary, absence of hesitation phrases.
    - clarity: Directness and ease of comprehension.
    - professionalism: Formal structure and tone.
    - vocabulary: Appropriateness of domain terms and terminology.
    - fluency: Logical flow and transition between ideas.

    Return ONLY a structured JSON object matching this schema:
    {
      "grammar": 80,
      "confidence": 75,
      "clarity": 85,
      "professionalism": 90,
      "vocabulary": 80,
      "fluency": 85,
      "explanation": "Provide a brief description of the candidate's communication style, highlighting points of articulation and fields for improvement."
    }
    `;

    const { text } = await generateContentWithRetry(prompt, { temperature: 0.2 });
    return parseInterviewResponse(text);
  } catch (err) {
    console.error('[Communication Evaluator] Analysis failed:', err);
    return {
      grammar: 60,
      confidence: 60,
      clarity: 60,
      professionalism: 60,
      vocabulary: 60,
      fluency: 60,
      explanation: "Fluency fallback active."
    };
  }
};
