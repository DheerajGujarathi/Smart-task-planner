/**
 * Determines task priority based on position in the task list
 * @param {object} task - The task object
 * @param {number} index - Task index in the list
 * @param {number} total - Total number of tasks
 * @returns {string} - Priority level: 'High', 'Medium', or 'Low'
 */
export const determinePriority = (task, index, total) => {
  // First and last tasks are high priority
  if (index === 0 || index === total - 1) return 'High';
  
  // Middle 30% are high priority
  if (index < total * 0.3) return 'High';
  
  // Next 50% are medium
  if (index < total * 0.8) return 'Medium';
  
  // Rest are low
  return 'Low';
};

/**
 * Returns color for priority badge
 * @param {string} priority - Priority level
 * @returns {string} - Hex color code
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': 
      return '#f43f5e'; // Red
    case 'Medium': 
      return '#fb7185'; // Pink
    case 'Low': 
      return '#c4b5fd'; // Purple
    default: 
      return '#8b5cf6'; // Default purple
  }
};
