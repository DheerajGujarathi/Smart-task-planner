import React, { useState, useEffect } from 'react';
import '../styles/landing.css';

const LandingPage = ({ onAuth }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smartPlanner_theme') || 'dark';
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartPlanner_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const quotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Your goals are the road maps that guide you and show you what is possible.",
      author: "Les Brown"
    },
    {
      text: "A goal without a plan is just a wish.",
      author: "Antoine de Saint-Exupéry"
    }
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Planning",
      description: "Intelligent task generation based on your goals across 9+ life categories"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visual dashboards with completion percentages and timeline insights"
    },
    {
      icon: "🎯",
      title: "Priority Management",
      description: "Smart priority rankings to keep you focused on what matters most"
    },
    {
      icon: "⏱️",
      title: "Time Optimization",
      description: "Calculate average duration per day and track your productivity"
    },
    {
      icon: "✅",
      title: "Checkpoint System",
      description: "Break down goals into achievable milestones with visual progress"
    },
    {
      icon: "📈",
      title: "Project Analytics",
      description: "Track completed vs in-progress projects with detailed insights"
    },
    {
      icon: "🎨",
      title: "Multiple Personas",
      description: "Choose from Startup, Corporate, or Creative planning styles"
    },
    {
      icon: "🌙",
      title: "Dual Themes",
      description: "Beautiful dark and light modes for comfortable planning anytime"
    }
  ];

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };

      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user data
      localStorage.setItem('smartPlanner_userId', data.user.id);
      localStorage.setItem('smartPlanner_userEmail', data.user.email);
      localStorage.setItem('smartPlanner_userName', data.user.name);

      // Call the onAuth callback with the user's name
      onAuth(data.user.name);

    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = () => {
    // Set demo user
    const demoName = 'Demo User';
    localStorage.setItem('smartPlanner_userId', 'demo-user-id');
    localStorage.setItem('smartPlanner_userEmail', 'demo@smartplanner.com');
    localStorage.setItem('smartPlanner_userName', demoName);
    onAuth(demoName);
  };

  if (!showAuth) {
    return (
      <div className="landing-page">
        <button 
          className="landing-theme-toggle" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        <div className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Smart Task Planner</span>
            </h1>
            <p className="hero-subtitle">
              Transform your goals into actionable plans with AI-powered intelligence
            </p>
            
            <div className="quote-section">
              <blockquote className="inspirational-quote">
                <p className="quote-text">"{currentQuote.text}"</p>
                <cite className="quote-author">— {currentQuote.author}</cite>
              </blockquote>
            </div>

            <div className="cta-buttons">
              <button 
                className="btn-primary-large"
                onClick={() => { setShowAuth(true); setIsLogin(false); }}
              >
                <span className="btn-icon">🚀</span>
                Get Started Free
              </button>
              <button 
                className="btn-secondary-large"
                onClick={handleDemoClick}
              >
                <span className="btn-icon">▶️</span>
                Try Demo
              </button>
            </div>

            <div className="login-link">
              Already have an account? 
              <button 
                className="link-button"
                onClick={() => { setShowAuth(true); setIsLogin(true); }}
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="features-grid">
            <h2 className="features-heading">Why Choose Smart Task Planner?</h2>
            <div className="features-container">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <button 
        className="landing-theme-toggle" 
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to continue your planning journey' 
                : 'Start organizing your life today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder={isLogin ? "Enter your password" : "Minimum 6 characters"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="link-button"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <button 
            className="back-button"
            onClick={() => setShowAuth(false)}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;