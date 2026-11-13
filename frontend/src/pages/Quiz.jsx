import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const startTime = useRef(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const attemptRes = await api.get('/quiz/quizzes/1/attempt');
        if (attemptRes.data.hasAttempted) {
          setError('You have already submitted this quiz.');
          return;
        }

        const { data: qData } = await api.get('/quiz/quizzes/1'); // Fetching first quiz for demo
        setQuiz(qData);
        const { data } = await api.get('/quiz/quizzes/1/questions');
        setQuestions(data);
      } catch (err) {
        setError('Failed to load quiz');
      }
    };
    fetchQuiz();
  }, []);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: option });
  };

  const calculateTimeTaken = () => {
    const diff = Math.floor((Date.now() - startTime.current) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const timeTaken = calculateTimeTaken();
      
      const payload = {
        studentId: user.id,
        quizId: quiz.id,
        answers,
        timeTaken
      };

      const { data } = await api.post('/quiz/submit', payload);
      navigate('/result', { state: { result: data.result, studentName: user.name } });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="text-red-500 text-center mt-10 p-4 bg-red-100 rounded">{error}</div>;
  if (!quiz || questions.length === 0) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full py-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow-sm">
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-600">Question {currentIndex + 1} of {questions.length}</span>
          <Timer initialMinutes={quiz.duration} onTimeUp={handleSubmit} />
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      <QuestionCard 
        question={questions[currentIndex]} 
        index={currentIndex} 
        selectedOption={answers[questions[currentIndex].id]} 
        onSelect={handleSelect} 
      />

      <div className="flex justify-between mt-6">
        <button 
          disabled={currentIndex === 0} 
          onClick={() => setCurrentIndex(c => c - 1)}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 transition shadow"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIndex(c => c + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;