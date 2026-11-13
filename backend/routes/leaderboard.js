const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [leaderboard] = await db.query(`
      SELECT 
        s.name, 
        s.institution, 
        qa.score, 
        qa.time_taken,
        qa.submitted_at
      FROM quiz_attempts qa
      JOIN students s ON qa.student_id = s.id
      ORDER BY qa.score DESC, qa.time_taken ASC
      LIMIT 10
    `);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;