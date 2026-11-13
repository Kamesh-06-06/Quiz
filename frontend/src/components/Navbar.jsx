import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">QuizComp</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          <Link to="/leaderboard" className="hover:text-blue-200 transition">Leaderboard</Link>
          
          {!token ? (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition">Register</Link>
            </>
          ) : (
            <>
              {role === 'admin' && <Link to="/admin/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>}
              <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;