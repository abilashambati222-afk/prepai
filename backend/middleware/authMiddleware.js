const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');

/**
 * Route protection middleware to authenticate users using JWT.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Obtain token from authorization headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Validate token presence
    if (!token) {
      return next(new UnauthorizedError('You are not logged in. Please log in to gain access.'));
    }

    // 3. Verify JWT signature using utility
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      return next(err); // Centralized error handler catches token errors (expiry / signature)
    }

    // 4. Check if the user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new UnauthorizedError('The user belonging to this token no longer exists.')
      );
    }

    // 5. Check if user is active
    if (!currentUser.isActive) {
      return next(
        new UnauthorizedError('This account is currently deactivated. Please contact support.')
      );
    }

    // Grant access to protected route by attaching user to request context
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware wrapper to restrict route access to specific roles.
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action.')
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
