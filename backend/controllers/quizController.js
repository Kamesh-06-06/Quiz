const db = require('../config/db');

exports.getQuizzes = async (req, res) => {
  try {
    const [quizzes] = await db.query('SELECT * FROM quizzes');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes' });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const [quizzes] = await db.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
    if (quizzes.length === 0) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quizzes[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};

exports.getQuizQuestions = async (req, res) => {
  try {
    const [questions] = await db.query('SELECT id, quiz_id, question, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?', [req.params.id]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

exports.checkAttempt = async (req, res) => {
  try {
    const studentId = req.user.id;
    const quizId = req.params.id;
    const [attempts] = await db.query('SELECT * FROM quiz_attempts WHERE student_id = ? AND quiz_id = ?', [studentId, quizId]);
    
    if (attempts.length > 0) {
      return res.json({ hasAttempted: true, result: attempts[0] });
    }
    res.json({ hasAttempted: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking attempt status' });
  }
};

exports.submitQuiz = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { studentId, quizId, answers, timeTaken } = req.body;

    if (!studentId || !quizId || !answers || !timeTaken) {
      return res.status(400).json({ message: 'Missing required submission data' });
    }

    await connection.beginTransaction();

    // Check for existing attempt
    const [existingAttempt] = await connection.query('SELECT id FROM quiz_attempts WHERE student_id = ? AND quiz_id = ?', [studentId, quizId]);
    if (existingAttempt.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'You have already submitted this quiz.' });
    }

    const [questions] = await connection.query('SELECT id, correct_answer FROM questions WHERE quiz_id = ?', [quizId]);
    
    let score = 0;
    let correct_answers = 0;
    let wrong_answers = 0;
    const total_questions = questions.length;

    const answerRecords = [];

    questions.forEach(q => {
      const studentAnswer = answers[q.id];
      let isCorrect = false;
      if (studentAnswer === q.correct_answer) {
        score += 1;
        correct_answers += 1;
        isCorrect = true;
      } else {
        wrong_answers += 1;
      }
      answerRecords.push({ question_id: q.id, selected: studentAnswer || null, isCorrect });
    });

    const [attemptResult] = await connection.query(
      'INSERT INTO quiz_attempts (student_id, quiz_id, score, total_questions, correct_answers, wrong_answers, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [studentId, quizId, score, total_questions, correct_answers, wrong_answers, timeTaken]
    );
    const attemptId = attemptResult.insertId;

    for (let record of answerRecords) {
      await connection.query(
        'INSERT INTO answers (attempt_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)',
        [attemptId, record.question_id, record.selected, record.isCorrect]
      );
    }

    await connection.commit();

    res.json({
      message: 'Quiz submitted successfully',
      result: { score, total_questions, correct_answers, wrong_answers, timeTaken }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Transaction Error:', error);
    res.status(500).json({ message: 'Failed to submit quiz. Database error.' });
  } finally {
    connection.release();
  }
};