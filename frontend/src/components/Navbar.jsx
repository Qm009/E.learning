import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';
import { BookOpen, LogOut, Menu } from 'lucide-react';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon"><span className="icon-wrapper"><BookOpen size={18} /></span></span>
          EduPortal
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="icon-wrapper"><Menu size={18} /></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/courses" className="nav-link">Courses</Link>
          </li>
          {user && (
            <>
              <li className="nav-item">
                <Link to="/quiz" className="nav-link">Quiz</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
            </>
          )}
          {user?.role === 'admin' && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">Admin</Link>
            </li>
          )}
          {user?.role === 'instructor' && (
            <li className="nav-item">
              <Link to="/instructor" className="nav-link">Instructor</Link>
            </li>
          )}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="user-section">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
              <button 
                onClick={logout} 
                style={{
                  background: '#dc3545',
                  color: '#000000',
                  padding: '4px 8px',
                  border: '2px solid #dc3545',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                  marginLeft: '4px',
                  whiteSpace: 'nowrap',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'inline-block',
                  visibility: 'visible',
                  opacity: '1',
                  position: 'relative',
                  zIndex: '9999',
                  flexShrink: '0',
                  minWidth: '70px',
                  textAlign: 'center'
                }}
              >
                <span className="icon-wrapper"><LogOut size={18} /></span> Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;