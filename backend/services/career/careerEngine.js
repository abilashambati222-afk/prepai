const JobDescription = require('../../models/JobDescription');
const { calculateCompanyReadiness } = require('./companyReadiness');
const { recommendJobs } = require('./jobRecommendation');
const { analyzeSkillGap } = require('./skillGapEngine');
const { evaluateResume } = require('./ruleEngine');
const { generateContentWithRetry } = require('../ai/geminiClient');
const { parseAiResponse } = require('../ai/responseParser');

const salaryPredictor = require('./salaryPredictor');
const timelineEstimator = require('./timelineEstimator');
const roadmapGenerator = require('./roadmapGenerator');
const resourceRecommendation = require('./resourceRecommendation');
const projectRecommendation = require('./projectRecommendation');
const historyTracker = require('./historyTracker');

/**
 * Main coordinator service for Phase 8: AI Career Mentor & Career Intelligence.
 */
exports.analyzeCareerProfile = async (user, jobDescriptionId = null) => {
  // 1. Compile parsed resume data, falling back to profile details if missing or not parsed
  const hasResume = user.resumeMetadata && user.resumeMetadata.storedFileName && user.resumeMetadata.status === 'Parsed';
  let parsedData = {};

  if (hasResume) {
    parsedData = user.resumeMetadata.parsedData || {};
  } else {
    parsedData = {
      skills: [
        ...(user.programmingLanguages || []),
        ...(user.frameworks || []),
        ...(user.databases || []),
        ...(user.tools || [])
      ],
      education: user.college ? [{
        institution: user.college,
        degree: user.degree,
        fieldOfStudy: user.branch,
        gpa: user.cgpa ? user.cgpa.toString() : ''
      }] : [],
      projects: [],
      experience: user.experienceLevel ? [{
        role: user.experienceLevel,
        duration: user.experienceLevel === 'Experienced' ? '2 years' : '0 years'
      }] : [],
      certifications: [],
      parsingConfidence: 75
    };
  }

  // 2. RUN RULE ENGINE CALCULATIONS
  // Calculate Overall Career Score
  const generalCriteria = {
    targetSkills: [],
    targetMinYears: 0,
    targetMinCgpa: 6.0,
    weights: { skills: 0.30, projects: 0.20, experience: 0.15, education: 0.15, resumeQuality: 0.10, certifications: 0.10 }
  };
  const careerEvaluation = evaluateResume(parsedData, user, generalCriteria);
  const careerScore = careerEvaluation.overallScore;

  // Calculate Company Readiness (15 companies)
  const companyReadinessRaw = calculateCompanyReadiness(parsedData, user);

  // Group companies into Ready, Almost Ready, and Need Improvement
  const ready = [];
  const almostReady = [];
  const needImprovement = [];

  companyReadinessRaw.forEach(c => {
    if (c.readinessPercent >= 75) ready.push(c.companyName);
    else if (c.readinessPercent >= 50) almostReady.push(c.companyName);
    else needImprovement.push(c.companyName);
  });

  // Calculate Job Recommendations
  const recommendedRoles = recommendJobs(parsedData, user);

  // Calculate Skill Gap Report if jobDescriptionId is provided
  let skillGapReport = null;
  let jd = null;
  if (jobDescriptionId) {
    jd = await JobDescription.findOne({ _id: jobDescriptionId, user: user._id });
    if (jd) {
      const gap = analyzeSkillGap(parsedData, user, jd.jobDescriptionText);
      skillGapReport = {
        jobDescriptionId: jd._id,
        jobTitle: jd.title,
        company: jd.company,
        existingSkills: gap.existingSkills,
        missingSkills: gap.missingSkills,
        criticalSkills: gap.criticalSkills,
        optionalSkills: gap.optionalSkills,
        analyzedAt: new Date()
      };
    }
  }

  // 3. COMPILE HYBRID PROMPT FOR GEMINI AI
  const candidateSkills = Array.from(new Set([
    ...(parsedData.skills || []),
    ...(user.programmingLanguages || []),
    ...(user.frameworks || []),
    ...(user.databases || []),
    ...(user.tools || [])
  ]));

  const missingSkillsList = skillGapReport 
    ? Object.values(skillGapReport.missingSkills).flat() 
    : ['Cloud Architecture', 'CI/CD Pipelines', 'System Design'];

  const prompt = `
  You are an expert AI Career Mentor for developers.
  Given the candidate profile and rule-based calculations, generate a personalized learning roadmap, resource list, project ideas, salary predict rationale, and company readiness details in JSON.

  CANDIDATE PROFILE:
  - Name: ${user.fullName}
  - College: ${user.college || 'N/A'}, Degree: ${user.degree || 'N/A'}, CGPA: ${user.cgpa || 'N/A'}
  - Experience Level: ${user.experienceLevel}
  - Target Role: ${user.targetRole || 'Software Engineer'}
  - Current Skills: ${JSON.stringify(candidateSkills)}

  RULE ENGINE CALCULATIONS:
  - Overall Career Score: ${careerScore}/100
  - Ready Companies: ${JSON.stringify(ready)}
  - Almost Ready: ${JSON.stringify(almostReady)}
  - Need Improvement: ${JSON.stringify(needImprovement)}
  - Job Role Fits: ${JSON.stringify(recommendedRoles)}
  ${jd ? `- Target Job Description: ${jd.company} - ${jd.title}` : ''}
  - Calculated Missing Skills: ${JSON.stringify(missingSkillsList)}

  Return ONLY a structured JSON matching this schema:
  {
    "companyReadinessExplanations": {
      "Google": { "explanation": "Rationale based on skills/academics.", "improvementSuggestions": ["List items to fix"] },
      "Amazon": { "explanation": "...", "improvementSuggestions": [] },
      "Microsoft": { "explanation": "...", "improvementSuggestions": [] },
      "Meta": { "explanation": "...", "improvementSuggestions": [] },
      "Adobe": { "explanation": "...", "improvementSuggestions": [] },
      "Oracle": { "explanation": "...", "improvementSuggestions": [] },
      "Salesforce": { "explanation": "...", "improvementSuggestions": [] },
      "TCS": { "explanation": "...", "improvementSuggestions": [] },
      "Infosys": { "explanation": "...", "improvementSuggestions": [] },
      "Accenture": { "explanation": "...", "improvementSuggestions": [] },
      "Capgemini": { "explanation": "...", "improvementSuggestions": [] },
      "Cognizant": { "explanation": "...", "improvementSuggestions": [] },
      "Deloitte": { "explanation": "...", "improvementSuggestions": [] },
      "Wipro": { "explanation": "...", "improvementSuggestions": [] },
      "Tech Mahindra": { "explanation": "...", "improvementSuggestions": [] }
    },
    "companyRecommendationsExplanation": "Why the candidate stands ready or falls short across these groups.",
    "roadmap": {
      "weeklyGoals": [
        { "week": 1, "goal": "Goal name", "topics": ["Topic A", "Topic B"], "milestone": "Weekly checkpoint" }
      ],
      "monthlyGoals": [
        { "month": 1, "goal": "Goal name", "milestones": ["M1", "M2"] }
      ],
      "estimatedCompletionTime": "Estimated completion (e.g. 6 Months)"
    },
    "resources": [
      { "category": "Courses|Books|Documentation|YouTube|Practice Platforms", "name": "Resource Name", "type": "Free|Paid", "link": "https://..." }
    ],
    "projects": [
      { "title": "Project Title", "techStack": ["React", "Express"], "duration": "Duration in weeks", "difficulty": "Beginner|Intermediate|Advanced", "learningOutcome": "Outcome detail" }
    ],
    "certifications": [
      { "name": "AWS Certified Solutions Architect", "provider": "AWS", "difficulty": "Intermediate", "rationale": "Why complete this" }
    ],
    "salaryPredictionExplanation": "Textual justification of predict ranges.",
    "timeline": {
      "threeMonths": "Target focus at 3 months",
      "sixMonths": "Target focus at 6 months",
      "nineMonths": "Target focus at 9 months",
      "twelveMonths": "Target focus at 12 months"
    },
    "motivationalSummary": "Encouraging mentor paragraph."
  }
  `;

  // 4. INVOKE GEMINI AI (WITH GRACEFUL FALLBACK)
  let geminiData = null;
  try {
    const { text: rawResponse } = await generateContentWithRetry(prompt, { temperature: 0.2 });
    geminiData = parseAiResponse(rawResponse);
  } catch (err) {
    console.error('[Career Engine] Gemini AI analysis failed, activating programmatic fallback:', err);
  }

  // 5. ASSEMBLE HYBRID OUTPUTS
  // Add Gemini explanations to Company Readiness array
  const companyReadiness = companyReadinessRaw.map(c => {
    const geminiExp = geminiData?.companyReadinessExplanations?.[c.companyName];
    return {
      ...c,
      explanation: geminiExp?.explanation || `Hiring assessment based on company profile matching criteria.`,
      improvementSuggestions: geminiExp?.improvementSuggestions || [
        `Complete roadmap items related to target skills.`,
        `Build complex project applications displaying ${c.companyName} core stacks.`
      ]
    };
  });

  const companyRecommendations = {
    ready,
    almostReady,
    needImprovement,
    explanation: geminiData?.companyRecommendationsExplanation || `You demonstrate solid foundations for ${ready.length} organizations. Focus on bridging skill gaps for other firms.`
  };

  const roadmap = roadmapGenerator.generateRoadmap(geminiData?.roadmap);
  const resources = resourceRecommendation.recommendResources(geminiData?.resources);
  const projects = projectRecommendation.recommendProjects(geminiData?.projects);

  const certifications = geminiData?.certifications || [
    { name: 'AWS Certified Solutions Architect', provider: 'AWS', difficulty: 'Intermediate', rationale: 'Gives credibility for cloud-native software roles.' },
    { name: 'Kubernetes Administrator (CKA)', provider: 'CNCF', difficulty: 'Advanced', rationale: 'Essential verification of container deployment skills.' }
  ];

  const salaryPrediction = salaryPredictor.predictSalary(
    parsedData,
    user,
    geminiData?.salaryPredictionExplanation
  );

  const timeline = timelineEstimator.estimateTimeline(
    parsedData,
    user,
    missingSkillsList.length,
    user.dailyGoal ? user.dailyGoal * 2.5 : 15,
    geminiData?.timeline
  );

  const motivationalSummary = geminiData?.motivationalSummary || `Welcome to your customized career roadmap, ${user.fullName}. Focus on mastering skills systematically!`;

  const resumeHash = user.resumeMetadata?.fileHash || 'manual_profile';

  // 6. SAVE SNAPSHOT IN HISTORY (DETERMINISTICALLY TRIGGERED ON ANALYZE)
  await historyTracker.saveSnapshot(
    user._id,
    careerScore,
    candidateSkills.length,
    ready.length,
    resumeHash
  );

  return {
    careerScore,
    companyReadiness,
    companyRecommendations,
    recommendedRoles,
    skillGapReport,
    roadmap,
    resources,
    projects,
    certifications,
    salaryPrediction,
    timeline,
    motivationalSummary,
    resumeHash
  };
};
