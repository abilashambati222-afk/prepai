/**
 * Configuration and rules for Phase 10: Interview Platform
 */

exports.SCORING_WEIGHTS = {
  technicalAccuracy: 0.40,
  communication: 0.15,
  completeness: 0.15,
  confidence: 0.10,
  keywords: 0.10,
  professionalism: 0.05,
  grammar: 0.05
};

exports.INTERVIEW_TYPES = [
  'HR Interview',
  'Technical Interview',
  'Behavioral Interview',
  'Managerial Interview',
  'Resume Based Interview',
  'Project Based Interview',
  'Coding Interview'
];

exports.ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Java Developer',
  'MERN Developer',
  'Python Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cyber Security',
  'Data Analyst',
  'Data Scientist'
];

exports.COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe', 'Oracle', 'Salesforce',
  'Netflix', 'Uber', 'Apple', 'TCS', 'Infosys', 'Accenture', 'Capgemini',
  'Cognizant', 'Wipro', 'Tech Mahindra', 'Deloitte', 'EY', 'KPMG', 'PwC'
];

// Fallback technical questions if Gemini fails
exports.FALLBACK_QUESTIONS = {
  'Technical Interview': [
    "Explain the difference between synchronous and asynchronous programming, and when you would use each.",
    "What is Object-Oriented Programming (OOP) and what are its four core pillars?",
    "Explain the difference between SQL and NoSQL databases, and how you choose between them.",
    "What is JWT authentication and how does it work in stateless REST APIs?",
    "Explain the concept of Virtual DOM in React and how it optimizes UI updates."
  ],
  'HR Interview': [
    "Tell me about yourself, your background, and why you are interested in this role.",
    "What are your greatest professional strengths and weaknesses?",
    "Why do you want to join our organization specifically?",
    "Where do you see yourself in five years and what are your career goals?",
    "Explain a situation where you had to deal with a conflict in a team. How did you resolve it?"
  ],
  'Behavioral Interview': [
    "Tell me about a time when you faced a major project failure. What did you do, and what did you learn?",
    "Describe a situation where you had to make a quick decision with incomplete information. What was the outcome?",
    "Give an example of a time when you had to work under a tight deadline. How did you manage it?",
    "Tell me about a time you had to persuade a team member or stakeholder to accept your technical choice.",
    "Describe a time when you went above and beyond for a project or client."
  ]
};

// Default Coding Problems
exports.CODING_PROBLEMS = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    problemDescription: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    hints: [
      "Try checking every pair of numbers.",
      "Can we use a hash map to look up the complement in O(1) time?"
    ],
    expectedComplexity: "Time: O(N), Space: O(N)",
    referenceSolution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]" },
      { input: "[3,2,4], 6", output: "[1,2]" }
    ]
  },
  {
    title: "Reverse a Linked List",
    difficulty: "Medium",
    category: "Linked Lists",
    problemDescription: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      }
    ],
    hints: [
      "You can reverse it iteratively or recursively.",
      "For iterative, keep track of prev, curr, and next pointers."
    ],
    expectedComplexity: "Time: O(N), Space: O(1)",
    referenceSolution: "function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    let nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}",
    testCases: []
  }
];
