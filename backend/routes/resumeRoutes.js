const express = require('express');
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

const aiController = require('../controllers/aiController');

// Apply auth protection to all resume management routes
router.use(protect);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.put('/replace', upload.single('resume'), resumeController.uploadResume);

router.route('/')
  .get(resumeController.getResume)
  .delete(resumeController.deleteResume);

// Parsing Engine API Endpoints
router.post('/parse', resumeController.parseResume);
router.get('/parsed', resumeController.getParsedData);
router.get('/status', resumeController.getParsingStatus);
router.get('/compare', resumeController.compareResumes);

// AI Resume Analysis Endpoints
router.post('/analyze', aiController.analyzeResume);
router.get('/analysis', aiController.getAnalysisData);
router.get('/analysis/status', aiController.getAnalysisStatus);

module.exports = router;
