// Section header maps matching standard synonyms to uniform key names
const SECTION_MAPPINGS = {
  summary: [
    /^(?:summary|objective|professional summary|profile|about me|career objective)$/i,
    /summary/i,
    /objective/i,
    /profile/i
  ],
  education: [
    /^(?:education|academics|academic background|qualification|educational background|qualifications)$/i,
    /education/i,
    /academic/i,
    /qualification/i
  ],
  skills: [
    /^(?:skills|technical skills|expertise|competencies|skills directory|core competencies|technologies)$/i,
    /skills/i,
    /expertise/i,
    /competency/i,
    /technolog/i
  ],
  experience: [
    /^(?:experience|employment|work history|professional experience|employment history|work experience)$/i,
    /experience/i,
    /employment/i,
    /work history/i
  ],
  projects: [
    /^(?:projects|personal projects|academic projects|key projects|selected projects)$/i,
    /projects/i,
    /project/i
  ],
  certifications: [
    /^(?:certifications|certificates|courses|credentials|training)$/i,
    /certification/i,
    /certificate/i,
    /courses/i
  ],
  languages: [
    /^(?:languages|languages spoken|language proficiency)$/i,
    /languages/i
  ],
  achievements: [
    /^(?:achievements|awards|honors|accomplishments|accolades)$/i,
    /achievement/i,
    /awards/i,
    /honors/i
  ]
};

/**
 * Match a line against section headings
 * @param {string} line - Cleaned text line
 * @returns {string|null} Canonical section category or null
 */
const detectSectionHeader = (line) => {
  const cleanLine = line.trim();
  
  // Headers are typically short: less than 40 chars
  if (cleanLine.length === 0 || cleanLine.length > 40) return null;

  for (const [category, regexes] of Object.entries(SECTION_MAPPINGS)) {
    for (const regex of regexes) {
      if (regex.test(cleanLine)) {
        return category;
      }
    }
  }
  return null;
};

/**
 * Detect and segment resume text by section categories
 * @param {string} text - Normalized text
 * @returns {object} Map of category name to its raw text block
 */
exports.detectSections = (text) => {
  const sections = {
    header: '',
    summary: '',
    education: '',
    skills: '',
    experience: '',
    projects: '',
    certifications: '',
    languages: '',
    achievements: ''
  };

  const lines = text.split('\n');
  let currentSection = 'header';

  for (const line of lines) {
    const sectionName = detectSectionHeader(line);
    
    if (sectionName) {
      currentSection = sectionName;
    } else {
      sections[currentSection] += line + '\n';
    }
  }

  return sections;
};
