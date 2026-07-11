/**
 * Resource recommendation service (Hybrid)
 */
exports.recommendResources = (geminiResources = null) => {
  const defaultResources = [
    { category: 'Practice Platforms', name: 'LeetCode Algorithms Practice', type: 'Free', link: 'https://leetcode.com' },
    { category: 'Documentation', name: 'React Development Guides', type: 'Free', link: 'https://react.dev' },
    { category: 'YouTube', name: 'NeetCode Algorithm Roadmaps', type: 'Free', link: 'https://youtube.com/@neetcode' },
    { category: 'Courses', name: 'Striver A2Z Coding Track', type: 'Free', link: 'https://takeuforward.org' }
  ];

  if (geminiResources && Array.isArray(geminiResources) && geminiResources.length > 0) {
    return geminiResources;
  }

  return defaultResources;
};
