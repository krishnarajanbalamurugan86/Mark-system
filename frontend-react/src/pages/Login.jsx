import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    if (role === 'admin') {
      if (username === 'adm123' && password === '123') {
        login('admin', username);
        navigate('/admin');
      } else {
        setError('Invalid Admin credentials. (Use adm123 / 123)');
      }
    } else {
      if (username && username.length >= 4 && password === username.slice(-4)) {
        login('student', username);
        navigate('/student');
      } else {
        setError("Invalid Student credentials. Password must be the last 4 digits of your Register Number.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Internal Marks System</h2>
      <div className="login-card">
        <h3>Login</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group role-selector">
            <label>
              <input type="radio" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
              Student
            </label>
            <label>
              <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
              Admin / Teacher
            </label>
          </div>

          <div className="form-group">
            <label>{role === 'admin' ? 'Username' : 'Register Number'}</label>
            <input 
              type="text" 
              placeholder={role === 'admin' ? "Enter Admin Username" : "Enter Register Number"} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
