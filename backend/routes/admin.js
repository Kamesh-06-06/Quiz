const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', adminController.loginAdmin);
router.get('/stats', verifyAdmin, adminController.getStats);
router.post('/questions', verifyAdmin, adminController.addQuestion);
router.get('/students', verifyAdmin, adminController.getStudents);
router.get('/results', verifyAdmin, adminController.getResults);

module.exports = router;