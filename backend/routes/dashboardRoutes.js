const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply route protection to all dashboard endpoints
router.use(protect);

router.get('/', dashboardController.getDashboardData);

module.exports = router;
