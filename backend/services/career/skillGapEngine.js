const { normalize } = require('./ruleEngine');

const CATEGORY_KEYWORDS = {
  Programming: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'ruby', 'rust', 'php', 'html', 'css', 'c', 'scala', 'kotlin', 'swift', 'sql', 'bash', 'shell'],
  Frameworks: ['react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'spring boot', 'rails', 'asp.net', 'next.js', 'nextjs', 'nestjs', 'svelte', 'laravel', 'fastapi', 'bootstrap', 'tailwind', 'jquery'],
  Databases: ['mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'sql server', 'oracle', 'cassandra', 'dynamodb', 'sqlite', 'mariadb', 'neo4j', 'firestore', 'firebase'],
  Cloud: ['aws', 'azure', 'gcp', 'google cloud', 'cloud', 'heroku', 'vercel', 'netlify'],
  DevOps: ['docker', 'kubernetes', 'jenkins', 'git', 'github', 'ci/cd', 'cicd', 'terraform', 'ansible', 'linux', 'nginx', 'apache'],
  AI: ['tensorflow', 'pytorch', 'machine learning', 'deep learning', 'ai', 'nlp', 'computer vision', 'scikit-learn', 'numpy', 'pandas', 'llm', 'prompt engineering'],
  'Soft Skills': ['communication', 'teamwork', 'leadership', 'problem solving', 'agile', 'scrum', 'critical thinking', 'presentation', 'management', 'collaboration', 'negotiation', 'adaptability']
};

const checkMatch = (text, keyword) => {
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const prefix = /^[a-zA-Z0-9]/.test(keyword) ? '\\b' : '';
  const suffix = /[a-zA-Z0-9]$/.test(keyword) ? '\\b' : '';
  const regex = new RegExp(prefix + escaped + suffix, 'i');
  return regex.test(text);
};

/**
 * Perform skill gap analysis between parsed resume/profile and target job description text.
 */
exports.analyzeSkillGap = (parsedData, userProfile, jdText) => {
  const resumeSkills = parsedData?.skills || [];
  const profileSkills = [
    ...(userProfile?.programmingLanguages || []),
    ...(userProfile?.frameworks || []),
    ...(userProfile?.databases || []),
    ...(userProfile?.tools || [])
  ];
  const candidateSkills = Array.from(new Set([
    ...resumeSkills.map(s => s.trim()),
    ...profileSkills.map(s => s.trim())
  ]));

  const candidateSkillsNorm = candidateSkills.map(s => normalize(s));

  const existingSkills = {};
  const missingSkills = {};
  const criticalSkills = {};
  const optionalSkills = {};

  const categories = Object.keys(CATEGORY_KEYWORDS);
  categories.forEach(cat => {
    existingSkills[cat] = [];
    missingSkills[cat] = [];
    criticalSkills[cat] = [];
    optionalSkills[cat] = [];
  });

  categories.forEach(cat => {
    const keywords = CATEGORY_KEYWORDS[cat];
    keywords.forEach(keyword => {
      if (checkMatch(jdText, keyword)) {
        const normKeyword = normalize(keyword);
        const isMatched = candidateSkillsNorm.some(cand => 
          cand === normKeyword || cand.includes(normKeyword) || normKeyword.includes(cand)
        );

        const displayKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);

        if (isMatched) {
          existingSkills[cat].push(displayKeyword);
        } else {
          missingSkills[cat].push(displayKeyword);
        }

        if (['Programming', 'Frameworks', 'Databases', 'Cloud'].includes(cat)) {
          criticalSkills[cat].push(displayKeyword);
        } else {
          optionalSkills[cat].push(displayKeyword);
        }
      }
    });
  });

  return {
    existingSkills,
    missingSkills,
    criticalSkills,
    optionalSkills
  };
};
