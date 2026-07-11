/**
 * Consolidate segments to build structured JSON output
 * @param {object} contacts - Extracted personal info and online links
 * @param {object} classified - Categorized sections details
 * @param {object} metadata - Custom parse execution logs/metrics
 * @returns {object} Final unified structured JSON resume object
 */
exports.buildJson = (contacts, classified, metadata = {}) => {
  return {
    metadata,
    personalInformation: {
      name: contacts.name,
      email: contacts.email,
      phone: contacts.phone,
      address: contacts.address
    },
    summary: classified.summary,
    education: classified.education,
    skills: classified.skills,
    projects: classified.projects,
    experience: classified.experience,
    certifications: classified.certifications,
    languages: classified.languages,
    achievements: classified.achievements,
    links: contacts.links
  };
};
