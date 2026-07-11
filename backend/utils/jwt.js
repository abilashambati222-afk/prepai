const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'prepai_super_secret_signing_key_change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT access token for a given user ID payload
 * @param {string} id - The user document ID
 * @returns {string} Signed JWT token
 */
const generateAccessToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT signature and decode payload
 * @param {string} token - The authorization token
 * @returns {object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken
};
