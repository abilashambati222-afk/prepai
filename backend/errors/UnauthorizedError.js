const AppError = require('./AppError');

/**
 * 401 Unauthorized Error
 */
class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access. Please login.') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;
