import React from 'react';
import '../styles/Steps.css';

const GoalInput = ({ 
  goal, 
  setGoal, 
  persona, 
  setPersona, 
  setStep 
}) => {
  const personas = [
    { id: 'startup', label: '🚀 Startup', description: 'Fast, lean execution', color: '#8b5cf6' },
    { id: 'corporate', label: '💼 Corporate', description: 'Structured approach', color: '#f43f5e' },
    { id: 'creative', label: '🎨 Creative', description: 'Flexible, creative', color: '#fb7185' }
  ];

  return (
    <div className="planner-section">
      <div className="step-indicator">
        <div className="step-badge">Step 1 of 4</div>
        <div className="step-progress-bar">
          <div className="step-progress-fill" style={{ width: '25%' }}></div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">What would you like to accomplish?</h2>
        <p className="section-subtitle">Tell me your goal, and I'll create an intelligent plan for you</p>
      </div>

      <div className="step-description">
        <div className="info-card">
          <span className="info-icon">💡</span>
          <div className="info-content">
            <strong>How it works:</strong> Describe your goal in detail. Our AI will analyze it and create a 
            customized action plan with specific tasks, timelines, and milestones tailored to your objective.
          </div>
        </div>
      </div>

      <div className="goal-input-container">
        <textarea
          className="goal-input"
          placeholder="E.g., I want to start a fitness transformation journey and lose 20 pounds while building muscle..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={4}
        />
        <div className="input-hint-text">
          💬 Be specific! Include details like timeframes, specific outcomes, or constraints.
        </div>
      </div>

      <div className="persona-selector">
        <h3 className="selector-label">Choose Your Planning Style</h3>
        <p className="selector-description">
          Select the approach that best matches your work style and preferences
        </p>
        <div className="persona-grid">
          {personas.map((p) => (
            <button
              key={p.id}
              className={`persona-card ${persona === p.id ? 'active' : ''}`}
              onClick={() => setPersona(p.id)}
              style={{
                borderColor: persona === p.id ? p.color : 'var(--glass-border)'
              }}
            >
              <span className="persona-icon">{p.label.split(' ')[0]}</span>
              <span className="persona-name">{p.label.split(' ')[1]}</span>
              <span className="persona-desc">{p.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="next-button"
          onClick={() => setStep(2)}
          disabled={!goal.trim()}
        >
          Next: Timeline →
        </button>
      </div>
    </div>
  );
};

export default GoalInput;
