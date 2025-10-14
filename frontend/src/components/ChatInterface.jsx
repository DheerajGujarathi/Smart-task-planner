import React, { useState, useRef, useEffect } from 'react';
import '../styles/chat.css';

const ChatInterface = ({ onPlanGenerated }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "👋 Hello there! I'm your friendly AI planning assistant, and I'm absolutely thrilled to meet you! ✨\n\nI specialize in transforming your ideas, goals, and projects into beautifully organized, actionable plans with smart timelines. Whether you're planning a product launch, organizing a meeting, or tackling any project - I'm here to help! 🚀\n\nJust tell me what you'd like to accomplish, and I'll create an intelligent plan tailored to your style. Ready to turn some ideas into action? 😊",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('startup');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const personas = [
    { id: 'startup', label: '🚀 Startup', description: 'Fast, lean execution' },
    { id: 'corporate', label: '💼 Corporate', description: 'Structured, deadline-oriented' },
    { id: 'creative', label: '🎨 Creative', description: 'Idea-first, flexible' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
  };

  const addMessage = (content, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  // Conversational response patterns
  const getConversationalResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Greetings
    const greetingPatterns = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'];
    if (greetingPatterns.some(pattern => message.includes(pattern))) {
      const greetingResponses = [
        "Hello there! 👋 Great to see you! I'm excited to help you turn your ideas into actionable plans. What would you like to accomplish today?",
        "Hi! 😊 Welcome back to your smart planning assistant! Ready to tackle some goals together? Tell me what's on your mind!",
        "Hey! 🌟 I'm here to help you organize your thoughts into brilliant plans. What project or goal can we work on today?",
        "Good day! 🚀 Your AI planning partner is ready for action! What exciting plans shall we create together?"
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }

    // Thank you responses
    const thankPatterns = ['thank', 'thanks', 'appreciate', 'grateful'];
    if (thankPatterns.some(pattern => message.includes(pattern))) {
      const thankResponses = [
        "You're very welcome! 😊 I'm delighted I could help you plan effectively. Is there anything else you'd like to organize or plan?",
        "My pleasure! 🌟 That's what I'm here for - making your planning process smooth and intelligent. Got another goal to tackle?",
        "Happy to help! 💫 Seeing you succeed with well-organized plans makes my circuits happy! What's next on your agenda?",
        "Absolutely my pleasure! 🎯 I love helping you transform ideas into structured action plans. Ready for the next challenge?"
      ];
      return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }

    // Help requests
    const helpPatterns = ['help', 'how', 'what can you do', 'assist', 'support'];
    if (helpPatterns.some(pattern => message.includes(pattern))) {
      return `I'm here to help you create intelligent plans! 🧠✨ Here's how I can assist you:

🎯 **Planning Expertise:**
• Turn your goals into step-by-step action plans
• Break down complex projects into manageable tasks
• Set realistic timelines and priorities
• Provide AI insights and optimization suggestions

🚀 **Three Planning Styles:**
• **Startup Mode**: Fast, lean execution focus
• **Corporate Mode**: Structured, deadline-oriented approach  
• **Creative Mode**: Idea-first, flexible planning

💡 **Just tell me about:**
• Your project goals or objectives
• Meeting preparations you need
• Events you want to organize
• Any timeline or deadline requirements

What would you like to plan today? I'm excited to help! 🌟`;
    }

    // How are you / small talk
    const smallTalkPatterns = ['how are you', 'how do you do', 'what\'s up', 'how\'s it going'];
    if (smallTalkPatterns.some(pattern => message.includes(pattern))) {
      const smallTalkResponses = [
        "I'm doing fantastic! 🤖✨ My neural networks are buzzing with excitement to help you create amazing plans. How are you doing today?",
        "I'm excellent, thank you for asking! 😊 Every conversation energizes my planning algorithms. Ready to turn some ideas into action?",
        "Wonderful! 🌟 I'm operating at peak efficiency and love every moment of helping people organize their goals. What's bringing you here today?",
        "I'm great! 💫 My favorite thing is helping brilliant minds like yours structure their ideas into winning strategies. How can I assist you?"
      ];
      return smallTalkResponses[Math.floor(Math.random() * smallTalkResponses.length)];
    }

    // Goodbye patterns
    const goodbyePatterns = ['bye', 'goodbye', 'see you', 'take care', 'farewell'];
    if (goodbyePatterns.some(pattern => message.includes(pattern))) {
      const goodbyeResponses = [
        "Goodbye! 👋 It was wonderful helping you plan today. Remember, I'm always here when you need to organize your next big idea! Take care! 🌟",
        "See you later! 😊 Thanks for letting me help with your planning. Come back anytime you need to transform goals into action! 🚀",
        "Take care! 💫 I hope your plans work out brilliantly. I'll be here whenever you need intelligent planning assistance! ✨",
        "Farewell for now! 🎯 May your organized plans lead to great success. I'm excited to help you again soon! 🌈"
      ];
      return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)];
    }

    // Compliments
    const complimentPatterns = ['great', 'awesome', 'amazing', 'brilliant', 'perfect', 'excellent', 'wonderful'];
    if (complimentPatterns.some(pattern => message.includes(pattern)) && message.length < 30) {
      const complimentResponses = [
        "Thank you so much! 😊 Your enthusiasm motivates me to create even better plans. What shall we tackle next?",
        "I'm thrilled you're happy with the planning! 🌟 Your success is my success. Ready for another challenge?",
        "That means a lot! 💫 I love helping you achieve your goals with smart planning. What's next on your list?",
        "You're too kind! 🚀 Together we make a great planning team. What other ideas can we organize?"
      ];
      return complimentResponses[Math.floor(Math.random() * complimentResponses.length)];
    }

    return null; // No conversational pattern found, proceed with normal planning
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Check for conversational patterns first
      const conversationalResponse = getConversationalResponse(userMessage);
      
      if (conversationalResponse) {
        // Handle conversational input
        await simulateTyping(800);
        addMessage(conversationalResponse, 'assistant');
        
        // Add a follow-up prompt for planning
        setTimeout(async () => {
          await simulateTyping(500);
          const followUpPrompts = [
            "So, what would you like to plan today? 🎯",
            "What goals or projects can I help you organize? 📋",
            "Ready to turn some ideas into actionable plans? ✨",
            "What's on your planning agenda? 🚀"
          ];
          addMessage(followUpPrompts[Math.floor(Math.random() * followUpPrompts.length)], 'assistant');
        }, 1500);
        
      } else {
        // Handle planning request
        await simulateTyping(800);
        
        // Add personalized greeting for planning
        const planningGreetings = [
          `Perfect! Let me create a ${persona} plan for "${userMessage}". ✨`,
          `Excellent choice! I'll craft a ${persona}-style plan for your goal. 🎯`,
          `Great idea! Time to build an intelligent ${persona} plan for this. 🚀`,
          `Love it! Let me design a strategic ${persona} plan for you. 💫`
        ];
        
        addMessage(planningGreetings[Math.floor(Math.random() * planningGreetings.length)], 'assistant');
        
        // Call the API to generate plan
        const response = await fetch('http://localhost:4000/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: userMessage,
            persona,
            timeline_days: 14
          })
        });

        if (!response.ok) throw new Error('Failed to generate plan');
        
        const data = await response.json();
        
        // Add enthusiastic completion message
        await simulateTyping(1200);
        
        const completionMessages = [
          `🎉 Fantastic! Your ${persona} plan is ready!`,
          `� Brilliant! I've crafted your perfect ${persona} strategy!`,
          `✨ Wonderful! Your intelligent ${persona} plan is complete!`,
          `🚀 Excellent! Your ${persona} action plan is ready to launch!`
        ];
        
        const planSummary = `${completionMessages[Math.floor(Math.random() * completionMessages.length)]}

📋 **Plan Overview for "${userMessage}":**
• ${data.plan.tasks.length} carefully planned tasks over ${data.plan.timeline_days} days
• Optimized using ${persona} methodology for maximum efficiency
• ${data.plan.critique.length > 0 ? `💡 AI Insight: ${data.plan.critique[0]}` : '✅ Your plan looks perfectly balanced!'}

**🎯 Key Tasks Preview:**
${data.plan.tasks.slice(0, 3).map(task => `• ${task.task} (${task.duration_days} days)`).join('\n')}
${data.plan.tasks.length > 3 ? `• ... plus ${data.plan.tasks.length - 3} more strategic tasks` : ''}

Your complete interactive plan with Gantt chart is ready! 📊

Would you like me to help you refine any part of this plan, or shall we tackle another goal? �`;

        addMessage(planSummary, 'assistant');
        
        // Pass the plan to parent component
        onPlanGenerated(data.plan);
      }
      
    } catch (error) {
      addMessage(`Oh no! 😔 I encountered a technical hiccup: ${error.message}. 

Don't worry though - let's try again! Please make sure the backend services are running, or try rephrasing your request. I'm here to help! 💪`, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const suggestedPrompts = [
    "Hi! Help me plan a product launch in 3 weeks 🚀",
    "Hello! I need to organize a team meeting for next week 📅", 
    "Hey there! Can you create a marketing campaign timeline? 📈",
    "Good day! I want to plan a software development sprint 💻",
    "Hi! Help me organize my wedding planning tasks 💒",
    "Hello! I need to plan a conference presentation 🎤",
    "Hey! Can you help me organize a move to a new city? 🏠",
    "Hi there! I want to plan a fitness transformation journey 💪"
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h1 className="chat-title">AI Task Planner</h1>
          <p className="chat-subtitle">Turn your goals into intelligent action plans</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.type}`}>
            <div className="message-header">
              <div className={`message-avatar avatar-${message.type}`}>
                {message.type === 'user' ? '👤' : '🧠'}
              </div>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            <div className="message-content">
              {message.content.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message message-assistant">
            <div className="message-header">
              <div className="message-avatar avatar-assistant">🧠</div>
              <span className="message-time">now</span>
            </div>
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {messages.length === 1 && (
          <div className="suggested-prompts" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ 
              fontSize: 'var(--font-size-sm)', 
              color: 'var(--text-muted)', 
              marginBottom: 'var(--space-sm)' 
            }}>
              ✨ Here are some friendly conversation starters:
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 'var(--space-sm)', 
              flexWrap: 'wrap' 
            }}>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--bg-chat)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary-purple)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--bg-tertiary)';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="chat-input-group">
            <div className="persona-selector">
              {personas.map((p) => (
                <div
                  key={p.id}
                  className={`persona-chip ${persona === p.id ? 'active' : ''}`}
                  onClick={() => setPersona(p.id)}
                  title={p.description}
                >
                  {p.label}
                </div>
              ))}
            </div>
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input"
              placeholder="Describe your goal, meeting, or project you'd like to plan..."
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Planning...
              </>
            ) : (
              <>
                <span>✨</span>
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;