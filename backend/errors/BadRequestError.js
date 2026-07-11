const AppError = require('./AppError');

/**
 * 400 Bad Request Error
 */
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

module.exports = BadRequestError;
