/**
 * Normalizes a string for robust keyword comparison
 */
const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9+#.\s]/g, '').trim();
};

/**
 * Categorize a skill into one of the 7 predefined categories
 */
const categorizeSkill = (skillName) => {
  const normSkill = normalize(skillName);
  
  const categories = {
    Programming: ['javascript', 'js', 'typescript', 'ts', 'python', 'py', 'java', 'c++', 'cpp', 'c#', 'csharp', 'go', 'golang', 'ruby', 'rust', 'php', 'html', 'css', 'c', 'scala', 'kotlin', 'swift', 'sql', 'bash', 'shell'],
    Frameworks: ['react', 'react.js', 'reactjs', 'angular', 'vue', 'node', 'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'spring', 'spring boot', 'rails', 'asp.net', 'next.js', 'nextjs', 'nestjs', 'svelte', 'laravel', 'fastapi', 'bootstrap', 'tailwind', 'jquery'],
    Databases: ['mongodb', 'mongo', 'postgresql', 'postgres', 'mysql', 'redis', 'sql server', 'oracle', 'cassandra', 'dynamodb', 'sqlite', 'mariadb', 'neo4j', 'firestore', 'firebase'],
    Cloud: ['aws', 'azure', 'gcp', 'google cloud', 'cloud', 'heroku', 'vercel', 'netlify', 'cloudfront', 's3', 'ec2', 'lambda'],
    DevOps: ['docker', 'kubernetes', 'k8s', 'jenkins', 'git', 'github', 'github actions', 'ci/cd', 'cicd', 'terraform', 'ansible', 'linux', 'nginx', 'apache', 'prometheus', 'grafana'],
    AI: ['tensorflow', 'pytorch', 'machine learning', 'ml', 'deep learning', 'dl', 'ai', 'nlp', 'computer vision', 'scikit-learn', 'sklearn', 'numpy', 'pandas', 'llm', 'prompt engineering', 'artificial intelligence', 'keras', 'nltk', 'opencv'],
    SoftSkills: ['communication', 'teamwork', 'leadership', 'problem solving', 'agile', 'scrum', 'critical thinking', 'presentation', 'management', 'collaboration', 'negotiation', 'adaptability']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => normSkill === k || normSkill.includes(k))) {
      return category === 'SoftSkills' ? 'Soft Skills' : category;
    }
  }

  return 'Programming'; 
};

/**
 * Heuristic readability metric based on average sentence and word lengths
 */
const calculateReadability = (text) => {
  if (!text) return 70;
  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (words.length === 0 || sentences.length === 0) return 70;
  
  const avgSentenceLength = words.length / sentences.length;
  
  let score = 100;
  if (avgSentenceLength > 20) {
    score -= (avgSentenceLength - 20) * 3;
  } else if (avgSentenceLength < 10) {
    score -= (10 - avgSentenceLength) * 2;
  }
  
  const totalChars = words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const avgWordLength = totalChars / words.length;
  if (avgWordLength > 6) {
    score -= (avgWordLength - 6) * 10;
  }
  
  return Math.round(Math.min(Math.max(score, 30), 100));
};

/**
 * Completeness metric based on identified sections
 */
const calculateCompleteness = (sectionsFound = []) => {
  const criticalSections = ['summary', 'education', 'skills', 'projects', 'experience'];
  const optionalSections = ['certifications', 'languages', 'achievements'];
  
  const criticalCount = criticalSections.filter(s => sectionsFound.includes(s)).length;
  const optionalCount = optionalSections.filter(s => sectionsFound.includes(s)).length;
  
  const score = (criticalCount * 16) + (optionalCount * 6.66);
  return Math.round(Math.min(score, 100));
};

/**
 * Rule Engine - Premium scoring calculations based on advanced hiring categories
 */
