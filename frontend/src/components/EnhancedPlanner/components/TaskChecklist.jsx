import React from 'react';
import { getPriorityColor } from '../utils/priorities';
import { generateTaskDescription } from '../utils/taskDescriptions';
import '../styles/TaskChecklist.css';

const TaskChecklist = ({ checklist, onToggleTask }) => {
  return (
    <div className="checklist-section">
      <h3 className="checklist-title">✅ Task Checklist</h3>
      <div className="checklist-container">
        {checklist.map((task) => (
          <div
            key={task.id}
            className={`checkpoint-item ${task.completed ? 'completed' : ''}`}
          >
            <button
              className="checkpoint-circle"
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed && <span className="checkmark">✓</span>}
            </button>
            
            <div className="checkpoint-content">
              <div className="checkpoint-header">
                <h4 className="checkpoint-title">{task.task}</h4>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>
              
              <div className="checkpoint-description">
                {task.description || generateTaskDescription(task.task, task.duration_days)}
              </div>
              
              <div className="checkpoint-meta">
                <span className="checkpoint-duration">
                  📅 {task.duration_days} {task.duration_days === 1 ? 'day' : 'days'}
                </span>
                <span className="checkpoint-dates">
                  {new Date(task.start).toLocaleDateString()} → {new Date(task.end).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskChecklist;
