const Interview = require('../../models/Interview');
const interviewGenerator = require('./interviewGenerator');
const interviewEvaluator = require('./interviewEvaluator');
const { calculateSessionAnalytics } = require('./scoreCalculator');

/**
 * Manages the sequential steps and lifecycle of an interview simulation
 */

/**
 * Start a new interview session
 */
exports.startSession = async (user, params) => {
  const { interviewType, company, role, difficulty } = params;

  // 1. Generate 5 interview questions
  const generated = await interviewGenerator.generateQuestions(user, {
    interviewType,
    company,
    role,
    difficulty,
    count: 5
  });

  // 2. Map questions array
  const questions = generated.map(q => ({
    questionText: q.questionText,
    type: q.type || 'technical',
    category: q.category || 'General',
    constraints: q.constraints || [],
    examples: q.examples || [],
    hints: q.hints || [],
    expectedComplexity: q.expectedComplexity || '',
    referenceSolution: q.referenceSolution || '',
    testCases: q.testCases || [],
    answer: { answerText: '', submittedAt: null, duration: 0 },
    feedback: null
  }));

  // 3. Save Interview in Database
  const session = await Interview.create({
    user: user._id,
    interviewType,
    company: company || '',
    role: role || '',
    difficulty: difficulty || 'Medium',
    status: 'started',
    questions,
    duration: 0
  });

  return session;
};

/**
 * Submit answer to current unanswered question
 */
exports.submitAnswer = async (session, answerText, duration) => {
  // 1. Find first unanswered question
  const currentQuestion = session.questions.find(q => !q.answer || !q.answer.answerText);
  if (!currentQuestion) {
    throw new Error('All questions have already been answered in this session.');
  }

  // 2. Set answer properties
  currentQuestion.answer = {
    answerText,
    submittedAt: new Date(),
    duration: Number(duration) || 0
  };

  // 3. Update overall session duration accumulator
  session.duration += Number(duration) || 0;

  // 4. Semantically evaluate answer via AI evaluator
  const evalResult = await interviewEvaluator.evaluateAnswer(
    session.interviewType,
    currentQuestion,
    answerText
  );
  currentQuestion.feedback = evalResult;

  // 5. Check if all questions are now answered
  const unansweredCount = session.questions.filter(q => !q.answer || !q.answer.answerText).length;
  if (unansweredCount === 0) {
    session.status = 'completed';
  } else {
    session.status = 'in_progress';
  }

  // 6. Save updates
  await session.save();

  // 7. Find next question
  const nextQuestion = session.questions.find(q => !q.answer || !q.answer.answerText);

  return {
    feedback: currentQuestion.feedback,
    isCompleted: session.status === 'completed',
    nextQuestion: nextQuestion ? {
      _id: nextQuestion._id,
      questionText: nextQuestion.questionText,
      type: nextQuestion.type,
      category: nextQuestion.category,
      constraints: nextQuestion.constraints,
      examples: nextQuestion.examples,
      hints: nextQuestion.hints,
      expectedComplexity: nextQuestion.expectedComplexity
    } : null
  };
};
