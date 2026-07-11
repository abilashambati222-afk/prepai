/**
 * Profile Modification Input Validators
 * Custom validation helper rules for user onboarding and profile updates.
 */

/**
 * Validate Profile Update Request Body
 * @param {object} body - Request body
 * @param {object} currentUser - Logged in user details for read-only comparisons
 * @returns {array} Array of error objects containing field and message keys
 */
const validateProfileUpdate = (body, currentUser) => {
  const errors = [];
  const { 
    email,
    phone, 
    graduationYear, 
    cgpa, 
    github, 
    linkedin, 
    portfolio, 
    preferredDifficulty,
    experienceLevel
  } = body;

  // 1. Email is Read-Only
  if (email && email.toLowerCase().trim() !== currentUser.email.toLowerCase().trim()) {
    errors.push({ field: 'email', message: 'Email address is read-only and cannot be changed.' });
  }

  // 2. Phone validation (Optional, 10-15 digits format if provided)
  if (phone && phone.trim() !== '') {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.trim())) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number (10 to 15 digits).' });
    }
  }

  // 3. Graduation Year validation (Optional, between 1980 and 2040 if provided)
  if (graduationYear !== undefined && graduationYear !== null && graduationYear !== '') {
    const year = Number(graduationYear);
    if (isNaN(year) || !Number.isInteger(year) || year < 1980 || year > 2040) {
      errors.push({ field: 'graduationYear', message: 'Graduation year must be a valid integer between 1980 and 2040.' });
    }
  }

  // 4. CGPA validation (Optional, between 0 and 10 if provided)
  if (cgpa !== undefined && cgpa !== null && cgpa !== '') {
    const score = Number(cgpa);
    if (isNaN(score) || score < 0 || score > 10) {
      errors.push({ field: 'cgpa', message: 'CGPA must be a valid number between 0.0 and 10.0.' });
    }
  }

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // 5. GitHub URL validation (Optional, must include github.com if provided)
  if (github && github.trim() !== '') {
    if (!isValidUrl(github) || !github.toLowerCase().includes('github.com')) {
      errors.push({ field: 'github', message: 'Please provide a valid GitHub profile URL (e.g. https://github.com/username).' });
    }
  }

  // 6. LinkedIn URL validation (Optional, must include linkedin.com if provided)
  if (linkedin && linkedin.trim() !== '') {
    if (!isValidUrl(linkedin) || !linkedin.toLowerCase().includes('linkedin.com')) {
      errors.push({ field: 'linkedin', message: 'Please provide a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username).' });
    }
  }

  // 7. Portfolio URL validation (Optional, must be valid URL if provided)
  if (portfolio && portfolio.trim() !== '') {
    if (!isValidUrl(portfolio)) {
      errors.push({ field: 'portfolio', message: 'Please provide a valid portfolio website URL.' });
    }
  }

  // 8. Experience Level validation (Optional, enum check if provided)
  if (experienceLevel && !['Student', 'Fresher', 'Experienced'].includes(experienceLevel)) {
    errors.push({ field: 'experienceLevel', message: 'Experience level must be Student, Fresher, or Experienced.' });
  }

  // 9. Difficulty validation (Optional, enum check if provided)
  if (preferredDifficulty && !['Easy', 'Medium', 'Hard'].includes(preferredDifficulty)) {
    errors.push({ field: 'preferredDifficulty', message: 'Preferred difficulty must be Easy, Medium, or Hard.' });
  }

  return errors;
};

module.exports = {
  validateProfileUpdate
};
