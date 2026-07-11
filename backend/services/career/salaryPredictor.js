/**
 * Deterministic salary prediction service (Hybrid)
 */
exports.predictSalary = (parsedData, userProfile, geminiExplanation = '') => {
  const experienceLevel = userProfile?.experienceLevel || 'Student';
  
  // Check college tier for academic bonus
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

  // Calculate expected salary after completing the roadmap
  const expectedSalaryMin = Math.round(currentSalaryMin * 1.8 * 10) / 10;
  const expectedSalaryMax = Math.round(currentSalaryMax * 2.2 * 10) / 10;

  const defaultExplanation = `Estimated package in LPA (INR) based on your current profile. Following the learning roadmap and completing core projects can significantly enhance your leverage for premium roles.`;

  return {
    currentSalaryMin: Math.round(currentSalaryMin * 10) / 10,
    currentSalaryMax: Math.round(currentSalaryMax * 10) / 10,
    expectedSalaryMin,
    expectedSalaryMax,
    currency: 'LPA (INR)',
    explanation: geminiExplanation || defaultExplanation
  };
};
