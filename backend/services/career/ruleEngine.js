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

  // Fallback default
  return 'Programming'; 
};

/**
 * Rule Engine - Reusable scoring engine
 */
exports.evaluateResume = (parsedData, userProfile, criteria = {}) => {
  // 1. Gather all candidate skills from parsed resume & user profile fields
  const resumeSkills = parsedData?.skills || [];
  const profileSkills = [
    ...(userProfile?.programmingLanguages || []),
    ...(userProfile?.frameworks || []),
    ...(userProfile?.databases || []),
    ...(userProfile?.tools || [])
  ];

  // Combine and deduplicate
  const allSkillsSet = new Set([
    ...resumeSkills.map(s => s.trim()),
    ...profileSkills.map(s => s.trim())
  ]);
  const candidateSkills = Array.from(allSkillsSet);

  // 2. Extract Experience details
  const resumeExperience = parsedData?.experience || [];
  const experienceLevel = userProfile?.experienceLevel || 'Student';
  
  // Calculate total months of experience from experience list if available
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

  // 3. Extract Education details
  const resumeEducation = parsedData?.education || [];
  const profileCgpa = userProfile?.cgpa || null;
  const profileCollege = userProfile?.college || '';
  const profileDegree = userProfile?.degree || '';

  // Get max CGPA from resume education or profile
  let cgpa = profileCgpa;
  resumeEducation.forEach(edu => {
    const text = (edu.gpa || edu.cgpa || edu.grade || '').toString();
    const match = text.match(/(\d+\.\d+)/);
    if (match) {
      const val = parseFloat(match[1]);
      if (val <= 10.0 && (!cgpa || val > cgpa)) cgpa = val;
    }
  });

  // 4. Extract Projects
  const resumeProjects = parsedData?.projects || [];

  // 5. Extract Certifications
  const resumeCertifications = parsedData?.certifications || [];

  // Define default factor weights if not specified
  const weights = criteria.weights || {
    skills: 0.30,
    projects: 0.20,
    experience: 0.15,
    education: 0.15,
    resumeQuality: 0.10,
    certifications: 0.10
  };

  const targetSkills = criteria.targetSkills || [];
  const targetMinYears = criteria.targetMinYears || 0;
  const targetMinCgpa = criteria.targetMinCgpa || 6.0;

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
      const isMatched = candidateSkills.some(cSkill => {
        const normC = normalize(cSkill);
        return normC === normT || normC.includes(normT) || normT.includes(normC);
      });
      if (isMatched) {
        matchedSkills.push(tSkill);
      } else {
        missingSkills.push(tSkill);
      }
    });

    const matchRatio = matchedSkills.length / targetSkills.length;
    skillsScore = Math.round(matchRatio * 100);
    skillsReasons.push(`Matched ${matchedSkills.length} out of ${targetSkills.length} required skills.`);
    if (missingSkills.length > 0) {
      skillsReasons.push(`Missing key target skills: ${missingSkills.slice(0, 3).join(', ')}.`);
    }
  } else {
    if (candidateSkills.length >= 10) skillsScore = 100;
    else if (candidateSkills.length >= 6) skillsScore = 80;
    else if (candidateSkills.length >= 3) skillsScore = 60;
    else if (candidateSkills.length > 0) skillsScore = 40;
    else skillsScore = 10;
    skillsReasons.push(`Inventory contains ${candidateSkills.length} skills.`);
  }

  // =====================================
  // FACTOR 2: PROJECTS SCORING (0-100)
  // =====================================
  let projectsScore = 0;
  let projectsReasons = [];
  const projectCount = resumeProjects.length;

  if (projectCount === 0) {
    projectsScore = 20;
    projectsReasons.push('No projects found in resume.');
  } else if (projectCount === 1) {
    projectsScore = 60;
    projectsReasons.push('1 project listed. Suggest adding at least 2-3 projects.');
  } else if (projectCount === 2) {
    projectsScore = 85;
    projectsReasons.push('2 projects listed. Good demonstration of practical applications.');
  } else {
    projectsScore = 100;
    projectsReasons.push(`${projectCount} projects listed. Excellent project portfolio.`);
  }

  // Bonus for complex project description keywords
  const complexityKeywords = ['scalable', 'optimized', 'performance', 'real-time', 'aws', 'docker', 'kubernetes', 'deployment', 'ml', 'ai', 'database', 'rest api', 'system design'];
  let complexCount = 0;
  resumeProjects.forEach(proj => {
    const text = normalize(`${proj.title || ''} ${proj.description || ''}`);
    complexityKeywords.forEach(word => {
      if (text.includes(word)) complexCount++;
    });
  });
  if (complexCount > 0 && projectsScore < 100) {
    projectsScore = Math.min(projectsScore + Math.min(complexCount * 5, 15), 100);
    projectsReasons.push('Detected project complexity (e.g., databases, deployment, or optimization).');
  }

  // =====================================
  // FACTOR 3: EXPERIENCE SCORING (0-100)
  // =====================================
  let experienceScore = 0;
  let experienceReasons = [];

  if (experienceLevel === 'Student' || experienceLevel === 'Fresher') {
    const hasInternship = resumeExperience.some(exp => 
      normalize(exp.role || exp.title || '').includes('intern') || 
      normalize(exp.description || '').includes('intern')
    );

    if (hasInternship) {
      experienceScore = 100;
      experienceReasons.push('Demonstrates relevant internship experience.');
    } else if (resumeExperience.length > 0) {
      experienceScore = 80;
      experienceReasons.push('Has general organizational or extracurricular experience.');
    } else {
      experienceScore = 50;
      experienceReasons.push('Entry-level baseline. Focus on building solid project portfolios.');
    }
  } else {
    if (experienceYears >= targetMinYears) {
      experienceScore = 100;
      experienceReasons.push(`Meets experience requirement (Has ${experienceYears.toFixed(1)} years vs target ${targetMinYears} years).`);
    } else if (experienceYears > 0) {
      const ratio = experienceYears / Math.max(targetMinYears, 1);
      experienceScore = Math.round(ratio * 100);
      experienceReasons.push(`Partial experience match: has ${experienceYears.toFixed(1)} years out of target ${targetMinYears} years.`);
    } else {
      experienceScore = 30;
      experienceReasons.push('Experienced role target, but parsed resume indicates limited work history.');
    }
  }

  // =====================================
  // FACTOR 4: EDUCATION SCORING (0-100)
  // =====================================
  let educationScore = 70;
  let educationReasons = [];

  if (cgpa) {
    let cgpaScore = 0;
    if (cgpa >= 9.0) {
      cgpaScore = 100;
      educationReasons.push(`Outstanding academic standing (CGPA: ${cgpa.toFixed(2)}).`);
    } else if (cgpa >= 8.0) {
      cgpaScore = 90;
      educationReasons.push(`Strong academic record (CGPA: ${cgpa.toFixed(2)}).`);
    } else if (cgpa >= 7.0) {
      cgpaScore = 80;
      educationReasons.push(`Satisfactory CGPA of ${cgpa.toFixed(2)}.`);
    } else {
      cgpaScore = 60;
      educationReasons.push(`Academic CGPA of ${cgpa.toFixed(2)}. Suggest focusing on skill showcases to balance academics.`);
    }
    
    if (cgpa >= targetMinCgpa) {
      educationScore = cgpaScore;
    } else {
      educationScore = Math.max(cgpaScore - 15, 40);
      educationReasons.push(`CGPA is below preferred target threshold of ${targetMinCgpa}.`);
    }
  } else {
    educationReasons.push('CGPA not specified on profile or resume. Defaulting to baseline academic scoring.');
  }

  const collegeStr = normalize(profileCollege || resumeEducation.map(edu => edu.institution || edu.school || '').join(' '));
  const tier1Keywords = ['iit', 'indian institute of technology', 'nit', 'national institute of technology', 'bits pilani', 'iiit', 'bits', 'dtu', 'nsut', 'rvce', 'vit', 'srm', 'mit', 'stanford'];
  const isTier1 = tier1Keywords.some(keyword => collegeStr.includes(keyword));
  if (isTier1) {
    educationScore = Math.min(educationScore + 10, 100);
    educationReasons.push('Affiliated with a recognized tier-1 / tier-2 institution.');
  }

  const degreeStr = normalize(profileDegree || resumeEducation.map(edu => edu.degree || '').join(' '));
  if (degreeStr.includes('mtech') || degreeStr.includes('ms') || degreeStr.includes('phd') || degreeStr.includes('master')) {
    educationScore = Math.min(educationScore + 5, 100);
    educationReasons.push('Advanced post-graduate degree identified.');
  }

  // =====================================
  // FACTOR 5: RESUME QUALITY (0-100)
  // =====================================
  let qualityScore = 0;
  let qualityReasons = [];
  
  const sectionChecks = [
    { name: 'Education', present: resumeEducation.length > 0, weight: 15 },
    { name: 'Skills', present: resumeSkills.length > 0, weight: 15 },
    { name: 'Projects', present: resumeProjects.length > 0, weight: 15 },
    { name: 'Experience', present: resumeExperience.length > 0, weight: 15 },
    { name: 'Summary', present: !!parsedData?.summary, weight: 10 },
    { name: 'Contact Information', present: !!parsedData?.personalInformation?.email && !!parsedData?.personalInformation?.phone, weight: 15 },
    { name: 'Social Links', present: !!(userProfile?.github || userProfile?.linkedin || parsedData?.links?.length > 0), weight: 15 }
  ];

  let calculatedQuality = 0;
  const missingSections = [];
  sectionChecks.forEach(chk => {
    if (chk.present) {
      calculatedQuality += chk.weight;
    } else {
      missingSections.push(chk.name);
    }
  });

  qualityScore = calculatedQuality;
  const confidenceMultiplier = (parsedData?.metadata?.confidence || parsedData?.parsingConfidence || 85) / 100;
  qualityScore = Math.round(qualityScore * (0.8 + 0.2 * confidenceMultiplier));

  if (missingSections.length === 0) {
    qualityReasons.push('All major professional resume sections are present and structured.');
  } else {
    qualityReasons.push(`Missing structural elements: ${missingSections.join(', ')}.`);
  }

  // =====================================
  // FACTOR 6: CERTIFICATIONS SCORING (0-100)
  // =====================================
  let certificationsScore = 0;
  let certificationsReasons = [];
  const certCount = resumeCertifications.length;

  if (certCount === 0) {
    certificationsScore = 40;
    certificationsReasons.push('No certifications listed. Certifications add competitive credibility.');
  } else if (certCount === 1) {
    certificationsScore = 80;
    certificationsReasons.push('1 certification verified.');
  } else {
    certificationsScore = 100;
    certificationsReasons.push(`${certCount} professional certifications verified.`);
  }

  const certText = normalize(resumeCertifications.map(c => c.name || c.title || c).join(' '));
  const premiumCertKeywords = ['aws', 'azure', 'gcp', 'google cloud', 'salesforce', 'certified developer', 'scrum master', 'kubernetes', 'tensorflow', 'pmp', 'cisco', 'ccna'];
  const hasPremium = premiumCertKeywords.some(kw => certText.includes(kw));
  if (hasPremium) {
    certificationsScore = Math.min(certificationsScore + 10, 100);
    certificationsReasons.push('Holds industry-recognized specialized cloud or technology credentials.');
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
