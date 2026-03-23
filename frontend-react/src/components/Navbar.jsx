import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h2>Internal Marks System</h2>
      <div className="links">
        {user?.role === 'admin' ? (
          <Link to="/admin">Admin Dashboard</Link>
        ) : (
          <Link to="/student">My Dashboard</Link>
        )}
        <span className="user-badge">Role: {user?.role}</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
