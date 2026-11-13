import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/students/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'student');
      localStorage.setItem('user', JSON.stringify(data.student));
      navigate('/instructions');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow py-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Student Login</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">Login</button>
        <p className="mt-4 text-center text-gray-600">New here? <Link to="/register" className="text-blue-600 hover:underline">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;