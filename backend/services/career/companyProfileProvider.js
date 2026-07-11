const fs = require('fs');
const path = require('path');

const PROFILES_DIR = path.join(__dirname, '..', '..', 'data', 'companyProfiles');

/**
 * Loads all company profiles from JSON files in the dataset folder.
 */
exports.getCompanyProfiles = () => {
  const profiles = [];
  try {
    if (!fs.existsSync(PROFILES_DIR)) {
      console.warn(`[Company Profile Provider] Directory not found: ${PROFILES_DIR}`);
      return [];
    }
    const files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.json'));
    files.forEach(file => {
      try {
        const filePath = path.join(PROFILES_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        profiles.push(data);
      } catch (err) {
        console.error(`[Company Profile Provider] Failed to parse file: ${file}`, err);
      }
    });
  } catch (err) {
    console.error('[Company Profile Provider] Failed to read profiles directory:', err);
  }
  return profiles;
};

/**
 * Retrieves a single company profile by company name.
 */
exports.getCompanyProfileByName = (companyName) => {
  try {
    const filename = `${companyName.toLowerCase().replace(/\s+/g, '_')}.json`;
    const filePath = path.join(PROFILES_DIR, filename);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`[Company Profile Provider] Failed to retrieve profile for ${companyName}:`, err);
  }
  return null;
};
