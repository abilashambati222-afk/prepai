const express = require('express');
const careerController = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/analyze', careerController.analyzeCareer);
router.get('/', careerController.getCareerData);
router.get('/history', careerController.getCareerHistory);
router.get('/roadmap', careerController.getRoadmap);
router.get('/resources', careerController.getResources);
router.get('/projects', careerController.getProjects);
router.get('/salary', careerController.getSalary);
router.get('/timeline', careerController.getTimeline);

module.exports = router;
