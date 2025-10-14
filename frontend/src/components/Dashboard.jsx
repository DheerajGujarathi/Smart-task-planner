import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const Dashboard = ({ plans, onViewPlan, onDeletePlan }) => {
  const [filteredPlans, setFilteredPlans] = useState(plans);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { id: 'all', label: 'All Plans', icon: '📋' },
    { id: 'startup', label: 'Startup', icon: '🚀' },
    { id: 'corporate', label: 'Corporate', icon: '💼' },
    { id: 'creative', label: 'Creative', icon: '🎨' }
  ];

  useEffect(() => {
    let filtered = plans;

    // Filter by persona
    if (activeFilter !== 'all') {
      filtered = filtered.filter(plan => plan.persona === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tasks.some(task => task.task.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPlans(filtered);
  }, [plans, activeFilter, searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPersonaBadgeClass = (persona) => {
    return `badge-${persona}`;
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const handleDownloadPDF = async (plan) => {
    try {
      const response = await fetch('http://localhost:4000/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) throw new Error('Failed to export PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${plan.goal.replace(/\s+/g, '-').toLowerCase()}-plan.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please check if the backend is running.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">📊 Plan Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and view your AI-generated task plans
          </p>

          <div className="dashboard-filters">
            <div className="filters-left">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <span>{filter.icon}</span>
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {filteredPlans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3 className="empty-title">
                {searchTerm || activeFilter !== 'all' 
                  ? 'No plans match your filters' 
                  : 'No plans created yet'
                }
              </h3>
              <p className="empty-description">
                {searchTerm || activeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating your first AI-powered plan in the chat interface'
                }
              </p>
              {(!searchTerm && activeFilter === 'all') && (
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    padding: 'var(--space-md) var(--space-xl)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🧠 Create Your First Plan
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="dashboard-stats">
                <h2 className="stats-title">
                  {filteredPlans.length} Plan{filteredPlans.length !== 1 ? 's' : ''} Found
                </h2>
                <div className="stats-metrics">
                  <div className="stats-metric">
                    <span>📈</span>
                    <span>Total Tasks: {filteredPlans.reduce((sum, plan) => sum + plan.tasks.length, 0)}</span>
                  </div>
                  <div className="stats-metric">
                    <span>⏱️</span>
                    <span>Avg Duration: {Math.round(filteredPlans.reduce((sum, plan) => sum + plan.timeline_days, 0) / filteredPlans.length)} days</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                {filteredPlans.map((plan, index) => (
                  <div key={plan.id || index} className="plan-card fade-in">
                    <div className="plan-card-header">
                      <div className="plan-info">
                        <h3 className="plan-title">{plan.goal}</h3>
                        <div className="plan-meta">
                          <span className={`plan-badge ${getPersonaBadgeClass(plan.persona)}`}>
                            {plan.persona}
                          </span>
                          <span className="plan-date">
                            {plan.generated_at ? formatDate(plan.generated_at) : 'Recently'}
                          </span>
                        </div>
                      </div>
                      {plan.critique && plan.critique.length > 0 && (
                        <div className="insight-indicator">
                          💡
                        </div>
                      )}
                    </div>

                    <div className="plan-stats">
                      <div className="stat-item">
                        <div className="stat-value">{plan.tasks.length}</div>
                        <div className="stat-label">Tasks</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{plan.timeline_days}</div>
                        <div className="stat-label">Days</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">
                          {plan.tasks.filter(t => t.priority === 'High').length}
                        </div>
                        <div className="stat-label">Priority</div>
                      </div>
                    </div>

                    <div className="plan-tasks">
                      <h4 className="tasks-header">
                        📋 Key Tasks
                      </h4>
                      {plan.tasks.slice(0, 4).map((task, taskIndex) => (
                        <div key={taskIndex} className="task-item">
                          <div className={`task-priority ${getPriorityClass(task.priority)}`}></div>
                          <span className="task-name">{task.task}</span>
                          <span className="task-duration">{task.duration_days}d</span>
                        </div>
                      ))}
                      {plan.tasks.length > 4 && (
                        <div className="task-more">
                          +{plan.tasks.length - 4} more tasks
                        </div>
                      )}
                    </div>

                    <div className="plan-actions">
                      <button 
                        className="action-button primary"
                        onClick={() => onViewPlan && onViewPlan(plan)}
                      >
                        📊 View Plan
                      </button>
                      <button 
                        className="action-button"
                        onClick={() => handleDownloadPDF(plan)}
                      >
                        📄 PDF
                      </button>
                      {onDeletePlan && (
                        <button 
                          className="action-button danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this plan?')) {
                              onDeletePlan(plan.id || index);
                            }
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;