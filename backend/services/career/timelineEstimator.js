/**
 * Timeline estimation service (Hybrid)
 */
exports.estimateTimeline = (parsedData, userProfile, missingSkillsCount = 0, studyHoursPerWeek = 15, geminiTimeline = null) => {
  // Safe default calculations if Gemini fails
  const totalWeeksNeeded = Math.max(Math.ceil((missingSkillsCount * 8) / (studyHoursPerWeek / 5)), 4);
  const totalMonthsNeeded = Math.ceil(totalWeeksNeeded / 4);

  const defaultTimeline = {
    threeMonths: `Focus on core fundamentals. Master Programming languages (${(userProfile?.programmingLanguages || []).slice(0,2).join(', ') || 'Javascript/Python'}) and basic data structures. Complete 1 mini-project.`,
    sixMonths: `Build medium complexity projects. Master core frameworks like React/Node.js. Study databases and basic SQL/NoSQL structures.`,
    nineMonths: `Expand to Cloud (AWS/GCP) and DevOps basics (Docker, Git). Build 1 full-stack system and learn core system design.`,
    twelveMonths: `Prepare for advanced placements. Solve mock interviews, algorithm practice, and optimize your portfolio. ready for MAANG/Tier-1 tracks.`,
    studyHoursPerWeek
  };

  if (geminiTimeline) {
    return {
      threeMonths: geminiTimeline.threeMonths || defaultTimeline.threeMonths,
      sixMonths: geminiTimeline.sixMonths || defaultTimeline.sixMonths,
      nineMonths: geminiTimeline.nineMonths || defaultTimeline.nineMonths,
      twelveMonths: geminiTimeline.twelveMonths || defaultTimeline.twelveMonths,
      studyHoursPerWeek
    };
  }

  return defaultTimeline;
};
