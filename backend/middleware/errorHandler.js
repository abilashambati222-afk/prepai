const AppError = require('../errors/AppError');

/**
 * Centralized Express Error Handler Middleware
 * Updated to match standardized response schemas:
 * { "success": false, "message": "...", "errors": [...] }
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  let validationErrors = [];

  // 1. Mongoose Bad ObjectId CastError
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    validationErrors.push({ field: err.path, message: `Invalid identifier format: ${err.value}` });
  }

  // 2. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    error = new AppError('Email address is already registered.', 400);
    validationErrors.push({ field, message: `The email "${value}" is already registered. Please choose another.` });
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    error = new AppError('Data validation failed.', 400);
    validationErrors = Object.entries(err.errors).map(([field, detail]) => ({
      field,
      message: detail.message
    }));
  }

  // 4. JWT Web Token Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid credentials. Please login again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your session has expired. Please login again.', 401);
  }

  // Send Response based on environment context
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: validationErrors.length > 0 ? validationErrors : [{ message: err.message }],
      stack: err.stack
    });
  } else {
    const finalError = error.isOperational ? error : new AppError(err.message || 'Internal Server Error', 500);
    res.status(finalError.statusCode).json({
      success: false,
      message: finalError.message,
      errors: validationErrors.length > 0 ? validationErrors : [{ message: err.message }]
    });
  }
};

module.exports = errorHandler;
