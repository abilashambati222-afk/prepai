const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { validateRegister, validateLogin } = require('../validators/authValidator');

const router = express.Router();

// Public Authentication Routes
router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/logout', authController.logout);

// Protected Authentication Route
router.get('/me', protect, authController.me);

// Future Implementation Placeholders (Not implemented)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
