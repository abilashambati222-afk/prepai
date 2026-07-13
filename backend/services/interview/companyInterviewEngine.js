const { getCompanyProfileByName } = require('../career/companyProfileProvider');

const COMPANY_PATTERNS = {
  google: {
    difficulty: "Hard",
    rounds: ["Online Assessment", "Technical Phone Screen", "3x Coding Rounds (DSA)", "Googleyness & Leadership"],
    topics: ["Arrays & Hashing", "Trees & Graphs", "Dynamic Programming", "System Design"],
    prep: "Practice LeetCode Medium/Hard, focus on runtime complexity optimization and graph algorithms."
  },
  amazon: {
    difficulty: "Medium-Hard",
    rounds: ["Online Assessment", "Technical Phone Screen", "3x Coding Rounds (OOD/DSA)", "Bar Raiser (Leadership Principles)"],
    topics: ["Amazon Leadership Principles (STAR method)", "System Design", "Dynamic Programming", "Object Oriented Design"],
    prep: "Memorize the 16 Leadership Principles. Focus on STAR stories and SDE-1 coding standard sheets."
  },
  microsoft: {
    difficulty: "Medium-Hard",
    rounds: ["Technical Screening", "3x Technical Rounds (DSA/System Design)", "As Appropriate (AA) Round"],
    topics: ["Arrays", "Strings", "System Design", "OS & Networking"],
    prep: "Practice system design fundamentals and multi-threading/concurrency concepts."
  },
  meta: {
    difficulty: "Hard",
    rounds: ["Initial Screen", "2x Coding Speed Rounds", "System Design Round", "Behavioral (Core Values)"],
    topics: ["Fast DSA execution (2 questions in 45 mins)", "System Design", "Product Design"],
    prep: "Practice solving coding questions quickly. High focus on string manipulations and recursive tree structures."
  },
  tcs: {
    difficulty: "Easy-Medium",
    rounds: ["NQT Aptitude Exam", "Technical Interview Round", "HR & Managerial Interview"],
    topics: ["OOP", "DBMS & SQL", "Java/Python/C++ basics", "Basic coding (reverse string, prime check)"],
    prep: "Review basic programming syntax, SQL queries (joins, aggregations), and core OOP concepts."
  }
};

/**
 * Returns structured information for a target company
 */
exports.getCompanyInterviewPattern = (companyName) => {
  const normName = (companyName || '').toLowerCase().trim().replace(/\s+/g, '_');
  
  // Try loading dynamic profile first (from Phase 8 directory)
  const dynamicProfile = getCompanyProfileByName(companyName);
  
  // Find predefined or build dynamic
  const preset = COMPANY_PATTERNS[normName] || {
    difficulty: dynamicProfile?.dsaLevel || "Medium",
    rounds: dynamicProfile?.systemDesignRequired 
      ? ["Technical Screening", "System Design Round", "HR Round"]
      : ["Coding Round", "Technical Interview", "HR Round"],
    topics: dynamicProfile?.requiredSkills || ["Data Structures", "OOP", "DBMS", "Git"],
    prep: `Review skills related to ${companyName}'s primary stack: ${(dynamicProfile?.requiredSkills || []).join(', ')}.`
  };

  return {
    company: companyName,
    difficulty: preset.difficulty,
    expectedRounds: preset.rounds,
    frequentlyAskedTopics: preset.topics,
    recommendedPreparation: preset.prep
  };
};