exports.evaluateResume = (parsedData, userProfile, criteria = {}) => {
  // 1. Compile Skills
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

  // 2. Extract Work History & Projects
  const resumeExperience = parsedData?.experience || [];
  const experienceLevel = userProfile?.experienceLevel || 'Student';
  const resumeProjects = parsedData?.projects || [];
  
  let experienceMonths = 0;
  resumeExperience.forEach(exp => {
    const durationStr = exp.duration || exp.dateRange || '';
    if (durationStr) {
      const yrMatch = durationStr.match(/(\d+)\s*(yr|year)/i);
      const moMatch = durationStr.match(/(\d+)\s*(mo|month)/i);
      if (yrMatch) experienceMonths += parseInt(yrMatch[1]) * 12;
      if (moMatch) experienceMonths += parseInt(moMatch[1]);
    }
  });
  const experienceYears = experienceMonths / 12;

  // 3. Extract Education
  const resumeEducation = parsedData?.education || [];
  const profileCgpa = userProfile?.cgpa || null;
  const profileCollege = userProfile?.college || '';

  let cgpa = profileCgpa;
  resumeEducation.forEach(edu => {
    const text = (edu.gpa || edu.cgpa || edu.grade || '').toString();
    const match = text.match(/(\d+\.\d+)/);
    if (match) {
      const val = parseFloat(match[1]);
      if (val <= 10.0 && (!cgpa || val > cgpa)) cgpa = val;
    }
  });

  const fullResumeText = normalize(JSON.stringify(parsedData));

  // 4. Retrieve criteria
  const targetSkills = criteria.targetSkills || [];
  const targetMinYears = criteria.targetMinYears || 0;
  
  const systemDesignRequired = criteria.systemDesignRequired || false;
  const dsaLevel = criteria.dsaLevel || 'Easy';

  // =====================================
  // 1. Contact Information Score (10% Weight)
  // =====================================
  const emailFound = !!parsedData.personalInformation?.email;
  const phoneFound = !!parsedData.personalInformation?.phone;
  const linkedinFound = !!(parsedData.links?.linkedin || userProfile?.linkedin);
  const githubFound = !!(parsedData.links?.github || userProfile?.github);
  
  const contactScore = Math.round(
    (emailFound ? 25 : 0) +
    (phoneFound ? 25 : 0) +
    (linkedinFound ? 25 : 0) +
    (githubFound ? 25 : 0)
  );

  // =====================================
  // 2. Education Score (10% Weight)
  // =====================================
  let eduScore = 50;
  if (cgpa) {
    if (cgpa >= 9.0) eduScore = 80;
    else if (cgpa >= 8.0) eduScore = 70;
    else if (cgpa >= 7.0) eduScore = 60;
    else eduScore = 50;
  }
  const collegeStr = normalize(profileCollege || resumeEducation.map(e => e.institution || e.school || '').join(' '));
  const isTier1 = ['iit', 'nit', 'bits', 'iiit', 'vit', 'dtu', 'stanford', 'mit'].some(kw => collegeStr.includes(kw));
  if (isTier1) {
    eduScore = Math.min(eduScore + 20, 100);
  }
  const eduItems = parsedData.education || [];
  if (eduItems.length > 0) {
    eduScore = Math.min(eduScore + 10, 100);
  }

  // =====================================
  // 3. Experience Score (20% Weight)
  // =====================================
  let experienceScore = 50;
  const hasInternship = resumeExperience.some(exp => 
    normalize(exp.role || exp.title || '').includes('intern') || 
    normalize(exp.description || '').includes('intern')
  );

  if (experienceLevel === 'Student' || experienceLevel === 'Fresher') {
    experienceScore = hasInternship ? 100 : 70;
  } else {
    if (experienceYears >= targetMinYears) {
      experienceScore = 100;
    } else {
      experienceScore = Math.max(40, Math.round((experienceYears / Math.max(targetMinYears, 1)) * 100));
    }
  }

  // =====================================
  // 4. Projects Score (20% Weight)
  // =====================================
  let projectsScore = 10;
  const projectCount = resumeProjects.length;
  if (projectCount >= 3) projectsScore = 80;
  else if (projectCount === 2) projectsScore = 60;
  else if (projectCount === 1) projectsScore = 40;

  const hasSysDesign = ['system design', 'architecture', 'scalability', 'microservices', 'load balancer', 'caching', 'redis', 'kafka', 'docker', 'kubernetes'].some(kw => fullResumeText.includes(kw));
  if (hasSysDesign) {
    projectsScore = Math.min(projectsScore + 20, 100);
  }

  // =====================================
  // 5. Skills Score (20% Weight)
  // =====================================
  let skillScoreVal = 40;
  const backendCount = candidateSkillsNorm.filter(s => 
    ['node', 'express', 'django', 'flask', 'spring', 'spring boot', 'rails', 'asp.net', 'nestjs', 'fastapi', 'laravel', 'mongodb', 'postgres', 'mysql', 'redis', 'sql server', 'oracle', 'sqlite', 'database', 'sql', 'python', 'java', 'c++', 'go', 'ruby', 'rust'].some(k => s.includes(k))
  ).length;
  const cloudCount = candidateSkillsNorm.filter(s => 
    ['aws', 'azure', 'gcp', 'google cloud', 'cloud', 'heroku', 'vercel', 'netlify', 'docker', 'kubernetes', 'k8s', 'jenkins', 'terraform', 'ansible', 'ci/cd', 'cicd'].some(k => s.includes(k))
  ).length;
  const frontendCount = candidateSkillsNorm.filter(s => 
    ['react', 'angular', 'vue', 'next.js', 'svelte', 'bootstrap', 'tailwind', 'html', 'css', 'javascript', 'typescript', 'jquery', 'frontend'].some(k => s.includes(k))
  ).length;

  if (backendCount > 0) skillScoreVal += 20;
  if (cloudCount > 0) skillScoreVal += 20;
  if (frontendCount > 0) skillScoreVal += 10;
  if (candidateSkills.length >= 8) skillScoreVal = Math.min(skillScoreVal + 10, 100);

  // DSA Boost
  const dsaKeywords = {
    Advanced: ['dynamic programming', 'graph', 'tree', 'trie', 'backtracking', 'dsa', 'recursion', 'linked list', 'bst', 'heap'],
    Medium: ['sorting', 'searching', 'stack', 'queue', 'hash table', 'array', 'string'],
    Easy: ['array', 'string', 'loop', 'variables']
  };
  const currentDsaKeywords = dsaKeywords[dsaLevel] || dsaKeywords.Easy;
  let dsaMatchCount = 0;
  currentDsaKeywords.forEach(kw => {
    if (fullResumeText.includes(kw)) dsaMatchCount++;
  });
  if (dsaMatchCount > 0) {
    skillScoreVal = Math.min(skillScoreVal + 10, 100);
  }

  // =====================================
  // 6. Formatting Score (10% Weight)
  // =====================================
  const hasBullets = /[\u2022\u25E6\u2043\u2219\u25AA*-]\s/.test(fullResumeText) || fullResumeText.includes('•') || fullResumeText.includes('*');
  const actionVerbsList = ['led', 'developed', 'designed', 'implemented', 'managed', 'built', 'created', 'optimized', 'engineered', 'architected', 'spearheaded', 'drove', 'improved', 'achieved', 'delivered'];
  const hasActionVerbs = actionVerbsList.some(verb => {
    const regex = new RegExp('\\b' + verb + 's?\\b|\\b' + verb + 'd\\b', 'i');
    return regex.test(fullResumeText);
  });

  const formattingScore = Math.round(
    (hasBullets ? 50 : 0) +
    (hasActionVerbs ? 50 : 0)
  );

  // =====================================
  // 7. Keywords Score (10% Weight)
  // =====================================
  let keywordScore = 75; // Default if targetSkills aren't set
  if (targetSkills.length > 0) {
    const matchedTargetCount = targetSkills.filter(tSkill => 
      candidateSkillsNorm.some(cand => cand === normalize(tSkill) || cand.includes(normalize(tSkill)) || normalize(tSkill).includes(cand))
    ).length;
    keywordScore = Math.round((matchedTargetCount / targetSkills.length) * 100);
  }

  // =====================================
  // ATS SCORE COMPUTATION
  // =====================================
  const overallScore = Math.round(
    (contactScore * 0.1) +
    (eduScore * 0.1) +
    (experienceScore * 0.2) +
    (projectsScore * 0.2) +
    (skillScoreVal * 0.2) +
    (formattingScore * 0.1) +
    (keywordScore * 0.1)
  );

  // Compile ATS Checklist
  const eduItemsExist = eduItems.length > 0;
  const projectsExist = projectCount > 0;
  const skillsExist = candidateSkills.length > 0;
  const certItems = parsedData.certifications || [];
  const certificationsMissing = certItems.length === 0;
  const portfolioMissing = !(parsedData.links?.portfolio || userProfile?.portfolio);
  const achItems = parsedData.achievements || [];
  const achievementsMissing = achItems.length === 0;

  const atsChecklist = {
    emailFound,
    phoneFound,
    linkedinFound,
    githubFound,
    educationFound: eduItemsExist,
    projectsFound: projectsExist,
    skillsFound: skillsExist,
    bulletPointsFound: hasBullets,
    actionVerbsFound: hasActionVerbs,
    certificationsMissing,
    portfolioMissing,
    achievementsMissing
  };

  // Section scores for display
  const summaryText = parsedData.summary || '';
  const summaryScore = summaryText.length > 120 ? 100 : summaryText.length > 50 ? 75 : summaryText.length > 10 ? 40 : 0;
  const certScore = certItems.length >= 2 ? 100 : certItems.length === 1 ? 70 : 0;
  const achScore = achItems.length >= 2 ? 100 : achItems.length === 1 ? 70 : 0;

  const sectionScores = {
    contactInformation: contactScore,
    summary: summaryScore,
    education: eduItemsExist ? eduScore : 0,
    projects: projectsExist ? projectsScore : 0,
    experience: resumeExperience.length > 0 ? experienceScore : 0,
    skills: skillsExist ? skillScoreVal : 0,
    certifications: certScore,
    achievements: achScore
  };

  // Readability & Completeness
  const sectionsFound = parsedData.metadata?.sectionsFound || Object.keys(sectionScores).filter(k => sectionScores[k] > 0);
  const completeness = calculateCompleteness(sectionsFound);
  const readability = calculateReadability(fullResumeText);

  // =====================================
  // MULTI-DIMENSIONAL RESUME HEALTH INDEX
  // =====================================
  const linksCompleteness = Math.round(
    (emailFound ? 25 : 0) +
    (phoneFound ? 25 : 0) +
    (linkedinFound ? 25 : 0) +
    (!portfolioMissing ? 25 : 0)
  );

  let healthScore = Math.round(
    (overallScore * 0.4) +
    (completeness * 0.3) +
    (readability * 0.2) +
    (linksCompleteness * 0.1)
  );

  // Missing Critical Sections Penalty
  const criticalSections = ['summary', 'education', 'skills', 'projects', 'experience'];
  criticalSections.forEach(sec => {
    if (!sectionsFound.includes(sec)) {
      healthScore = Math.max(0, healthScore - 10);
    }
  });

  // Broken / Invalid Links check (deduct 10 points per invalid social/link string)
  const validateLink = (link) => {
    if (!link) return true;
    return link.startsWith('http://') || link.startsWith('https://') || link.includes('linkedin.com') || link.includes('github.com');
  };
  if (parsedData.links?.linkedin && !validateLink(parsedData.links.linkedin)) healthScore = Math.max(0, healthScore - 10);
  if (parsedData.links?.github && !validateLink(parsedData.links.github)) healthScore = Math.max(0, healthScore - 10);
  if (parsedData.links?.portfolio && !validateLink(parsedData.links.portfolio)) healthScore = Math.max(0, healthScore - 10);

  let resumeHealth = 'Average';
  if (healthScore >= 95) resumeHealth = 'Excellent';
  else if (healthScore >= 80) resumeHealth = 'Good';
  else if (healthScore >= 65) resumeHealth = 'Average';
  else if (healthScore >= 50) resumeHealth = 'Needs Improvement';
  else resumeHealth = 'Poor';

  const resumeQuality = Math.round((overallScore * 0.4) + (completeness * 0.3) + (readability * 0.3));

  return {
    overallScore,
    atsScore: overallScore,
    resumeHealth,
    resumeQuality,
    readability,
    completeness,
    sectionScores,
    atsChecklist,
    factors: {
      skills: { score: skillScoreVal, points: Math.round(skillScoreVal * 0.4), max: 40, reasons: [] },
      projects: { score: projectsScore, points: Math.round(projectsScore * 0.2), max: 20, reasons: [] },
      resume: { score: resumeQuality, points: Math.round(resumeQuality * 0.1), max: 10, reasons: [] },
      resumeQuality: { score: resumeQuality, points: Math.round(resumeQuality * 0.1), max: 10, reasons: [] },
      education: { score: eduScore, points: Math.round(eduScore * 0.1), max: 10, reasons: [] },
      certifications: { score: certScore, points: Math.round(certScore * 0.1), max: 10, reasons: [] },
      communication: { score: readability, points: Math.round(readability * 0.1), max: 10, reasons: [] },
      experience: { score: experienceScore, points: Math.round(experienceScore * 0.1), max: 10, reasons: [] }
    }
  };
};

exports.normalize = normalize;
exports.categorizeSkill = categorizeSkill;
