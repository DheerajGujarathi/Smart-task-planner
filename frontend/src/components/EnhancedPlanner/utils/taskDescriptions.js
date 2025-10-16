/**
 * Generates contextual task descriptions based on task name and duration
 * @param {string} taskName - The name of the task
 * @param {number} durationDays - Duration of the task in days
 * @returns {string} - A 3-4 line description for the task
 */
export const generateTaskDescription = (taskName, durationDays) => {
  const taskLower = taskName.toLowerCase();
  
  if (taskLower.includes('research') || taskLower.includes('assessment') || taskLower.includes('analyze')) {
    return `Begin by gathering comprehensive information and analyzing your current situation. Identify key requirements, potential challenges, and available resources. Document your findings and create a baseline understanding that will guide subsequent steps. This foundation phase typically spans ${durationDays} ${durationDays === 1 ? 'day' : 'days'} to ensure thoroughness.`;
  } 
  
  if (taskLower.includes('plan') || taskLower.includes('design') || taskLower.includes('strategy')) {
    return `Develop a detailed action plan with clear objectives and milestones. Define specific strategies, allocate resources, and establish measurable success criteria. Break down complex goals into manageable sub-tasks and create contingency plans. This planning phase ensures you have a roadmap for the ${durationDays}-${durationDays === 1 ? 'day' : 'days'} execution period.`;
  }
  
  if (taskLower.includes('implement') || taskLower.includes('execute') || taskLower.includes('build') || taskLower.includes('create')) {
    return `Put your plan into action with focused execution. Follow your established roadmap while remaining flexible to adapt as needed. Track progress daily, overcome obstacles proactively, and maintain momentum. This implementation phase requires ${durationDays} ${durationDays === 1 ? 'day' : 'days'} of consistent effort and dedication to achieve tangible results.`;
  }
  
  if (taskLower.includes('test') || taskLower.includes('validate') || taskLower.includes('review') || taskLower.includes('evaluate')) {
    return `Conduct thorough testing and validation of your work. Gather feedback from relevant stakeholders, measure results against your success criteria, and identify areas for improvement. Document lessons learned and validate that objectives have been met. Allow ${durationDays} ${durationDays === 1 ? 'day' : 'days'} for comprehensive evaluation and necessary iterations.`;
  }
  
  if (taskLower.includes('optimize') || taskLower.includes('refine') || taskLower.includes('improve') || taskLower.includes('enhance')) {
    return `Focus on continuous improvement and optimization. Analyze performance metrics, identify bottlenecks, and implement enhancements. Refine processes based on feedback and real-world usage. This optimization cycle over ${durationDays} ${durationDays === 1 ? 'day' : 'days'} ensures you're achieving maximum efficiency and quality.`;
  }
  
  if (taskLower.includes('track') || taskLower.includes('monitor') || taskLower.includes('measure')) {
    return `Establish robust tracking and monitoring systems. Define key performance indicators (KPIs), set up regular check-ins, and maintain detailed records of progress. Use data-driven insights to make informed decisions and adjust your approach as needed. Consistent monitoring over ${durationDays} ${durationDays === 1 ? 'day' : 'days'} keeps you on track toward your goals.`;
  }
  
  if (taskLower.includes('launch') || taskLower.includes('deploy') || taskLower.includes('release') || taskLower.includes('publish')) {
    return `Execute your launch strategy with precision. Ensure all systems are ready, communicate with stakeholders, and manage the rollout carefully. Monitor initial performance closely and be prepared to address any issues promptly. The ${durationDays}-${durationDays === 1 ? 'day' : 'days'} launch period is critical for setting the foundation of success.`;
  }
  
  // Default description
  return `Focus on completing this milestone by breaking it into smaller daily actions. Maintain consistent progress, document your work, and adapt your approach based on what you learn. Stay committed to your timeline while remaining flexible enough to handle unexpected challenges. Dedicate ${durationDays} ${durationDays === 1 ? 'day' : 'days'} to achieve this important objective.`;
};
