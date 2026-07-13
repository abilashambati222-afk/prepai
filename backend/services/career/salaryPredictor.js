/**
 * Deterministic salary prediction service (Hybrid) with factor transparency and confidence rationales.
 */
exports.predictSalary = (parsedData, userProfile, careerScore = 0, geminiExplanation = '') => {
  const experienceLevel = userProfile?.experienceLevel || 'Student';
  
  // Check college tier
  const college = (userProfile?.college || '').toLowerCase();
  const isTier1 = ['iit', 'nit', 'bits', 'iiit', 'mit', 'stanford'].some(kw => college.includes(kw));

  // Count skills
  const skillsCount = (parsedData?.skills || []).length;

  let currentSalaryMin = 3.5;
  let currentSalaryMax = 6.0;

  if (experienceLevel === 'Experienced') {
    currentSalaryMin = 7.0;
    currentSalaryMax = 12.0;
  }

  // Apply academic bonuses
  if (isTier1) {
    currentSalaryMin += 2.5;
    currentSalaryMax += 4.0;
  }

  // Apply skills bonuses
  if (skillsCount > 10) {
    currentSalaryMin += 1.0;
    currentSalaryMax += 2.0;
  }

  const expectedSalaryMin = Math.round(currentSalaryMin * 1.8 * 10) / 10;
  const expectedSalaryMax = Math.round(currentSalaryMax * 2.2 * 10) / 10;

  const defaultExplanation = `Estimated package ranges in LPA (INR) calculated using profile variables. Standard engineering roles offer competitive packages depending on performance.`;

  // Compute confidence reasons
  const confidenceReasons = [];
  const resumeExperience = parsedData?.experience || [];
  const hasInternship = resumeExperience.some(exp => 
    (exp.role || exp.title || '').toLowerCase().includes('intern') ||
    (exp.description || '').toLowerCase().includes('intern')
  );

  const projectsCount = parsedData?.projects?.length || 0;
  if (projectsCount >= 3) {
    confidenceReasons.push('Strong Projects');
  } else if (projectsCount === 2) {
    confidenceReasons.push('Good Projects');
  } else {
    confidenceReasons.push('Weak Projects');
  }

  if (experienceLevel === 'Student' || experienceLevel === 'Fresher') {
    if (hasInternship) {
      confidenceReasons.push('Strong Internship');
    } else {
      confidenceReasons.push('No Internship');
    }
  }

  const skillsList = parsedData?.skills || [];
  const hasCloudSkills = skillsList.some(s => 
    ['aws', 'azure', 'gcp', 'google cloud', 'cloud', 'docker', 'kubernetes', 'k8s', 'terraform'].some(kw => s.toLowerCase().includes(kw))
  );
  if (hasCloudSkills) {
    confidenceReasons.push('Good Cloud Skills');
  } else {
    confidenceReasons.push('Weak Cloud Skills');
  }

  if (careerScore >= 80) {
    confidenceReasons.push('Strong Resume');
  } else if (careerScore >= 50) {
    confidenceReasons.push('Good Resume');
  } else {
    confidenceReasons.push('Weak Resume');
  }

  const hasSysDesign = skillsList.some(s => 
    ['system design', 'architecture', 'scalability', 'microservices', 'load balancer', 'caching', 'redis', 'kafka'].some(kw => s.toLowerCase().includes(kw))
  );
  if (hasSysDesign) {
    confidenceReasons.push('Good System Design');
  } else {
    confidenceReasons.push('Missing System Design');
  }

  const confidence = careerScore >= 85 ? 'High' : careerScore >= 50 ? 'Medium' : 'Low';

  return {
    currentSalaryMin: Math.round(currentSalaryMin * 10) / 10,
    currentSalaryMax: Math.round(currentSalaryMax * 10) / 10,
    expectedSalaryMin,
    expectedSalaryMax,
    currency: 'LPA (INR)',
    explanation: geminiExplanation || defaultExplanation,
    factors: {
      experience: experienceLevel === 'Experienced' ? 'Experienced (2+ yrs)' : 'Fresher (0 yrs)',
      projects: projectsCount,
      careerScore: careerScore,
      targetCompany: userProfile?.targetRole || 'Software Engineer',
      location: 'India',
      confidence,
      confidenceReasons
    }
  };
};
