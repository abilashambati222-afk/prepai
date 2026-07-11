/**
 * Project recommendation service (Hybrid)
 */
exports.recommendProjects = (geminiProjects = null) => {
  const defaultProjects = [
    {
      title: 'E-Commerce Microservices Engine',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Docker'],
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      learningOutcome: 'Understand distributed architectures, REST API controllers, and isolated container execution workflows.'
    },
    {
      title: 'Real-time Analytics Dashboard',
      techStack: ['React', 'WebSockets', 'Tailwind CSS', 'Recharts'],
      duration: '3 Weeks',
      difficulty: 'Intermediate',
      learningOutcome: 'Master real-time socket connections, data visualization charts, and sleek user UI designs.'
    }
  ];

  if (geminiProjects && Array.isArray(geminiProjects) && geminiProjects.length > 0) {
    return geminiProjects;
  }

  return defaultProjects;
};
