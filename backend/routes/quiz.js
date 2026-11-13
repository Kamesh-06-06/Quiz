const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/auth');

router.get('/quizzes', verifyToken, quizController.getQuizzes);
router.get('/quizzes/:id', verifyToken, quizController.getQuizById);
router.get('/quizzes/:id/questions', verifyToken, quizController.getQuizQuestions);
router.get('/quizzes/:id/attempt', verifyToken, quizController.checkAttempt);
router.post('/submit', verifyToken, quizController.submitQuiz);

module.exports = router;