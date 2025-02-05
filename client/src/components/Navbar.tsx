import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import auth from '../utils/auth';
import './style.css';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);
  const location = useLocation(); // Get current path

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
            <Link className={`nav_link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
          </li>
          <li>
            <Link className={`nav_link ${location.pathname === '/saved' ? 'active' : ''}`} to="/saved">Saved Destinations</Link>
          </li>
        </ul>
      </nav>
      <div className="display-flex justify-space-between align-center">
        <div>
          {!loginCheck ? (
            <button className="btn" type='button'>
              <Link to='/login'>Login</Link>
            </button>
          ) : (
            <button className="btn" type='button' onClick={() => auth.logout()}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
