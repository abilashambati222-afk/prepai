const recommendationEngine = require('./recommendationEngine');

/**
 * Builds the final structured report payload for an interview session
 */
exports.generateReport = (session) => {
  const anal = session.analytics || {};
  const weakAreas = anal.weakAreas || [];
  
  // Get recommendation resources
  const recommendations = recommendationEngine.generateRecommendations(weakAreas);

  // Generate completion feedback text
  let summary = `You completed your ${session.interviewType} simulation. `;
  if (anal.overallScore >= 80) {
    summary += "Excellent job! You demonstrated deep technical fluency and clear communication skills. You are highly ready for standard industry loops.";
  } else if (anal.overallScore >= 60) {
    summary += "Good performance. Your foundations are clear, but you have key weak zones (e.g. " + (weakAreas.join(', ') || 'minor details') + ") that need attention before attempting interviews.";
  } else {
    summary += "You need to dedicate more time to core concepts. Review the suggested revision plans and build projects to strengthen these skills.";
  }

  return {
    interviewId: session._id,
    type: session.interviewType,
    company: session.company,
    role: session.role,
    difficulty: session.difficulty,
    date: session.createdAt,
    duration: session.duration,
    scores: {
      overall: anal.overallScore || 0,
      technical: anal.technicalScore || 0,
      hr: anal.hrScore || 0,
      communication: anal.communicationScore || 0,
      confidence: anal.confidenceScore || 0,
      behavioral: anal.behaviorScore || 0,
      coding: anal.codingScore || 0
    },
    feedbackSummary: summary,
    weakAreas,
    strongAreas: anal.strongAreas || [],
    recommendations,
    questions: (session.questions || []).map(q => ({
      questionText: q.questionText,
      category: q.category,
      type: q.type,
      userAnswer: q.answer?.answerText || '',
      feedbackScore: q.feedback?.score || 0,
      explanation: q.feedback?.explanation || '',
      suggestions: q.feedback?.improvementSuggestions || [],
      starEvaluation: q.feedback?.starEvaluation || null
    }))
  };
};
