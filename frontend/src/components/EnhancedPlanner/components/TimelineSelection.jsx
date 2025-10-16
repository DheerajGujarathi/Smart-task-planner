import React from 'react';
import '../styles/Steps.css';

const TimelineSelection = ({
  timelineType,
  setTimelineType,
  numberOfDays,
  setNumberOfDays,
  dueDate,
  setDueDate,
  setStep
}) => {
  const incrementDays = () => setNumberOfDays(prev => Math.min(prev + 1, 90));
  const decrementDays = () => setNumberOfDays(prev => Math.max(prev - 1, 1));

  return (
    <div className="planner-section">
      <div className="step-indicator">
        <div className="step-badge">Step 2 of 4</div>
        <div className="step-progress-bar">
          <div className="step-progress-fill" style={{ width: '50%' }}></div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">What's your timeline?</h2>
        <p className="section-subtitle">Choose how you'd like to define your project timeline</p>
      </div>

      <div className="step-description">
        <div className="info-card">
          <span className="info-icon">⏰</span>
          <div className="info-content">
            <strong>Timeline options:</strong> Choose to work with a specific number of days or set a deadline. 
            Our AI will distribute tasks intelligently across your timeline for optimal productivity.
          </div>
        </div>
      </div>

      <div className="timeline-options">
        <div
          className={`timeline-option ${timelineType === 'days' ? 'active' : ''}`}
          onClick={() => setTimelineType('days')}
        >
          <span className="option-icon">📅</span>
          <span className="option-label">Number of Days</span>
        </div>
        <div
          className={`timeline-option ${timelineType === 'date' ? 'active' : ''}`}
          onClick={() => setTimelineType('date')}
        >
          <span className="option-icon">📆</span>
          <span className="option-label">Due Date</span>
        </div>
      </div>

      {timelineType === 'days' && (
        <div className="days-input-container">
          <label className="input-label">How many days do you need?</label>
          <div className="days-selector">
            <button className="days-control" onClick={decrementDays}>−</button>
            <input
              type="number"
              className="days-input"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Math.max(1, Math.min(90, parseInt(e.target.value) || 1)))}
              min="1"
              max="90"
            />
            <button className="days-control" onClick={incrementDays}>+</button>
          </div>
          <span className="input-hint">Choose between 1 and 90 days</span>
        </div>
      )}

      {timelineType === 'date' && (
        <div className="date-input-container">
          <label className="input-label">When is your deadline?</label>
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <span className="input-hint">Select a future date</span>
        </div>
      )}

      <div className="navigation-buttons">
        <button className="back-button" onClick={() => setStep(1)}>
          ← Back
        </button>
        <button
          className="next-button"
          onClick={() => setStep(3)}
          disabled={timelineType === 'date' && !dueDate}
        >
          Review Plan →
        </button>
      </div>
    </div>
  );
};

export default TimelineSelection;
