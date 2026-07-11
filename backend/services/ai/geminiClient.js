const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure API key is configured
const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('[Gemini Client] Warning: GEMINI_API_KEY is not defined in environment variables.');
}

/**
 * Call Gemini API with automatic retries on rate limits or transient network errors
 * @param {string} prompt - Ready prompt string
 * @param {object} options - Optional generation configs
 * @returns {Promise<string>} Gemini response text content
 */
exports.generateContentWithRetry = async (prompt, options = {}) => {
  if (!genAI) {
    throw new Error('Google Gemini API client is not initialized. Please configure VITE_GEMINI_API_KEY / GEMINI_API_KEY in environment variables.');
  }

  const modelName = options.model || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  const maxRetries = 3;
  let delay = 1000; // start with 1s delay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const responsePromise = model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json', // Enforces structured JSON from Gemini!
          temperature: options.temperature || 0.2
        }
      });

      // Handle timeouts (e.g. 30 seconds)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API call timed out.')), 30000)
      );

      const result = await Promise.race([responsePromise, timeoutPromise]);
      const text = result.response.text();
      const usageMetadata = result.response.usageMetadata || null;
      return { text, usageMetadata };

    } catch (err) {
      const isRateLimit = err.message?.includes('429') || err.message?.includes('Quota exceeded');
      const isTransient = err.message?.includes('503') || err.message?.includes('Overloaded');

      if ((isRateLimit || isTransient) && attempt < maxRetries) {
        console.warn(`[Gemini Client] Attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw new Error(`Google Gemini API execution failed after ${attempt} attempts: ${err.message}`);
      }
    }
  }
};
