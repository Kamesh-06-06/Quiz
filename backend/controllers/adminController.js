const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (admins.length === 0) return res.status(400).json({ message: 'Invalid credentials.' });
    
    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [students] = await db.query('SELECT COUNT(*) as total FROM students');
    const [quizzes] = await db.query('SELECT COUNT(*) as total FROM quizzes');
    const [questions] = await db.query('SELECT COUNT(*) as total FROM questions');
    const [attempts] = await db.query('SELECT COUNT(*) as total, MAX(score) as highest FROM quiz_attempts');

    res.json({
      students: students[0].total,
      quizzes: quizzes[0].total,
      questions: questions[0].total,
      submissions: attempts[0].total,
      highestScore: attempts[0].highest || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { quiz_id, question, option_a, option_b, option_c, option_d, correct_answer } = req.body;
    await db.query(
      'INSERT INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [quiz_id, question, option_a, option_b, option_c, option_d, correct_answer]
    );
    res.status(201).json({ message: 'Question added' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding question' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const [students] = await db.query('SELECT id, name, email, institution, created_at FROM students');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT qa.*, s.name as student_name, q.title as quiz_title
      FROM quiz_attempts qa
      JOIN students s ON qa.student_id = s.id
      JOIN quizzes q ON qa.quiz_id = q.id
      ORDER BY qa.submitted_at DESC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching results' });
  }
};