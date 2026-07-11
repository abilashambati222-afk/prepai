/**
 * Parse string lists into cleaned tags
 * @param {string[]} list - Raw strings
 * @returns {string[]} Trimmed lists
 */
exports.cleanTagList = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .map(item => item?.trim())
    .filter(item => item && item.length > 0);
};
