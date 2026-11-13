CREATE DATABASE IF NOT EXISTS quiz_competition;
USE quiz_competition;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  institution VARCHAR(255),
  department VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password is 'admin123')
-- $2b$10$wN1Q.P/2.gL0b7kO4dJzueuP/r.YQfH4vX0V3yJ8X0kY7y4gO4e6W
INSERT IGNORE INTO admins (username, password) VALUES ('admin', '$2b$10$wN1Q.P/2.gL0b7kO4dJzueuP/r.YQfH4vX0V3yJ8X0kY7y4gO4e6W');

CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT NOT NULL, -- duration in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT,
  question TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer CHAR(1) NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  quiz_id INT,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  wrong_answers INT NOT NULL,
  time_taken VARCHAR(10) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT,
  question_id INT,
  selected_answer CHAR(1),
  is_correct BOOLEAN,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Insert sample quiz
INSERT IGNORE INTO quizzes (id, title, description, duration) VALUES (1, 'General Knowledge Quiz', 'A basic quiz to test your general knowledge.', 10);
INSERT IGNORE INTO questions (quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
(1, 'What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C'),
(1, 'Which planet is known as the Red Planet?', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'B'),
(1, 'Who wrote Hamlet?', 'Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen', 'B');
