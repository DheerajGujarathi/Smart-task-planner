import React from 'react';
import ThemeToggle from './ThemeToggle';

const Navigation = ({ currentView, onViewChange, theme, onThemeChange }) => {
  const navItems = [
    {
      id: 'chat',
      label: 'Smart Planner',
      icon: '🧠',
      description: 'Create new plans'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'View plan history'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">💥</div>
          <div className="brand-text">
            <div className="brand-title">Smart Task Planner</div>
            <div className="brand-subtitle">Pro Edition</div>
          </div>
        </div>
        
        <div className="nav-items">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="nav-status">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <div className="status-indicator online"></div>
          <span className="status-text">AI Ready</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;