import React from 'react';
import GanttChart from './GanttChart';
import TaskChecklist from './TaskChecklist';
import { downloadPDF } from '../utils/pdfExport';
import '../styles/Steps.css';

const PlanResults = ({ 
  plan, 
  onToggleTask,
  onNewPlan
}) => {
  if (!plan) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Generating your intelligent plan...</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Results Header */}
      <div className="results-header">
        <h2 className="results-title">🎉 Your Plan is Ready!</h2>
        <div className="header-actions-group">
          <button 
            className="export-button pdf-button" 
            onClick={() => downloadPDF(plan)} 
            title="Download PDF Report"
          >
            📄 Download PDF
          </button>
          <button className="new-plan-button" onClick={onNewPlan}>
            + New Plan
          </button>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="project-overview">
        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <div className="overview-label">Completion</div>
            <div className="overview-value">{plan.completionPercentage}%</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${plan.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">⏱️</div>
          <div className="overview-content">
            <div className="overview-label">Duration</div>
            <div className="overview-value">{plan.timeline_days} days</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">🎯</div>
          <div className="overview-content">
            <div className="overview-label">Status</div>
            <div className="overview-value status-badge">
              {plan.status === 'completed' ? '✅ Completed' : '🔄 In Progress'}
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon">📈</div>
          <div className="overview-content">
            <div className="overview-label">Avg Duration/Day</div>
            <div className="overview-value">{plan.avgDurationPerDay} tasks</div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <GanttChart 
        checklist={plan.checklist} 
        totalDays={plan.timeline_days} 
      />

      {/* Task Checklist */}
      <TaskChecklist 
        checklist={plan.checklist} 
        onToggleTask={onToggleTask} 
      />

      {/* AI Insights */}
      {plan.critique && plan.critique.length > 0 && (
        <div className="insights-section">
          <h3 className="insights-title">💡 AI Insights</h3>
          <div className="insights-container">
            {plan.critique.map((insight, index) => (
              <div key={index} className="insight-card">
                <span className="insight-icon">✨</span>
                <p className="insight-text">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanResults;
