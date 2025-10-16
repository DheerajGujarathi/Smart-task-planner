import React from 'react';
import '../styles/Header.css';

const Header = ({ userName, onLogout, theme, toggleTheme }) => {
  return (
    <header className="planner-header">
      <div className="header-content">
        <h1 className="header-title">Smart Task Planner</h1>
        <div className="header-actions">
          <button 
            className="theme-toggle-button" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
            <span className="theme-label">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
          <div className="header-user">
            <span className="user-greeting">Welcome, {userName}! 👋</span>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
