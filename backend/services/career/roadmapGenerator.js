/**
 * Roadmap generator service (Hybrid)
 */
exports.generateRoadmap = (geminiRoadmap = null) => {
  const defaultRoadmap = {
    weeklyGoals: [
      { 
        week: 1, 
        goal: 'Master Programming Basics & Linear Data Structures', 
        topics: ['Arrays', 'Strings', 'Complexity Analysis'], 
        milestone: 'Solve basic parsing problems',
        practiceTasks: ['20 LeetCode Array/String questions', 'Finish Striver A2Z Array Sheet'],
        expectedProgress: 12
      },
      { 
        week: 2, 
        goal: 'Algorithms & Advanced Data Structures', 
        topics: ['Recursion', 'Sorting algorithms', 'Hash tables'], 
        milestone: 'Solve 10 Medium LeetCode problems',
        practiceTasks: ['15 LeetCode Hashing/Sorting questions', 'Implement custom HashTable in JS'],
        expectedProgress: 25
      },
      { 
        week: 3, 
        goal: 'System Architecture & Web Applications', 
        topics: ['REST APIs', 'SQL Database Design', 'CRUD Operations'], 
        milestone: 'Connect a React application to an Express API server',
        practiceTasks: ['Complete backend MVC routing guides', 'Design standard 5-table DB schema'],
        expectedProgress: 45
      },
      { 
        week: 4, 
        goal: 'Systems Integration & Cloud Infrastructure', 
        topics: ['Docker Containerization', 'AWS hosting basics', 'Git Actions CI/CD'], 
        milestone: 'Deploy a containerized application to staging',
        practiceTasks: ['Write and test Dockerfile for web app', 'Deploy mini-project to AWS EC2'],
        expectedProgress: 75
      }
    ],
    monthlyGoals: [
      { month: 1, goal: 'Build solid full-stack development foundations', milestones: ['D1: Git repository setup', 'D2: Express backend running', 'D3: React app successfully deployed'] }
    ],
    estimatedCompletionTime: '4 - 8 Weeks'
  };

  if (geminiRoadmap && geminiRoadmap.weeklyGoals) {
    return {
      weeklyGoals: geminiRoadmap.weeklyGoals.map(w => ({
        week: w.week,
        goal: w.goal,
        topics: w.topics || [],
        milestone: w.milestone || '',
        practiceTasks: w.practiceTasks || ['Complete weekly topic practice problems'],
        expectedProgress: w.expectedProgress || (w.week * 15)
      })),
      monthlyGoals: geminiRoadmap.monthlyGoals || defaultRoadmap.monthlyGoals,
      estimatedCompletionTime: geminiRoadmap.estimatedCompletionTime || defaultRoadmap.estimatedCompletionTime
    };
  }

  return defaultRoadmap;
};
