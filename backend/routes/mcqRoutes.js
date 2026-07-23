const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const mcqController = require('../controllers/mcqController');

const router = express.Router();

// All MCQ routes require user authentication
router.use(protect);

// Dashboard
router.get('/dashboard', mcqController.getDashboard);

// Categories/Topics listing
router.get('/categories', mcqController.getCategories);
router.get('/topics', mcqController.getCategories); // Alias compatibility

// Question Retrieval
router.get('/questions', mcqController.getQuestions);
router.get('/question/:id', mcqController.getQuestionById);

// Quiz/Test Orchestration
router.post('/start-test', mcqController.startTest);
router.post('/submit', mcqController.submitTest);

// Bookmarks (supports POST /bookmark, DELETE /bookmark/:id, and legacy POST /bookmark/:questionId, GET /bookmarks)
router.post('/bookmark', mcqController.addBookmark);
router.delete('/bookmark/:id', mcqController.deleteBookmark);
router.post('/bookmark/:questionId', mcqController.toggleBookmark); // Legacy toggle
router.get('/bookmarks', mcqController.getBookmarks); // Legacy list

// History, Stats, Recommendations, and Leaderboard
router.get('/history', mcqController.getQuizHistory);
router.get('/stats', mcqController.getMcqStats);
router.get('/recommendations', mcqController.getRecommendations);
router.get('/leaderboard', mcqController.getLeaderboard);

// AI Explanations
router.get('/explain/:questionId', mcqController.getAiExplanation);

module.exports = router;
