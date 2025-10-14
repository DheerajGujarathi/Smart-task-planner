import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import PlanVisualization from './components/PlanVisualization';
import './styles/globals.css';
import './styles/navigation.css';
import './styles/chat.css';
import './styles/dashboard.css';

export default function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('smartPlanner_theme');
    return savedTheme || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartPlanner_theme', theme);
  }, [theme]);

  // Load plans from localStorage on app start
  useEffect(() => {
    const savedPlans = localStorage.getItem('smartPlanner_plans');
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (error) {
        console.error('Error loading saved plans:', error);
      }
    }
  }, []);

  // Save plans to localStorage whenever plans change
  useEffect(() => {
    localStorage.setItem('smartPlanner_plans', JSON.stringify(plans));
  }, [plans]);

  const handlePlanGenerated = (newPlan) => {
    const planWithId = {
      ...newPlan,
      id: Date.now(),
      generated_at: new Date().toISOString()
    };
    
    setPlans(prevPlans => [planWithId, ...prevPlans]);
    setSelectedPlan(planWithId);
    setShowPlanModal(true);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleDeletePlan = (planId) => {
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
  };

  const handleClosePlanModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // Close any open modals when switching views
    if (showPlanModal) {
      handleClosePlanModal();
    }
  };

  return (
    <div className="app">
      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange}
        theme={theme}
        onThemeChange={setTheme}
      />
      
      <main className="main-content">
        {currentView === 'chat' && (
          <ChatInterface onPlanGenerated={handlePlanGenerated} />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard 
            plans={plans}
            onViewPlan={handleViewPlan}
            onDeletePlan={handleDeletePlan}
          />
        )}
      </main>

      {showPlanModal && selectedPlan && (
        <PlanVisualization 
          plan={selectedPlan}
          onClose={handleClosePlanModal}
        />
      )}

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .main-content {
          flex: 1;
        }

        /* Global transition effects */
        * {
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }

        /* Custom scrollbar for the entire app */
        :global(body) {
          overflow-x: hidden;
        }

        /* Loading states */
        .loading-shimmer {
          background: linear-gradient(90deg, 
            var(--bg-tertiary) 25%, 
            var(--bg-chat) 50%, 
            var(--bg-tertiary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          :root {
            --bg-primary: #000000;
            --bg-secondary: #1a1a1a;
            --text-primary: #ffffff;
            --primary-purple: #7c7cff;
          }
        }
      `}</style>
    </div>
  );
}
