const express = require('express');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce authentication on all interview APIs
router.use(protect);

// Interview Lifecycle Routes
router.post('/start', interviewController.startInterview);
router.post('/answer', interviewController.submitAnswer);
router.post('/end', interviewController.endInterview);

// Details & Log Queries
router.get('/history', interviewController.getHistory);
router.get('/analytics', interviewController.getAnalytics);
router.get('/readiness', interviewController.getCompanyReadiness);
router.get('/session/:id', interviewController.getSessionDetails);
router.get('/report/:id', interviewController.getReport);
router.get('/:id/transcript', interviewController.getTranscript);

// Pattern Generation Metadata
router.post('/generate', interviewController.generateCompanyTrack);

// Specific Track Shorthands
router.post('/hr', interviewController.startHRInterview);
router.post('/coding', interviewController.startCodingInterview);
router.post('/behavioral', interviewController.startBehavioralInterview);

module.exports = router;
