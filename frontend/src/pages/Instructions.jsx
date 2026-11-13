import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Instructions = () => {
  const navigate = useNavigate();
  const [hasAttempted, setHasAttempted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAttempt = async () => {
      try {
        const { data } = await api.get('/quiz/quizzes/1/attempt');
        if (data.hasAttempted) {
          setHasAttempted(true);
        }
      } catch (err) {
        console.error('Failed to check attempt status');
      } finally {
        setLoading(false);
      }
    };
    checkAttempt();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 border-b pb-4 text-blue-800">Quiz Instructions</h2>
        <ul className="list-disc pl-5 space-y-3 text-lg mb-8 text-gray-700">
          <li>The quiz consists of multiple-choice questions.</li>
          <li>You will have a specific time limit to complete the quiz.</li>
          <li>Once the timer reaches zero, the quiz will be automatically submitted.</li>
          <li>Do not refresh the page or you might lose your progress.</li>
          <li>Each question carries equal marks. There is no negative marking.</li>
          <li>Make sure to click "Submit Quiz" when you are done.</li>
          <li className="font-bold text-red-600">You can only submit this quiz once.</li>
        </ul>
        <div className="flex justify-center flex-col items-center">
          {loading ? (
            <p className="text-gray-500">Checking your status...</p>
          ) : hasAttempted ? (
            <div className="text-center">
              <p className="text-red-600 font-bold mb-4 text-xl">You have already completed this quiz!</p>
              <button onClick={() => navigate('/leaderboard')} className="bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-blue-700 transition shadow-md">
                View Leaderboard
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/quiz')} className="bg-green-600 text-white px-8 py-3 rounded text-lg font-bold hover:bg-green-700 transition shadow-md">
              I Understand, Start Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructions;