const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const codingController = require('../controllers/codingController');

const router = express.Router();

// Apply auth protection to all coding practice endpoints
router.use(protect);

router.get('/problems', codingController.getProblems);
router.get('/problems/:slug', codingController.getProblemBySlug);
router.post('/run', codingController.runCode);
router.post('/submit', codingController.submitSolution);
router.get('/history', codingController.getSubmissionsHistory);
router.get('/stats', codingController.getCodingStats);
router.post('/bookmark', codingController.addBookmark);
router.delete('/bookmark/:id', codingController.deleteBookmark);
router.post('/notes', codingController.saveNotes);

module.exports = router;
