/**
 * Mapping expectations and focus areas for specific tech roles
 */

const ROLE_MAPS = {
  'frontend developer': {
    categories: ['HTML5 & CSS3', 'JavaScript ES6+', 'React & State Management', 'Web Performance & DOM', 'Tailwind CSS / Styling'],
    keywords: ['Virtual DOM', 'Redux', 'Hooks', 'Flexbox', 'Flex', 'Grid', 'Semantic HTML', 'SEO', 'SSR', 'hydrate']
  },
  'backend developer': {
    categories: ['API Design (REST/GraphQL)', 'Databases (SQL/NoSQL)', 'Caching & Message Queues', 'Security & JWT', 'Server Architectures'],
    keywords: ['Index', 'Schema', 'JWT', 'Encryption', 'Hashing', 'Redis', 'Kafka', 'SQL', 'MongoDB', 'PostgreSQL', 'Express', 'Node']
  },
  'mern developer': {
    categories: ['React & Client State', 'Node.js Event Loop', 'Express Middleware', 'MongoDB aggregation & Schemas', 'JWT Auth'],
    keywords: ['MERN', 'MongoDB', 'Express', 'React', 'Node', 'JSON', 'JWT', 'Middlewares', 'BSON', 'Aggregation', 'Redux']
  },
  'ai engineer': {
    categories: ['Machine Learning algorithms', 'Deep Learning & Neural Networks', 'LLMs & RAG Architectures', 'Vector Databases', 'Python (PyTorch/TensorFlow)'],
    keywords: ['Gemini', 'OpenAI', 'Transformer', 'Embedding', 'Vector', 'Prompt', 'RAG', 'Fine-tuning', 'PyTorch', 'TensorFlow']
  },
  'devops engineer': {
    categories: ['Docker Containerization', 'Kubernetes Orchestration', 'CI/CD Pipelines', 'Infrastructure as Code (Terraform)', 'Cloud Services (AWS/GCP)'],
    keywords: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'YAML', 'Pipeline', 'AWS', 'GCP', 'Helm']
  }
};

/**
 * Returns focus areas and topics for a specific role
 */
exports.getRoleExpectations = (roleName) => {
  const normRole = (roleName || '').toLowerCase().trim();
  
  let match = ROLE_MAPS[normRole];
  
  if (!match) {
    // Check substring match
    const key = Object.keys(ROLE_MAPS).find(k => normRole.includes(k) || k.includes(normRole));
    match = key ? ROLE_MAPS[key] : {
      categories: ['Core Programming', 'Object Oriented Programming', 'DBMS & SQL', 'Data Structures', 'Git & Workflows'],
      keywords: ['OOP', 'SQL', 'Algorithms', 'Git', 'Function', 'Variable', 'Debugging']
    };
  }

  return match;
};
