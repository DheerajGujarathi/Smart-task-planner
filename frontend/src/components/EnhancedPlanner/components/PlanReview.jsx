import React from 'react';
import '../styles/Steps.css';

const PlanReview = ({
  goal,
  persona,
  timelineType,
  numberOfDays,
  dueDate,
  setStep,
  onGenerate,
  isLoading
}) => {
  const personas = [
    { id: 'startup', label: '🚀 Startup' },
    { id: 'corporate', label: '💼 Corporate' },
    { id: 'creative', label: '🎨 Creative' }
  ];

  return (
    <div className="planner-section">
      <div className="step-indicator">
        <div className="step-badge">Step 3 of 4</div>
        <div className="step-progress-bar">
          <div className="step-progress-fill" style={{ width: '75%' }}></div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Ready to Generate Your Plan?</h2>
        <p className="section-subtitle">Review your details below</p>
      </div>

      <div className="step-description">
        <div className="info-card">
          <span className="info-icon">🔍</span>
          <div className="info-content">
            <strong>Final review:</strong> Check your goal, planning style, and timeline. 
            Our AI will generate a detailed action plan with tasks, priorities, and checkpoints.
          </div>
        </div>
      </div>

      <div className="review-card">
        <div className="review-item">
          <span className="review-label">Goal:</span>
          <span className="review-value">{goal}</span>
        </div>
        <div className="review-item">
          <span className="review-label">Planning Style:</span>
          <span className="review-value">
            {personas.find(p => p.id === persona)?.label}
          </span>
        </div>
        <div className="review-item">
          <span className="review-label">Timeline:</span>
          <span className="review-value">
            {timelineType === 'days' 
              ? `${numberOfDays} days`
              : `Due: ${new Date(dueDate).toLocaleDateString()}`
            }
          </span>
        </div>
      </div>

      <div className="navigation-buttons">
        <button className="back-button" onClick={() => setStep(2)}>
          ← Back
        </button>
        <button
          className="generate-button"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? '🔄 Generating...' : '✨ Generate Task Plan'}
        </button>
      </div>
    </div>
  );
};

export default PlanReview;
