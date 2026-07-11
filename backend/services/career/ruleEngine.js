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
  const profileDegree = userProfile?.degree || '';

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

  // 4. Retrieve Advanced Hiring Categories from criteria
  const targetSkills = criteria.targetSkills || [];
  const targetMinCgpa = criteria.targetMinCgpa || 6.0;
  const targetMinYears = criteria.targetMinYears || 0;
  
  const internshipPreferred = criteria.internshipPreferred || false;
  const openSourcePreferred = criteria.openSourcePreferred || false;
  const systemDesignRequired = criteria.systemDesignRequired || false;
  const dsaLevel = criteria.dsaLevel || 'Easy';
  const communicationWeight = criteria.communicationWeight || 5;
  const leadershipWeight = criteria.leadershipWeight || 2;

  // Weights configuration
  const weights = criteria.weights || {
    skills: 0.30,
    projects: 0.20,
    experience: 0.15,
    education: 0.15,
    resumeQuality: 0.10,
    certifications: 0.10
  };

  // =====================================
  // FACTOR 1: SKILLS SCORING (0-100)
  // =====================================
  let skillsScore = 0;
  let skillsReasons = [];

  if (targetSkills.length > 0) {
    const matchedSkills = [];
    const missingSkills = [];
    targetSkills.forEach(tSkill => {
      const normT = normalize(tSkill);
      const isMatched = candidateSkillsNorm.some(cand => cand === normT || cand.includes(normT) || normT.includes(cand));
      if (isMatched) matchedSkills.push(tSkill);
      else missingSkills.push(tSkill);
    });

    const matchRatio = matchedSkills.length / targetSkills.length;
    skillsScore = Math.round(matchRatio * 100);
    skillsReasons.push(`Matched ${matchedSkills.length} out of ${targetSkills.length} required skill keywords.`);
  } else {
    skillsScore = candidateSkills.length >= 10 ? 100 : candidateSkills.length >= 6 ? 80 : 50;
    skillsReasons.push(`Inventory lists ${candidateSkills.length} skill tags.`);
  }

  // DSA Check
  const dsaKeywords = {
    Advanced: ['dynamic programming', 'graph', 'tree', 'trie', 'backtracking', 'dsa', 'recursion', 'linked list', 'bst', ' heap'],
    Medium: ['sorting', 'searching', 'stack', 'queue', 'hash table', 'array', 'string'],
    Easy: ['array', 'string', 'loop', 'variables']
  };

  const currentDsaKeywords = dsaKeywords[dsaLevel];
  let dsaMatchCount = 0;
  currentDsaKeywords.forEach(kw => {
    if (fullResumeText.includes(kw)) dsaMatchCount++;
  });

  const dsaTargetCount = dsaLevel === 'Advanced' ? 3 : dsaLevel === 'Medium' ? 2 : 1;
  if (dsaMatchCount < dsaTargetCount) {
    skillsScore = Math.max(skillsScore - 15, 30);
    skillsReasons.push(`Requires ${dsaLevel} Data Structures & Algorithms proficiency (DP, Graphs, Trees).`);
  } else {
    skillsScore = Math.min(skillsScore + 5, 100);
    skillsReasons.push(`Meets ${dsaLevel}-level DSA requirements.`);
  }

  // Open Source Bonus
  if (openSourcePreferred) {
    const hasOpenSource = ['open source', 'open-source', 'contributor', 'github contribution', 'pr submission'].some(kw => fullResumeText.includes(kw));
    if (hasOpenSource) {
      skillsScore = Math.min(skillsScore + 10, 100);
      skillsReasons.push('Detected community or open-source participation.');
    } else {
      skillsScore = Math.max(skillsScore - 5, 20);
      skillsReasons.push('Prefers developers with open-source project history.');
    }
  }

  // =====================================
  // FACTOR 2: PROJECTS SCORING (0-100)
  // =====================================
  let projectsScore = 50;
  let projectsReasons = [];
  const projectCount = resumeProjects.length;

  if (projectCount >= 3) {
    projectsScore = 100;
    projectsReasons.push('Excellent quantity of developer projects.');
  } else if (projectCount === 2) {
    projectsScore = 80;
    projectsReasons.push('Lists 2 developer projects.');
  } else if (projectCount === 1) {
    projectsScore = 60;
    projectsReasons.push('Suggest adding at least 2-3 detailed project blocks.');
  } else {
    projectsScore = 20;
    projectsReasons.push('Missing projects section.');
  }

  // System Design Check
  if (systemDesignRequired) {
    const hasSysDesign = ['system design', 'architecture', 'scalability', 'microservices', 'load balancer', 'caching', 'redis', 'kafka', 'docker', 'kubernetes'].some(kw => fullResumeText.includes(kw));
    if (hasSysDesign) {
      projectsScore = Math.min(projectsScore + 5, 100);
      projectsReasons.push('Verified systems engineering or architecture keywords.');
    } else {
      projectsScore = Math.max(projectsScore - 15, 30);
      projectsReasons.push('Requires system design understanding (Scalability, Caching, Docker).');
    }
  }

  // =====================================
  // FACTOR 3: EXPERIENCE SCORING (0-100)
  // =====================================
  let experienceScore = 50;
  let experienceReasons = [];

  const hasInternship = resumeExperience.some(exp => 
    normalize(exp.role || exp.title || '').includes('intern') || 
    normalize(exp.description || '').includes('intern')
  );

  if (experienceLevel === 'Student' || experienceLevel === 'Fresher') {
    if (internshipPreferred) {
      if (hasInternship) {
        experienceScore = 100;
        experienceReasons.push('Matches internship target preference.');
      } else {
        experienceScore = 60;
        experienceReasons.push('Prefers candidates with at least one internship profile.');
      }
    } else {
      experienceScore = hasInternship ? 100 : 80;
      experienceReasons.push('Meets entry-level criteria.');
    }
  } else {
    if (experienceYears >= targetMinYears) {
      experienceScore = 100;
      experienceReasons.push(`Meets experience target: has ${experienceYears.toFixed(1)} yrs vs target ${targetMinYears} yrs.`);
    } else {
      const ratio = experienceYears / Math.max(targetMinYears, 1);
      experienceScore = Math.round(ratio * 100);
      experienceReasons.push(`Partial experience match: lists ${experienceYears.toFixed(1)} out of target ${targetMinYears} years.`);
    }
  }

  // =====================================
  // FACTOR 4: EDUCATION SCORING (0-100)
  // =====================================
  let educationScore = 70;
  let educationReasons = [];

  if (cgpa) {
    let cgpaScore = cgpa >= 9.0 ? 100 : cgpa >= 8.0 ? 90 : cgpa >= 7.0 ? 85 : 65;
    if (cgpa >= targetMinCgpa) {
      educationScore = cgpaScore;
      educationReasons.push(`Academic CGPA of ${cgpa.toFixed(2)} meets criteria.`);
    } else {
      educationScore = Math.max(cgpaScore - 15, 40);
      educationReasons.push(`CGPA is below preferred threshold of ${targetMinCgpa}.`);
    }
  } else {
    educationReasons.push('CGPA not specified.');
  }

  const collegeStr = normalize(profileCollege || resumeEducation.map(e => e.institution || e.school || '').join(' '));
  const isTier1 = ['iit', 'nit', 'bits', 'iiit', 'vit', 'dtu', 'stanford', 'mit'].some(kw => collegeStr.includes(kw));
  if (isTier1) {
    educationScore = Math.min(educationScore + 10, 100);
    educationReasons.push('Tier-1 university credential boost.');
  }

  // =====================================
  // FACTOR 5: RESUME QUALITY & SOFT SKILLS (0-100)
  // =====================================
  let qualityScore = 70;
  let qualityReasons = [];

  // soft skills matching using weights
  const softSkills = candidateSkillsNorm.filter(s => {
    return ['communication', 'teamwork', 'leadership', 'scrum', 'agile', 'management'].some(kw => s.includes(kw));
  });

  const softSkillsScore = Math.min((softSkills.length / 2) * 100, 100);
  const softSkillsImpact = (softSkillsScore * (communicationWeight + leadershipWeight)) / 15;
  qualityScore = Math.round((qualityScore * 0.7) + (softSkillsImpact * 0.3));

  qualityReasons.push(`Soft skills evaluation (Communication weight: ${communicationWeight}, Leadership: ${leadershipWeight}).`);

  // =====================================
  // FACTOR 6: CERTIFICATIONS SCORING (0-100)
  // =====================================
  let certificationsScore = 40;
  let certificationsReasons = [];
  if (parsedData?.certifications?.length > 0) {
    certificationsScore = 100;
    certificationsReasons.push(`Validated ${parsedData.certifications.length} credentials.`);
  } else {
    certificationsReasons.push('No certifications listed. Cloud credentials recommended.');
  }

  // =====================================
  // FINAL SCORE COMPUTATION
  // =====================================
  const overallScore = Math.round(
    (skillsScore * weights.skills) +
    (projectsScore * weights.projects) +
    (experienceScore * weights.experience) +
    (educationScore * weights.education) +
    (qualityScore * weights.resumeQuality) +
    (certificationsScore * weights.certifications)
  );

  return {
    overallScore: Math.min(Math.max(overallScore, 0), 100),
    factors: {
      skills: { score: skillsScore, reasons: skillsReasons },
      projects: { score: projectsScore, reasons: projectsReasons },
      experience: { score: experienceScore, reasons: experienceReasons },
      education: { score: educationScore, reasons: educationReasons },
      resumeQuality: { score: qualityScore, reasons: qualityReasons },
      certifications: { score: certificationsScore, reasons: certificationsReasons }
    }
  };
};

exports.normalize = normalize;
exports.categorizeSkill = categorizeSkill;
