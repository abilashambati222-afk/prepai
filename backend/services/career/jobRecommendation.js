const { normalize } = require('./ruleEngine');

const ROLE_PROFILES = [
  {
    role: 'Frontend Developer',
    targetSkills: ['javascript', 'typescript', 'react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'next.js', 'nextjs', 'svelte', 'frontend', 'ui/ux'],
    reasonsKey: 'frontend web technologies (React, JavaScript, HTML/CSS)'
  },
  {
    role: 'Backend Developer',
    targetSkills: ['node.js', 'nodejs', 'express', 'python', 'django', 'flask', 'java', 'spring boot', 'go', 'golang', 'postgresql', 'postgres', 'mongodb', 'apis', 'rest api', 'sql', 'backend'],
    reasonsKey: 'backend engineering (Node.js, databases, REST APIs)'
  },
  {
    role: 'Full Stack Developer',
    targetSkills: ['react', 'node.js', 'nodejs', 'express', 'mongodb', 'sql', 'javascript', 'typescript', 'next.js', 'nextjs', 'html', 'css', 'apis'],
    reasonsKey: 'end-to-end full-stack architecture (React, Node.js, databases)'
  },
  {
    role: 'Data Scientist',
    targetSkills: ['python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'sql', 'data analysis', 'statistics', 'scikit-learn'],
    reasonsKey: 'data science, machine learning, and statistical analysis'
  },
  {
    role: 'Machine Learning Engineer',
    targetSkills: ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'ai', 'nlp', 'computer vision', 'keras', 'llm', 'neural networks'],
    reasonsKey: 'artificial intelligence models and neural networks (PyTorch, TensorFlow)'
  },
  {
    role: 'DevOps Engineer',
    targetSkills: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'cicd', 'terraform', 'ansible', 'linux', 'bash', 'git', 'devops'],
    reasonsKey: 'infrastructure orchestration, CI/CD pipelines, and cloud hosting'
  },
  {
    role: 'Mobile App Developer',
    targetSkills: ['swift', 'kotlin', 'java', 'flutter', 'react native', 'ios', 'android', 'mobile', 'dart', 'xcode'],
    reasonsKey: 'mobile application frameworks (Flutter, Swift, Kotlin, React Native)'
  },
  {
    role: 'QA Automation Engineer',
    targetSkills: ['selenium', 'jest', 'cypress', 'testing', 'quality assurance', 'qa', 'manual testing', 'automation', 'playwright', 'unit testing'],
    reasonsKey: 'test automation suites and quality control checkers'
  },
  {
    role: 'Data Engineer',
    targetSkills: ['sql', 'python', 'spark', 'hadoop', 'etl', 'data warehousing', 'bigquery', 'snowflake', 'airflow', 'scala', 'data pipelines'],
    reasonsKey: 'data pipelines, warehousing, and ETL transformations (SQL, Spark)'
  },
  {
    role: 'Product Manager',
    targetSkills: ['product management', 'agile', 'scrum', 'leadership', 'communication', 'user experience', 'roadmapping', 'business analysis', 'analytics', 'management'],
    reasonsKey: 'product leadership, Scrum execution, and business strategy'
  }
];

/**
 * Predicts the top 5 job roles based on skills, projects, education, and experience.
 */
exports.recommendJobs = (parsedData, userProfile) => {
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

  const projectsText = (parsedData?.projects || []).map(p => `${p.title || ''} ${p.description || ''}`).join(' ');
  const experienceText = (parsedData?.experience || []).map(e => `${e.title || e.role || ''} ${e.description || ''}`).join(' ');
  const fullTextNorm = normalize(`${projectsText} ${experienceText} ${userProfile?.targetRole || ''}`);

  const scoredRoles = ROLE_PROFILES.map(profile => {
    let score = 0;
    const reasons = [];

    const matchingSkills = [];
    profile.targetSkills.forEach(skill => {
      const normS = normalize(skill);
      const isMatched = candidateSkillsNorm.some(cand => cand === normS || cand.includes(normS) || normS.includes(cand));
      if (isMatched) {
        matchingSkills.push(skill);
      }
    });

    const skillRatio = matchingSkills.length / Math.min(profile.targetSkills.length, 6);
    const skillScore = Math.min(skillRatio * 50, 50);
    score += skillScore;

    if (matchingSkills.length > 0) {
      reasons.push(`Matched ${matchingSkills.length} key skills: ${matchingSkills.slice(0, 4).join(', ')}.`);
    }

    let projectMatchCount = 0;
    profile.targetSkills.forEach(skill => {
      if (fullTextNorm.includes(normalize(skill))) {
        projectMatchCount++;
      }
    });
    const projectScore = Math.min((projectMatchCount / 5) * 30, 30);
    score += projectScore;
    if (projectMatchCount > 2) {
      reasons.push(`Demonstrated implementation of related tools in project history.`);
    }

    let roleAlignScore = 0;
    const targetRoleNorm = normalize(userProfile?.targetRole || '');
    if (targetRoleNorm && targetRoleNorm.includes(normalize(profile.role.replace('Developer', '').replace('Engineer', '')))) {
      roleAlignScore = 20;
      reasons.push(`Direct alignment with your declared target role: ${userProfile.targetRole}.`);
    } else {
      roleAlignScore = Math.min(skillRatio * 20, 20);
    }
    score += roleAlignScore;

    reasons.push(`High affinity with ${profile.reasonsKey}.`);

    const finalScore = Math.round(score);

    return {
      role: profile.role,
      score: finalScore,
      matchPercentage: finalScore,
      reasons: reasons.slice(0, 3)
    };
  });

  return scoredRoles
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
