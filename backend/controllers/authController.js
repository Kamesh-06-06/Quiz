const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, phone, institution, department, password } = req.body;

    const [existing] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO students (name, email, phone, institution, department, password) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, institution, department, hashedPassword]
    );

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [students] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    
    if (students.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const student = students[0];
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: student.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '4h' });
    
    res.json({ token, student: { id: student.id, name: student.name, email: student.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};