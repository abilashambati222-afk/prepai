const express = require('express');
const multer = require('multer');
const path = require('path');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.fieldname === 'thumbnail' ? '.jpg' : '.webm';
    cb(null, `evidence-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });
const router = express.Router();

// Enforce authentication on all interview APIs
router.use(protect);

// Interview Lifecycle Routes
router.post('/start', interviewController.startInterview);
router.post('/answer', interviewController.submitAnswer);
router.post('/end', interviewController.endInterview);

// AI Proctoring Integrity Routes
router.post('/event', interviewController.logProctorEvent);
router.post('/warning', interviewController.logProctorWarning);
router.post('/evidence', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), interviewController.uploadProctorEvidence);

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
