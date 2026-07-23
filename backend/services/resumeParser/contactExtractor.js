/**
 * Extract candidate name from top lines of the resume
 * @param {string} text - Cleaned text
 * @returns {string} Extracted name or empty string
 */
const extractName = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return '';
  
  // Scans top 4 non-empty lines for Candidate Name
  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    if (
      !line.includes('@') && 
      !lowerLine.includes('http') && 
      !lowerLine.includes('github') &&
      !lowerLine.includes('linkedin') &&
      !lowerLine.includes('resume') &&
      !lowerLine.includes('cv') &&
      !lowerLine.includes('phone') &&
      !lowerLine.includes('email') &&
      !lowerLine.includes('mobile') &&
      !lowerLine.includes('contact') &&
      !/\d{4,}/.test(line) && // exclude phone numbers or addresses with long digit series
      line.split(' ').length >= 1 && // names can be 1 to 4 words
      line.split(' ').length <= 4
    ) {
      return line;
    }
  }
  return '';
};

/**
 * Extract email addresses from raw text using regex
 * @param {string} text - Cleaned text
 * @returns {string} Extracted email or empty string
 */
const extractEmail = (text) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
};

/**
 * Extract phone numbers from raw text using regex
 * @param {string} text - Cleaned text
 * @returns {string} Extracted phone number or empty string
 */
const extractPhone = (text) => {
  // Support both standard US/international formats and Indian 5-5 split formats (e.g. +91 83099 68940)
  const phoneRegex = /(?:\+?91|0)?[-.\s]?[6-9]\d{4}[-.\s]?\d{5}\b|(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b[6-9]\d{9}\b/;
  const match = text.match(phoneRegex);
  return match ? match[0].trim() : '';
};

/**
 * Extract URLs (GitHub, LinkedIn, Portfolio)
 * @param {string} text - Cleaned text
 * @returns {object} Extracted URLs
 */
const extractLinks = (text) => {
  const links = { github: '', linkedin: '', portfolio: '' };
  
  // Lenient regex to support links written with or without http:// or https://
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

  const gitMatch = text.match(githubRegex);
  if (gitMatch) {
    const url = gitMatch[0];
    links.github = url.startsWith('http') ? url : `https://${url}`;
  }

  const linkMatch = text.match(linkedinRegex);
  if (linkMatch) {
    const url = linkMatch[0];
    links.linkedin = url.startsWith('http') ? url : `https://${url}`;
  }

  const allUrls = text.match(urlRegex) || [];
  const portfolioUrl = allUrls.find(url => 
    !url.toLowerCase().includes('github.com') && 
    !url.toLowerCase().includes('linkedin.com')
  );
  if (portfolioUrl) {
    links.portfolio = portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`;
  }

  return links;
};

/**
 * Extract street/city address lines from the top section of the resume using postcode checks
 * @param {string} text - Cleaned text
 * @returns {string} Extracted address or empty string
 */
const extractAddress = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const zipRegex = /\b\d{5}(?:-\d{4})?\b|\b\d{6}\b/; // Matches 5 or 6 digit codes (US/India zip formats)
  
  // Check the top 10 lines for ZIP code and common city formatting
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (zipRegex.test(line) && !line.includes('@') && !line.includes('http')) {
      return line;
    }
  }
  return '';
};

/**
 * Extract all contact parameters
 * @param {string} text - Cleaned resume text
 * @returns {object} Extracted contact metadata
 */
exports.extractContactInfo = (text) => {
  const links = extractLinks(text);
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    address: extractAddress(text),
    links
  };
};
