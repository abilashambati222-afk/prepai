const ruleEngine = require('./ruleEngine');

const COMPANY_PROFILES = {
  Google: {
    targetSkills: ['algorithms', 'data structures', 'system design', 'c++', 'java', 'python', 'go', 'machine learning'],
    targetMinYears: 2,
    targetMinCgpa: 8.5,
    weights: { skills: 0.35, projects: 0.25, experience: 0.15, education: 0.15, resumeQuality: 0.05, certifications: 0.05 }
  },
  Amazon: {
    targetSkills: ['data structures', 'algorithms', 'system design', 'java', 'c++', 'python', 'aws', 'cloud'],
    targetMinYears: 1.5,
    targetMinCgpa: 8.0,
    weights: { skills: 0.35, projects: 0.20, experience: 0.20, education: 0.10, resumeQuality: 0.10, certifications: 0.05 }
  },
  Microsoft: {
    targetSkills: ['algorithms', 'data structures', 'c#', 'c++', 'java', 'azure', 'system design', 'software engineering'],
    targetMinYears: 1.5,
    targetMinCgpa: 8.0,
    weights: { skills: 0.35, projects: 0.20, experience: 0.20, education: 0.10, resumeQuality: 0.10, certifications: 0.05 }
  },
  Meta: {
    targetSkills: ['algorithms', 'systems programming', 'javascript', 'react', 'python', 'c++', 'distributed systems', 'system design'],
    targetMinYears: 2,
    targetMinCgpa: 8.0,
    weights: { skills: 0.35, projects: 0.25, experience: 0.20, education: 0.10, resumeQuality: 0.05, certifications: 0.05 }
  },
  Adobe: {
    targetSkills: ['java', 'c++', 'javascript', 'data structures', 'algorithms', 'object oriented design', 'react', 'node.js'],
    targetMinYears: 1,
    targetMinCgpa: 8.0,
    weights: { skills: 0.30, projects: 0.25, experience: 0.15, education: 0.15, resumeQuality: 0.10, certifications: 0.05 }
  },
  Oracle: {
    targetSkills: ['java', 'sql', 'database design', 'algorithms', 'c++', 'pl/sql', 'cloud computing', 'linux'],
    targetMinYears: 1,
    targetMinCgpa: 7.5,
    weights: { skills: 0.30, projects: 0.20, experience: 0.15, education: 0.15, resumeQuality: 0.10, certifications: 0.10 }
  },
  Salesforce: {
    targetSkills: ['java', 'javascript', 'apex', 'salesforce', 'cloud computing', 'apis', 'web services', 'sql'],
    targetMinYears: 1.5,
    targetMinCgpa: 7.5,
    weights: { skills: 0.35, projects: 0.20, experience: 0.15, education: 0.10, resumeQuality: 0.10, certifications: 0.10 }
  },
  TCS: {
    targetSkills: ['java', 'python', 'c', 'c++', 'sql', 'html', 'css', 'javascript'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.20, projects: 0.15, experience: 0.05, education: 0.20, resumeQuality: 0.20, certifications: 0.20 }
  },
  Infosys: {
    targetSkills: ['java', 'python', 'net', 'sql', 'cloud basics', 'software engineering', 'html', 'css'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.20, projects: 0.15, experience: 0.05, education: 0.20, resumeQuality: 0.20, certifications: 0.20 }
  },
  Accenture: {
    targetSkills: ['software engineering', 'java', 'sql', 'cloud computing', 'agile', 'project management', 'business analysis'],
    targetMinYears: 0,
    targetMinCgpa: 6.5,
    weights: { skills: 0.25, projects: 0.15, experience: 0.10, education: 0.15, resumeQuality: 0.15, certifications: 0.20 }
  },
  Capgemini: {
    targetSkills: ['java', 'net', 'sql', 'javascript', 'html', 'css', 'cloud', 'angular'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.25, projects: 0.15, experience: 0.05, education: 0.15, resumeQuality: 0.20, certifications: 0.20 }
  },
  Cognizant: {
    targetSkills: ['java', 'python', 'sql', 'javascript', 'html', 'css', 'cloud', 'testing', 'c#'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.25, projects: 0.15, experience: 0.05, education: 0.15, resumeQuality: 0.20, certifications: 0.20 }
  },
  Deloitte: {
    targetSkills: ['consulting', 'sql', 'python', 'agile', 'data analytics', 'cloud', 'tableau', 'power bi'],
    targetMinYears: 0,
    targetMinCgpa: 6.5,
    weights: { skills: 0.25, projects: 0.15, experience: 0.10, education: 0.15, resumeQuality: 0.15, certifications: 0.20 }
  },
  Wipro: {
    targetSkills: ['java', 'python', 'sql', 'html', 'css', 'javascript', 'testing', 'c#'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.20, projects: 0.15, experience: 0.05, education: 0.20, resumeQuality: 0.20, certifications: 0.20 }
  },
  "Tech Mahindra": {
    targetSkills: ['telecom', 'java', 'python', 'sql', 'networking', 'cloud', 'linux', 'testing'],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.20, projects: 0.15, experience: 0.05, education: 0.20, resumeQuality: 0.20, certifications: 0.20 }
  }
};

/**
 * Calculates readiness for all 15 listed companies.
 */
exports.calculateCompanyReadiness = (parsedData, userProfile) => {
  const readinessResults = [];

  // Determine scoring confidence
  let confidence = 'High';
  if (!parsedData || Object.keys(parsedData).length === 0) {
    confidence = 'Low';
  } else if (!parsedData.skills || parsedData.skills.length < 3) {
    confidence = 'Medium';
  }

  for (const [companyName, criteria] of Object.entries(COMPANY_PROFILES)) {
    const analysis = ruleEngine.evaluateResume(parsedData, userProfile, criteria);
    const score = analysis.overallScore;

    // Map readiness level
    let readinessLevel = 'Low';
    if (score >= 90) readinessLevel = 'Ready';
    else if (score >= 75) readinessLevel = 'High';
    else if (score >= 50) readinessLevel = 'Medium';

    // Compile reasons (positive features and improvement targets)
    const reasons = [];

    // Skills feedback
    if (analysis.factors.skills.score >= 80) {
      reasons.push('Matches core technical skills required for this role.');
    } else if (analysis.factors.skills.score < 50) {
      reasons.push('Needs to acquire key technologies required by this organization.');
    }

    // Projects feedback
    if (analysis.factors.projects.score >= 80) {
      reasons.push('Demonstrates solid project portfolio demonstrating practical software applications.');
    } else {
      reasons.push('Recommend adding more robust projects matching standard engineering templates.');
    }

    // Experience / Education feedback
    if (analysis.factors.experience.score >= 80) {
      reasons.push('Demonstrates relevant industry experience or internships.');
    }
    if (analysis.factors.education.score < 70) {
      reasons.push('Academic credentials or CGPA stand below preferred targets.');
    }

    // Default catch-all reasons to ensure user has guidance
    if (reasons.length === 0) {
      reasons.push('Meets standard technical criteria. Keep practicing and refining projects.');
    }

    readinessResults.push({
      companyName,
      readinessPercent: score,
      readinessLevel,
      confidence,
      reasons: reasons.slice(0, 3)
    });
  }

  return readinessResults;
};
