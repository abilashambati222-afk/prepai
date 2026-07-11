const AppError = require('./AppError');

/**
 * 404 Not Found Error
 */
class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found.') {
    super(message, 404);
  }
}

module.exports = NotFoundError;
