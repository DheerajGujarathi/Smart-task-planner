import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import '../styles/plan-visualization.css';

const PlanVisualization = ({ plan, onClose }) => {
  const chartRef = useRef(null);
  const mermaidRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#10b981',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#059669',
        lineColor: '#6b7280',
        sectionBkgColor: '#111827',
        altSectionBkgColor: '#1f2937',
        gridColor: '#374151',
        c0: '#10b981',
        c1: '#06b6d4', 
        c2: '#8b5cf6',
        c3: '#f59e0b',
        c4: '#ec4899',
        taskBkgColor: '#10b981',
        taskTextColor: '#ffffff',
        activeTaskBkgColor: '#059669',
        activeTaskBorderColor: '#047857',
        gridColor: '#374151',
        section0: '#10b981',
        section1: '#06b6d4',
        section2: '#8b5cf6'
      }
    });
  }, []);

  useEffect(() => {
    if (plan && chartRef.current) {
      renderMermaidChart();
    }
  }, [plan]);

  const renderMermaidChart = async () => {
    if (!mermaidRef.current) return;

    const chartDefinition = generateMermaidGantt(plan);
    
    try {
      mermaidRef.current.innerHTML = '';
      const { svg } = await mermaid.render('gantt-chart', chartDefinition);
      mermaidRef.current.innerHTML = svg;
    } catch (error) {
      console.error('Error rendering Mermaid chart:', error);
      mermaidRef.current.innerHTML = `
        <div style="
          padding: var(--space-xl);
          text-align: center;
          color: var(--text-muted);
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
        ">
          <div style="font-size: 2rem; margin-bottom: var(--space-md);">📊</div>
          <div>Chart rendering temporarily unavailable</div>
        </div>
      `;
    }
  };

  const generateMermaidGantt = (plan) => {
    let gantt = `gantt
    title ${plan.goal}
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    
    section Planning Phase`;

    plan.tasks.forEach((task, index) => {
      const startDate = new Date(task.start).toISOString().split('T')[0];
      const duration = `${task.duration_days}d`;
      const taskName = task.task.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      
      gantt += `\n    ${taskName} :${task.priority === 'High' ? 'crit, ' : ''}task${index}, ${startDate}, ${duration}`;
    });

    return gantt;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getPersonaIcon = (persona) => {
    switch (persona) {
      case 'startup': return '🚀';
      case 'corporate': return '💼';
      case 'creative': return '🎨';
      default: return '📋';
    }
  };

  if (!plan) return null;

  return (
    <div className="plan-visualization-overlay">
      <div className="plan-visualization-container">
        <div className="plan-header">
          <div className="plan-header-content">
            <div className="plan-header-main">
              <span className="persona-icon">{getPersonaIcon(plan.persona)}</span>
              <div>
                <h1 className="plan-title">{plan.goal}</h1>
                <div className="plan-metadata">
                  <span className={`persona-badge badge-${plan.persona}`}>
                    {plan.persona} Mode
                  </span>
                  <span className="plan-duration">
                    📅 {plan.timeline_days} days • {plan.tasks.length} tasks
                  </span>
                  {plan.generated_at && (
                    <span className="plan-date">
                      🕒 {formatDate(plan.generated_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              className="close-button"
              onClick={onClose}
              aria-label="Close plan view"
            >
              ✕
            </button>
          </div>

          {plan.critique && plan.critique.length > 0 && (
            <div className="ai-insights">
              <div className="insights-header">
                <span>🧠</span>
                <strong>AI Insights</strong>
              </div>
              <ul>
                {plan.critique.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="plan-content">
          <div className="visualization-section">
            <h2 className="section-title">📊 Timeline Visualization</h2>
            <div className="chart-container" ref={chartRef}>
              <div ref={mermaidRef} className="mermaid-chart"></div>
            </div>
          </div>

          <div className="tasks-section">
            <h2 className="section-title">📋 Task Breakdown</h2>
            <div className="tasks-grid">
              {plan.tasks.map((task, index) => (
                <div key={index} className="task-card">
                  <div className="task-card-header">
                    <div className="task-priority-indicator" 
                         style={{ backgroundColor: getPriorityColor(task.priority) }}>
                    </div>
                    <div className="task-info">
                      <h3 className="task-name">{task.task}</h3>
                      <div className="task-details">
                        <span className="task-duration">
                          ⏱️ {task.duration_days} day{task.duration_days !== 1 ? 's' : ''}
                        </span>
                        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="task-timeline">
                    <div className="timeline-dates">
                      <span className="start-date">
                        🟢 {formatDate(task.start)}
                      </span>
                      <span className="end-date">
                        🏁 {formatDate(task.end)}
                      </span>
                    </div>
                  </div>

                  {task.dependsOn && task.dependsOn.length > 0 && (
                    <div className="task-dependencies">
                      <span className="dependencies-label">Depends on:</span>
                      <div className="dependencies-list">
                        {task.dependsOn.map((dep, depIndex) => (
                          <span key={depIndex} className="dependency-item">{dep}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanVisualization;