/**
 * Normalize extracted PDF text
 * @param {string} text - Raw text from PDF reader
 * @returns {string} Cleaned, uniform text string
 */
exports.normalizeText = (text) => {
  if (!text) return '';

  return text
    // 1. Normalize line endings to LF
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // 2. Normalize bullet points to simple bullets (•)
    .replace(/[\u2022\u2023\u2043\u204F\u2219\u25CB\u25CF\u25D8\u25E6\u261E\u27A2\u27B2\u27BE\u2012\u2013\u2014\u2015\-]/g, ' • ')
    
    // 3. Normalize smart quotes, ellipses, non-breaking spaces, and unicode symbols
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ') // replace NBSP with regular space
    
    // 4. Collapse duplicate horizontal spacing
    .replace(/[ \t]+/g, ' ')
    
    // 5. Collapse duplicate vertical spacing (limit block gaps to 2 newlines)
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
};
