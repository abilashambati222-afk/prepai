const User = require('../models/User');
const { generateAccessToken } = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Explicit email uniqueness check to prevent duplicates before creation
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError('Email address is already in use.'));
    }

    // 2. Create user document record (Pre-save hook handles hashing)
    const newUser = await User.create({
      fullName,
      email,
      password,
      lastLogin: new Date()
    });

    // 3. Issue Access Token
    const token = generateAccessToken(newUser._id);

    // Exclude password from return payload
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        token,
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log in existing user
 * POST /api/v1/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Locate user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new UnauthorizedError('Incorrect email or password.'));
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new UnauthorizedError('This account is currently deactivated.'));
    }

    // Compare hashed passwords
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      return next(new UnauthorizedError('Incorrect email or password.'));
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT access token
    const token = generateAccessToken(user._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log out user session
 * POST /api/v1/auth/logout
 */
exports.logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
    data: {}
  });
};

/**
 * Get current logged in user details
 * GET /api/v1/auth/me
 */
exports.me = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Current user profile retrieved successfully.',
    data: {
      user: req.user
    }
  });
};

/**
 * Forgot Password - Placeholder (Not implemented)
 * POST /api/v1/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Forgot Password route is not implemented in this phase.',
    errors: [{ message: 'Feature not implemented.' }]
  });
};

/**
 * Reset Password - Placeholder (Not implemented)
 * POST /api/v1/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Reset Password route is not implemented in this phase.',
    errors: [{ message: 'Feature not implemented.' }]
  });
};

/**
 * Email Verification - Placeholder (Not implemented)
 * GET /api/v1/auth/verify-email
 */
exports.verifyEmail = async (req, res, next) => {
  res.status(501).json({
    success: false,
    message: 'Email Verification route is not implemented in this phase.',
    errors: [{ message: 'Feature not implemented.' }]
  });
};
