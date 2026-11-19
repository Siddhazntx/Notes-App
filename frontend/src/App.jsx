import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load existing session on startup
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('notes_app_token');
      const savedUser = localStorage.getItem('notes_app_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      localStorage.removeItem('notes_app_token');
      localStorage.removeItem('notes_app_user');
    } finally {
      setInitializing(false);
    }
  }, []);

  const handleAuthSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('notes_app_token');
    localStorage.removeItem('notes_app_user');
    setUser(null);
    setToken(null);
  };

  if (initializing) {
    return (
      <div className="loading-screen">
        <p>Loading Notes App...</p>
      </div>
    );
  }

  return (
    <div className="app-root">
      {token && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
