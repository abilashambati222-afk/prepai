/**
 * Calculate parser confidence dynamically based on detected sections
 * @param {object} parsedData - Structured JSON fields
 * @returns {number} Confidence percentage (0-100)
 */
exports.calculateConfidence = (parsedData) => {
  let confidence = 0;

  // 1. Personal Information found (+20)
  const personal = parsedData.personalInformation || {};
  if (personal.name && (personal.email || personal.phone)) {
    confidence += 20;
  }

  // 2. Education found (+20)
  if (parsedData.education && parsedData.education.length > 0) {
    confidence += 20;
  }

  // 3. Skills found (+20)
  if (parsedData.skills && parsedData.skills.length > 0) {
    confidence += 20;
  }

  // 4. Experience found (+20)
  if (parsedData.experience && parsedData.experience.length > 0) {
    confidence += 20;
  }

  // 5. Projects found (+20)
  if (parsedData.projects && parsedData.projects.length > 0) {
    confidence += 20;
  }

  return confidence;
};
