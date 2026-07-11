const express = require('express');
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply route protection to all profile endpoints
router.use(protect);

router.route('/')
  .get(profileController.getProfile)
  .put(profileController.updateProfile);

router.get('/completion', profileController.getProfileCompletion);

module.exports = router;
