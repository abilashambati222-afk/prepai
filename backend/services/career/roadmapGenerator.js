/**
 * Roadmap generator service (Hybrid)
 */
exports.generateRoadmap = (geminiRoadmap = null) => {
  const defaultRoadmap = {
    weeklyGoals: [
      { week: 1, goal: 'Master Core Programming Basics', topics: ['Syntax', 'Variables', 'Control flow'], milestone: 'Write clean basic scripts' },
      { week: 2, goal: 'Algorithms & Core Data Structures', topics: ['Arrays', 'Strings', 'Complexity Analysis'], milestone: 'Solve 10 Easy LeetCode questions' },
      { week: 3, goal: 'Introduction to Frameworks', topics: ['Component Architecture', 'Routing', 'Props & State'], milestone: 'Build a basic responsive landing page' },
      { week: 4, goal: 'Databases & CRUD Operations', topics: ['SQL Basics', 'Schemas', 'REST API Integration'], milestone: 'Connect frontend UI with a working database' }
    ],
    monthlyGoals: [
      { month: 1, goal: 'Build solid full-stack development foundations', milestones: ['D1: Git repository setup', 'D2: Express backend running', 'D3: React app successfully deployed'] }
    ],
    estimatedCompletionTime: '4 - 8 Weeks'
  };

  if (geminiRoadmap) {
    return {
      weeklyGoals: geminiRoadmap.weeklyGoals || defaultRoadmap.weeklyGoals,
      monthlyGoals: geminiRoadmap.monthlyGoals || defaultRoadmap.monthlyGoals,
      estimatedCompletionTime: geminiRoadmap.estimatedCompletionTime || defaultRoadmap.estimatedCompletionTime
    };
  }

  return defaultRoadmap;
};
