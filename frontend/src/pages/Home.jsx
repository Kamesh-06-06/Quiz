import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to the Quiz Competition</h1>
        <p className="text-gray-600 mb-8 text-lg">Test your knowledge and compete with students across institutions.</p>
        
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800">Duration</h3>
            <p>10 Mins</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800">Questions</h3>
            <p>Multiple Choice</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800">Scoring</h3>
            <p>+1 Correct, No Negative</p>
          </div>
        </div>

        <Link to="/instructions" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition shadow-md inline-block">
          Start Quiz
        </Link>
        <div className="mt-4">
          <Link to="/leaderboard" className="text-blue-600 hover:underline">View Leaderboard Preview</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;