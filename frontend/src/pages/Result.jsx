import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.result) {
    return <div className="text-center mt-10">No result data available.</div>;
  }

  const { result, studentName } = state;
  const percentage = Math.round((result.correct_answers / result.total_questions) * 100);

  return (
    <div className="max-w-2xl mx-auto py-12 w-full">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <span className="text-6xl text-green-500">🏆</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Congratulations!</h2>
        <p className="text-xl text-gray-600 mb-8">{studentName}, you have successfully completed the quiz.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-inner text-left grid grid-cols-2 gap-4">
          <div className="text-gray-600 font-semibold">Score:</div>
          <div className="text-gray-900 font-bold text-right">{result.score} / {result.total_questions}</div>
          
          <div className="text-gray-600 font-semibold">Correct Answers:</div>
          <div className="text-green-600 font-bold text-right">{result.correct_answers}</div>
          
          <div className="text-gray-600 font-semibold">Wrong Answers:</div>
          <div className="text-red-600 font-bold text-right">{result.wrong_answers}</div>
          
          <div className="text-gray-600 font-semibold">Percentage:</div>
          <div className="text-blue-600 font-bold text-right">{percentage}%</div>
          
          <div className="text-gray-600 font-semibold">Time Taken:</div>
          <div className="text-gray-900 font-bold text-right">{result.timeTaken}</div>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={() => navigate('/leaderboard')} className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
            View Leaderboard
          </button>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow font-semibold">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;