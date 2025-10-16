import React from 'react';
import { getPriorityColor } from '../utils/priorities';
import '../styles/GanttChart.css';

const GanttChart = ({ checklist, totalDays }) => {
  return (
    <div className="gantt-section">
      <h3 className="gantt-title">📊 Timeline Visualization</h3>
      <div className="gantt-chart">
        <div className="gantt-header">
          <div className="gantt-task-label">Task</div>
          <div className="gantt-timeline-label">Timeline</div>
        </div>
        
        {checklist.map((task, index) => {
          const startDay = checklist
            .slice(0, index)
            .reduce((sum, t) => sum + t.duration_days, 0);
          const leftPercent = (startDay / totalDays) * 100;
          const widthPercent = (task.duration_days / totalDays) * 100;
          
          return (
            <div key={task.id} className="gantt-row">
              <div className="gantt-task-name" title={task.task}>
                <span className="gantt-task-number">{index + 1}</span>
                {task.task}
              </div>
              <div className="gantt-timeline">
                <div 
                  className={`gantt-bar ${task.completed ? 'completed' : ''}`}
                  style={{ 
                    left: `${leftPercent}%`, 
                    width: `${widthPercent}%`,
                    backgroundColor: getPriorityColor(task.priority)
                  }}
                  title={`${task.duration_days} days: ${new Date(task.start).toLocaleDateString()} - ${new Date(task.end).toLocaleDateString()}`}
                >
                  <span className="gantt-bar-label">{task.duration_days}d</span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="gantt-footer">
          <div className="gantt-day-markers">
            {[...Array(Math.min(totalDays, 14))].map((_, i) => (
              <span key={i} className="day-marker">
                Day {i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
