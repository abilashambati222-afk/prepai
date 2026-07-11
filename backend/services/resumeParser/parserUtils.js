/**
 * Split text lines safely and clean whitespace
 * @param {string} text - Raw string
 * @returns {string[]} Trimmed lines array
 */
exports.splitLines = (text) => {
  if (!text) return [];
  return text.split('\n').map(line => line.trim());
};

/**
 * Check if string matches email pattern
 * @param {string} str - Email candidate
 * @returns {boolean} True if email
 */
exports.isEmail = (str) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(str);
};

/**
 * Filter out empty strings from array
 * @param {string[]} arr - Strings array
 * @returns {string[]} Filtered list
 */
exports.cleanArray = (arr) => {
  return arr.filter(item => item && item.length > 0);
};
