const fs = require('fs');
const path = require('path');
const ruleEngine = require('./ruleEngine');

const PROFILES_DIR = path.join(__dirname, '..', '..', 'data', 'companyProfiles');

/**
 * Calculates readiness details dynamically based on JSON company profiles.
 */
exports.calculateCompanyReadiness = (parsedData, userProfile) => {
  const readinessResults = [];
  
  let confidence = 'High';
  if (!parsedData || Object.keys(parsedData).length === 0) {
    confidence = 'Low';
  } else if (!parsedData.skills || parsedData.skills.length < 3) {
    confidence = 'Medium';
  }

  let files = [];
  try {
    files = fs.readdirSync(PROFILES_DIR).filter(f => f.endsWith('.json'));
  } catch (err) {
    console.error('[Company Readiness] Failed to read company profiles directory:', err);
  }

  // Compile candidate skills
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
  ])).map(s => s.toLowerCase());

  files.forEach(file => {
    try {
      const filePath = path.join(PROFILES_DIR, file);
      const profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Map profile config parameters to criteria weights
      const isProduct = profile.minimumCGPA >= 7.5;
      const criteria = {
        targetSkills: [...profile.requiredSkills, ...profile.preferredSkills],
        targetMinYears: profile.experienceLevel === 'Experienced' ? 2 : 0,
        targetMinCgpa: profile.minimumCGPA,
        weights: isProduct 
          ? { skills: 0.35, projects: 0.25, experience: 0.15, education: 0.15, resumeQuality: 0.05, certifications: 0.05 }
          : { skills: 0.20, projects: 0.15, experience: 0.05, education: 0.20, resumeQuality: 0.20, certifications: 0.20 }
      };

      const analysis = ruleEngine.evaluateResume(parsedData, userProfile, criteria);
      const score = analysis.overallScore;

      let readinessLevel = 'Low';
      if (score >= 90) readinessLevel = 'Ready';
      else if (score >= 75) readinessLevel = 'High';
      else if (score >= 50) readinessLevel = 'Medium';

      // Identify Strengths vs Gaps
      const strengths = [];
      const missing = [];

      profile.requiredSkills.forEach(skill => {
        const norm = ruleEngine.normalize(skill);
        const isMatched = candidateSkills.some(c => c === norm || c.includes(norm) || norm.includes(c));
        if (isMatched) {
          strengths.push(skill);
        } else {
          missing.push(skill);
        }
      });

      profile.preferredSkills.forEach(skill => {
        const norm = ruleEngine.normalize(skill);
        const isMatched = candidateSkills.some(c => c === norm || c.includes(norm) || norm.includes(c));
        if (isMatched && strengths.length < 5) {
          strengths.push(skill);
        } else if (!isMatched && missing.length < 5) {
          missing.push(skill);
        }
      });

      // Projects remaining check
      const projectsListed = parsedData?.projects?.length || 0;
      const projectsRequiredCount = Math.max(profile.requiredProjects - projectsListed, 0);
      const projectsRequired = projectsRequiredCount > 0 
        ? `${projectsRequiredCount} more production project${projectsRequiredCount > 1 ? 's' : ''}`
        : 'Project portfolio meets criteria';

      // Prep duration estimate
      let prepMonths = 0;
      if (score < 50) prepMonths = 6;
      else if (score < 75) prepMonths = 3;
      else if (score < 90) prepMonths = 1;
      const estimatedPrepTime = prepMonths > 0 ? `${prepMonths} Month${prepMonths > 1 ? 's' : ''}` : 'Ready';

      // Compose reasons
      const reasons = [];
      if (analysis.factors.skills.score >= 80) {
        reasons.push('Matches core technical skills required for this role.');
      } else if (analysis.factors.skills.score < 50) {
        reasons.push('Needs to acquire key technologies required by this organization.');
      }
      if (projectsRequiredCount > 0) {
        reasons.push(`Recommend adding ${projectsRequiredCount} more projects.`);
      }
      if (analysis.factors.education.score < 70) {
        reasons.push('Academic credentials or CGPA stand below preferred targets.');
      }
      if (reasons.length === 0) {
        reasons.push('Meets standard technical criteria. Keep practicing and refining projects.');
      }

      readinessResults.push({
        companyName: profile.company,
        readinessPercent: score,
        readinessLevel,
        confidence,
        reasons: reasons.slice(0, 3),
        strengths: strengths.slice(0, 4),
        missing: missing.slice(0, 4),
        projectsRequired,
        estimatedPrepTime
      });
    } catch (err) {
      console.error(`[Company Readiness] Failed to evaluate profile file: ${file}`, err);
    }
  });

  return readinessResults;
};
