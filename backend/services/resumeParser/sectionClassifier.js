/**
 * Split text block into lists of details line-by-line, stripping bullets
 * @param {string} text - Category raw block
 * @returns {string[]} Formatted text lines
 */
const parseBlockToList = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.replace(/^[\s\-\*•\u2022]+/, '').trim()) // Clean list bullet characters
    .filter(line => line.length > 5); // Filter out empty or very short items
};

/**
 * Split skills block into individual tags
 * @param {string} text - Skills category block
 * @returns {string[]} Array of skill keywords
 */
const parseBlockToTags = (text) => {
  if (!text) return [];
  const dividers = /,|;|\||\n|•/;
  return text
    .split(dividers)
    .map(skill => skill.replace(/[:\-\*]/g, '').trim())
    .filter(skill => skill.length > 1 && skill.length < 50);
};

/**
 * Map raw section blocks into structured JavaScript types
 * @param {object} rawSections - Section name to raw text map
 * @returns {object} Categorized structured fields
 */
exports.classifySections = (rawSections) => {
  return {
    summary: rawSections.summary ? rawSections.summary.trim().replace(/\n+/g, ' ') : '',
    education: parseBlockToList(rawSections.education),
    skills: parseBlockToTags(rawSections.skills),
    projects: parseBlockToList(rawSections.projects),
    experience: parseBlockToList(rawSections.experience),
    certifications: parseBlockToList(rawSections.certifications),
    languages: parseBlockToTags(rawSections.languages),
    achievements: parseBlockToList(rawSections.achievements)
  };
};
