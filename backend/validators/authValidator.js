/**
 * Authentication Input Validators
 * Custom validation helper rules for registering and logging in.
 */

/**
 * Validate Register Request Body
 * @param {object} body - Request body
 * @returns {array} Array of error objects containing field and message keys
 */
const validateRegister = (body) => {
  const errors = [];
  const { fullName, email, password } = body;

  // 1. Full Name Validation
  if (!fullName || fullName.trim() === '') {
    errors.push({ field: 'fullName', message: 'Full name is required.' });
  } else if (fullName.length > 100) {
    errors.push({ field: 'fullName', message: 'Full name cannot exceed 100 characters.' });
  }

  // 2. Email Validation
  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email address is required.' });
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
  }

  // 3. Password Strength Validation
  if (!password || password === '') {
    errors.push({ field: 'password', message: 'Password is required.' });
  } else {
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long.' });
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUppercase) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter.' });
    }
    if (!hasLowercase) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter.' });
    }
    if (!hasNumber) {
      errors.push({ field: 'password', message: 'Password must contain at least one number.' });
    }
  }

  return errors;
};

/**
 * Validate Login Request Body
 * @param {object} body - Request body
 * @returns {array} Array of error objects containing field and message keys
 */
const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  // 1. Email Validation
  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email address is required.' });
  }

  // 2. Password Validation
  if (!password || password === '') {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin
};
