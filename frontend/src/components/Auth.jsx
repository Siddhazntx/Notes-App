import { useState } from 'react';
import api from '../api';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login API Call
        const response = await api.post('/api/auth/login', {
          email: trimmedEmail,
          password: password,
        });

        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem('notes_app_token', token);
          localStorage.setItem('notes_app_user', JSON.stringify(user));
          onAuthSuccess(user, token);
        }
      } else {
        // Signup API Call
        const response = await api.post('/api/auth/signup', {
          email: trimmedEmail,
          password: password,
        });

        if (response.data.success) {
          setSuccessMessage('Account created successfully! You can now log in.');
          setIsLogin(true);
          setPassword('');
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? 'Sign In to Notes App' : 'Create an Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Welcome back! Enter your credentials to access your notes.' : 'Sign up to start organizing your notes.'}
        </p>

        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-switch">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button type="button" onClick={toggleMode} className="btn-link">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
