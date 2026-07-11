/**
 * Standardize and parse JSON strings returned by Gemini
 * @param {string} rawResponse - Text response from API call
 * @returns {object} Decoded JSON object
 */
exports.parseAiResponse = (rawResponse) => {
  if (!rawResponse) {
    throw new Error('Received empty response from Gemini API.');
  }

  let cleaned = rawResponse.trim();

  // Strip markdown code fences if present (e.g. ```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, ''); // strip starting fence
    cleaned = cleaned.replace(/\n```$/, ''); // strip ending fence
    cleaned = cleaned.trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to decode Gemini JSON response. Raw output: ${rawResponse.substring(0, 150)}... Error: ${err.message}`);
  }
};
