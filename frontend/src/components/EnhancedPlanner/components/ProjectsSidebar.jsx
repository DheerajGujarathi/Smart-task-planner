import React from 'react';
import '../styles/Sidebar.css';

const ProjectsSidebar = ({ projects, onSelectProject, onDeleteProject }) => {
  const completedProjects = projects.filter(p => p.status === 'completed');
  const inProgressProjects = projects.filter(p => p.status === 'in-progress');

  const handleDelete = (e, projectId) => {
    e.stopPropagation(); // Prevent triggering onSelectProject
    onDeleteProject(projectId);
  };

  return (
    <aside className="projects-sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">📊 Projects Summary</h3>
        
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card completed">
            <div className="stat-number">{completedProjects.length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-number">{inProgressProjects.length}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        {/* In Progress Projects */}
        {inProgressProjects.length > 0 && (
          <div className="project-list">
            <h4 className="list-title">🔄 In Progress</h4>
            {inProgressProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="project-item"
                onClick={() => onSelectProject(project)}
              >
                <div className="project-info">
                  <div className="project-name">{project.goal}</div>
                  <div className="project-progress">
                    {project.completionPercentage}% complete
                  </div>
                </div>
                <div className="mini-progress">
                  <div 
                    className="mini-progress-fill"
                    style={{ width: `${project.completionPercentage}%` }}
                  ></div>
                </div>
                <button
                  className="delete-project-btn"
                  onClick={(e) => handleDelete(e, project.id)}
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed Projects */}
        {completedProjects.length > 0 && (
          <div className="project-list">
            <h4 className="list-title">✅ Completed</h4>
            {completedProjects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="project-item completed"
                onClick={() => onSelectProject(project)}
              >
                <div className="project-info">
                  <div className="project-name">{project.goal}</div>
                  <div className="project-date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="delete-project-btn"
                  onClick={(e) => handleDelete(e, project.id)}
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProjectsSidebar;
