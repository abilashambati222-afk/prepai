const express = require('express');
const jobDescriptionController = require('../controllers/jobDescriptionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection to all job description management routes
router.use(protect);

router.route('/')
  .post(jobDescriptionController.createJobDescription)
  .get(jobDescriptionController.getMyJobDescriptions);

router.route('/:id')
  .get(jobDescriptionController.getJobDescription)
  .put(jobDescriptionController.updateJobDescription)
  .delete(jobDescriptionController.deleteJobDescription);

module.exports = router;
