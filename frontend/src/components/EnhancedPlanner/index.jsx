import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GoalInput from './components/GoalInput';
import TimelineSelection from './components/TimelineSelection';
import PlanReview from './components/PlanReview';
import PlanResults from './components/PlanResults';
import ProjectsSidebar from './components/ProjectsSidebar';
import { determinePriority } from './utils/priorities';
import './styles/index.css';

const EnhancedPlanner = ({ userName, onLogout }) => {
  // Step management
  const [step, setStep] = useState(1); // 1: Goal, 2: Timeline, 3: Review, 4: Results
  
  // Form data
  const [goal, setGoal] = useState('');
  const [persona, setPersona] = useState('startup');
  const [timelineType, setTimelineType] = useState('days');
  const [numberOfDays, setNumberOfDays] = useState(14);
  const [dueDate, setDueDate] = useState('');
  
  // Plan data
  const [currentPlan, setCurrentPlan] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Theme management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smartPlanner_theme') || 'dark';
  });

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartPlanner_theme', theme);
  }, [theme]);

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('userProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage
  const saveProjects = (updatedProjects) => {
    setProjects(updatedProjects);
    localStorage.setItem('userProjects', JSON.stringify(updatedProjects));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setStep(4);

    try {
      // Calculate timeline
      let timeline_days = numberOfDays;
      if (timelineType === 'date' && dueDate) {
        const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        timeline_days = days > 0 ? days : 7;
      }

      const response = await fetch('http://localhost:4000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          persona,
          timeline_days
        })
      });

      if (!response.ok) throw new Error('Failed to generate plan');
      
      const data = await response.json();
      
      // Create enhanced plan with metadata
      const enhancedPlan = {
        ...data.plan,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'in-progress',
        completedTasks: 0,
        totalTasks: data.plan.tasks.length,
        completionPercentage: 0,
        avgDurationPerDay: (timeline_days / data.plan.tasks.length).toFixed(1),
        checklist: data.plan.tasks.map((task, index) => ({
          ...task,
          id: index,
          completed: false,
          priority: determinePriority(task, index, data.plan.tasks.length)
        }))
      };

      setCurrentPlan(enhancedPlan);

      // Add to projects list
      const updatedProjects = [enhancedPlan, ...projects];
      saveProjects(updatedProjects);

    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate plan. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    if (!currentPlan) return;

    const updatedChecklist = currentPlan.checklist.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const completedCount = updatedChecklist.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / updatedChecklist.length) * 100);

    const updatedPlan = {
      ...currentPlan,
      checklist: updatedChecklist,
      completedTasks: completedCount,
      completionPercentage: percentage,
      status: percentage === 100 ? 'completed' : 'in-progress'
    };

    setCurrentPlan(updatedPlan);

    // Update in projects list
    const updatedProjects = projects.map(p => 
      p.id === currentPlan.id ? updatedPlan : p
    );
    saveProjects(updatedProjects);
  };

  const handleNewPlan = () => {
    setStep(1);
    setGoal('');
    setCurrentPlan(null);
  };

  const handleSelectProject = (project) => {
    setCurrentPlan(project);
    setStep(4);
  };

  const handleDeleteProject = (projectId) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    
    if (!confirmDelete) return;

    // If deleting current plan, reset to step 1
    if (currentPlan && currentPlan.id === projectId) {
      setCurrentPlan(null);
      setStep(1);
      setGoal('');
    }

    // Remove from projects list
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
  };

  return (
    <div className="enhanced-planner">
      <Header 
        userName={userName}
        onLogout={onLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="planner-main">
        <div className="planner-content">
          {step === 1 && (
            <GoalInput
              goal={goal}
              setGoal={setGoal}
              persona={persona}
              setPersona={setPersona}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <TimelineSelection
              timelineType={timelineType}
              setTimelineType={setTimelineType}
              numberOfDays={numberOfDays}
              setNumberOfDays={setNumberOfDays}
              dueDate={dueDate}
              setDueDate={setDueDate}
              setStep={setStep}
            />
          )}

          {step === 3 && (
            <PlanReview
              goal={goal}
              persona={persona}
              timelineType={timelineType}
              numberOfDays={numberOfDays}
              dueDate={dueDate}
              setStep={setStep}
              onGenerate={handleGeneratePlan}
              isLoading={isLoading}
            />
          )}

          {step === 4 && (
            <PlanResults
              plan={currentPlan}
              onToggleTask={toggleTaskCompletion}
              onNewPlan={handleNewPlan}
            />
          )}
        </div>

        <ProjectsSidebar 
          projects={projects}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </div>
  );
};

export default EnhancedPlanner;
