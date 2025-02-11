import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import auth from '../utils/auth';
import './style.css';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const location = useLocation(); // Get current route
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  }, [loginCheck]);

  return (
    <div className="nav_container">
      <nav>
        <h1 className="logo">Vacation Planner</h1>
        <ul>
          <li>
            <Link className={`nav_link ${location.pathname === '/' ? 'active' : ''}`} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={`nav_link ${location.pathname === '/saved' ? 'active' : ''}`} to="/saved">
              Saved Destinations
            </Link>
          </li>
        </ul>
      </nav>
      <div className="display-flex justify-space-between align-center">
        {location.pathname !== '/login' && (
          <div>
            {!loginCheck ? (
              <button className="btn" type='button' onClick={() => navigate('/login')}>
                Login
              </button>
            ) : (
              <button className="btn" type='button' onClick={() => auth.logout()}>
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
