import { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/leaderboard');
        setBoard(data);
      } catch (err) {
        console.error('Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 w-full">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">🏆 Top 10 Leaderboard</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4">Rank</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Institution</th>
              <th className="p-4">Score</th>
              <th className="p-4">Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
            ) : board.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No records found.</td></tr>
            ) : (
              board.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50 transition">
                  <td className="p-4 font-bold text-gray-700">#{idx + 1}</td>
                  <td className="p-4 font-semibold">{row.name}</td>
                  <td className="p-4 text-gray-600">{row.institution}</td>
                  <td className="p-4 font-bold text-blue-600">{row.score}</td>
                  <td className="p-4 font-mono text-gray-500">{row.time_taken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;