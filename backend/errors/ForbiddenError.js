const AppError = require('./AppError');

/**
 * 403 Forbidden Error
 */
class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden. Insufficient permissions.') {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
