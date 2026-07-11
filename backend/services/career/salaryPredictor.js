/**
 * Deterministic salary prediction service (Hybrid) with factor transparency.
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

  return {
    currentSalaryMin: Math.round(currentSalaryMin * 10) / 10,
    currentSalaryMax: Math.round(currentSalaryMax * 10) / 10,
    expectedSalaryMin,
    expectedSalaryMax,
    currency: 'LPA (INR)',
    explanation: geminiExplanation || defaultExplanation,
    factors: {
      experience: experienceLevel === 'Experienced' ? 'Experienced (2+ yrs)' : 'Fresher (0 yrs)',
      projects: parsedData?.projects?.length || 0,
      careerScore: careerScore,
      targetCompany: userProfile?.targetRole || 'Software Engineer',
      location: 'India',
      confidence: skillsCount > 10 ? 'High' : skillsCount > 5 ? 'Medium' : 'Low'
    }
  };
};
