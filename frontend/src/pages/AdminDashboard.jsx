import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, quizzes: 0, questions: 0, submissions: 0, highestScore: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 w-full">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard title="Total Students" value={stats.students} color="bg-blue-100 text-blue-800" />
        <StatCard title="Total Quizzes" value={stats.quizzes} color="bg-indigo-100 text-indigo-800" />
        <StatCard title="Questions" value={stats.questions} color="bg-purple-100 text-purple-800" />
        <StatCard title="Submissions" value={stats.submissions} color="bg-green-100 text-green-800" />
        <StatCard title="Highest Score" value={stats.highestScore} color="bg-yellow-100 text-yellow-800" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <h3 className="text-xl font-bold mb-4">Quick Actions (Simulation)</h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Add Question</button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700">View All Submissions</button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-sm text-center ${color}`}>
    <h3 className="font-semibold text-sm mb-2 opacity-80">{title}</h3>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;