import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border-t-4 border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          required
          className="w-full mb-4 p-3 border rounded"
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-6 p-3 border rounded"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-gray-800 text-white p-3 rounded font-bold hover:bg-gray-900 transition">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;