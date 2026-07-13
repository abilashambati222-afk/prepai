/**
 * Generates personalized improvement recommendations based on interview performance
 */

const RESOURCE_DATABASE = {
  'system design': {
    courses: [{ name: "Pragmatic System Design", type: "Free", link: "https://systeminterview.com" }],
    books: ["Designing Data-Intensive Applications by Martin Kleppmann"],
    videos: ["Gaurav Sen System Design Playlists"],
    codingPractice: "Design a URL shortener or rate limiter"
  },
  'recursion': {
    courses: [{ name: "Recursion & Backtracking masterclass", type: "Free", link: "https://leetcode.com" }],
    books: ["Cracking the Coding Interview (Recursion Section)"],
    videos: ["Aditya Verma Recursion Playlist"],
    codingPractice: "Solve LeetCode: N-Queens, Subsets, Permutations"
  },
  'arrays': {
    courses: [{ name: "Data Structures Crash Course", type: "Free", link: "https://geeksforgeeks.org" }],
    books: ["Introduction to Algorithms (CLRS)"],
    videos: ["NeetCode 150 Arrays & Hashing"],
    codingPractice: "Solve Two Sum, Group Anagrams, Product of Array Except Self"
  },
  'general': {
    courses: [{ name: "Complete SDE Preparation Sheet", type: "Free", link: "https://takeuforward.org" }],
    books: ["Cracking the Coding Interview by Gayle Laakmann McDowell"],
    videos: ["Clément Mihailescu - Coding Mock Interviews"],
    codingPractice: "Daily LeetCode Challenge & Striver A2Z Sheet"
  }
};

/**
 * Recommends resources based on weak topics
 */
exports.generateRecommendations = (weakAreas) => {
  const weakList = Array.isArray(weakAreas) && weakAreas.length > 0 ? weakAreas : ['general'];
  
  const recommendedTopics = [];
  const courses = [];
  const books = [];
  const videos = [];
  const codingPractice = [];

  weakList.forEach(topic => {
    const key = topic.toLowerCase();
    const res = RESOURCE_DATABASE[key] || RESOURCE_DATABASE['general'];

    recommendedTopics.push(topic);
    
    (res.courses || []).forEach(c => {
      if (!courses.some(item => item.name === c.name)) courses.push(c);
    });

    (res.books || []).forEach(b => {
      if (!books.includes(b)) books.push(b);
    });

    (res.videos || []).forEach(v => {
      if (!videos.includes(v)) videos.push(v);
    });

    if (res.codingPractice && !codingPractice.includes(res.codingPractice)) {
      codingPractice.push(res.codingPractice);
    }
  });

  // Construct a standard structured Revision Plan
  const revisionPlan = weakList.map((topic, index) => {
    return {
      day: (index + 1) * 2 - 1, // e.g. Day 1, Day 3
      topic: `Revise: ${topic}`,
      task: `Read theoretical fundamentals, review feedback logs, and solve at least 3 related coding/conceptual practice questions.`
    };
  });

  return {
    topics: recommendedTopics.slice(0, 3),
    courses: courses.slice(0, 3),
    books: books.slice(0, 3),
    videos: videos.slice(0, 3),
    codingPractice: codingPractice.slice(0, 3),
    revisionPlan
  };
};
