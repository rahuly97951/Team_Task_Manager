import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div>
        <Link to="/"><strong>Team Task Manager</strong></Link>
        {user && <Link to="/projects" style={{ marginLeft: 24 }}>Projects</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 16 }}>{user.name}</span>
            <button className="btn secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" style={{ marginLeft: 16 }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
