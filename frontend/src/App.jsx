import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import EnhancedPlanner from './components/EnhancedPlanner/index';
import './styles/globals.css';
import './styles/landing.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('smartPlanner_theme');
    return savedTheme || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartPlanner_theme', theme);
  }, [theme]);

  // Check for existing authentication on app start
  useEffect(() => {
    const authUser = localStorage.getItem('smartPlanner_userName');
    if (authUser) {
      setIsAuthenticated(true);
      setUserName(authUser);
    }
  }, []);

  const handleAuth = (name) => {
    setIsAuthenticated(true);
    setUserName(name);
    // Note: localStorage is already set in LandingPage.jsx
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    localStorage.removeItem('smartPlanner_user');
    localStorage.removeItem('smartPlanner_userName');
    localStorage.removeItem('smartPlanner_userEmail');
    localStorage.removeItem('smartPlanner_userId');
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage onAuth={handleAuth} />;
  }

  // Show enhanced planner after authentication
  return (
    <EnhancedPlanner 
      userName={userName} 
      onLogout={handleLogout}
    />
  );
}
