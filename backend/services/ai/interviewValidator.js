/**
 * Validators for Gemini outputs to prevent runtime exceptions
 */

/**
 * Validate generated questions object
 */
exports.validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    throw new Error("Generated questions must be an array");
  }
  if (questions.length === 0) {
    throw new Error("Generated questions array is empty");
  }
  for (const q of questions) {
    if (!q.questionText || typeof q.questionText !== 'string') {
      throw new Error("Question must contain a valid questionText string");
    }
  }
  return true;
};

/**
 * Validate answer evaluation object
 */
exports.validateEvaluation = (evalObj) => {
  if (!evalObj || typeof evalObj !== 'object') {
    throw new Error("Evaluation must be an object");
  }
  
  // Set default scores if fields are missing or not numeric
  const scores = [
    'technicalAccuracy',
    'communication',
    'completeness',
    'confidence',
    'keywords',
    'professionalism',
    'grammar'
  ];

  for (const field of scores) {
    if (evalObj[field] === undefined || evalObj[field] === null || isNaN(Number(evalObj[field]))) {
      evalObj[field] = 50; // default average score
    } else {
      evalObj[field] = Math.min(Math.max(Number(evalObj[field]), 0), 100);
    }
  }

  if (!evalObj.explanation || typeof evalObj.explanation !== 'string') {
    evalObj.explanation = "Answer processed successfully.";
  }

  if (!Array.isArray(evalObj.improvementSuggestions)) {
    evalObj.improvementSuggestions = [];
  }

  return true;
};
