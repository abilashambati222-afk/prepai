const MCQQuestion = require('../models/MCQQuestion');
const MCQQuizResult = require('../models/MCQQuizResult');
const MCQBookmark = require('../models/MCQBookmark');
const MCQSubmission = require('../models/MCQSubmission');
const MCQProgress = require('../models/MCQProgress');
const MCQTest = require('../models/MCQTest');
const User = require('../models/User');
const { generateContentWithRetry } = require('../services/ai/geminiClient');

// Get MCQ Dashboard statistics and insights
exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user progress
    let progress = await MCQProgress.findOne({ user: userId });
    if (!progress) {
      progress = await MCQProgress.create({
        user: userId,
        dailyGoal: req.user.dailyGoal || 10
      });
    }

    // Get recent test attempts
    const recentTests = await MCQTest.find({ user: userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .lean();

    // Map topic statistics to calculate accuracy
    const topicsWithAccuracy = progress.topicStats.map(t => ({
      topic: t.topic,
      subject: t.subject,
      solved: t.solved,
      accuracy: t.solved > 0 ? Math.round((t.correct / t.solved) * 100) : 0
    }));

    // Weak and strong topics (based on accuracy and minimum attempts)
    const weakTopics = topicsWithAccuracy
      .filter(t => t.solved >= 3 && t.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    const strongTopics = topicsWithAccuracy
      .filter(t => t.solved >= 3 && t.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5);

    // Find last practiced topic for "Continue Practice"
    let continuePractice = null;
    if (recentTests.length > 0) {
      continuePractice = {
        subject: recentTests[0].subject,
        topic: recentTests[0].topic
      };
    } else {
      continuePractice = {
        subject: 'Aptitude',
        topic: 'Percentages'
      };
    }

    // Average time spent per question
    const totalSubmissions = await MCQSubmission.countDocuments({ user: userId });
    const averageTime = totalSubmissions > 0
      ? Math.round((progress.totalTimeSpent || 0) / totalSubmissions)
      : 0;

    // Personalized recommendations based on historical data
    const recommendations = [];
    if (weakTopics.length > 0) {
      recommendations.push({
        type: 'Revision Plan',
        message: `Revise weak topic: ${weakTopics[0].topic} (${weakTopics[0].accuracy}% accuracy)`,
        subject: weakTopics[0].subject,
        topic: weakTopics[0].topic
      });
    }
    
    // Add company-wise recommendations
    const targetCompany = req.user.targetCompany || 'TCS';
    recommendations.push({
      type: 'Company Preparation',
      message: `Practice targeted questions for your dream company: ${targetCompany}`,
      subject: 'Company Prep',
      topic: targetCompany
    });

    if (recommendations.length < 3) {
      recommendations.push({
        type: 'Next Practice',
        message: 'Boost your analytical reasoning with Clock & Calendar puzzles.',
        subject: 'Aptitude',
        topic: 'Clock'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalSolved: progress.totalSolved,
        correctCount: progress.correctCount,
        wrongCount: progress.wrongCount,
        accuracy: progress.totalSolved > 0 ? Math.round((progress.correctCount / progress.totalSolved) * 100) : 0,
        currentStreak: progress.currentStreak,
        dailyGoal: progress.dailyGoal,
        dailySolvedCount: progress.dailySolvedCount,
        averageTime,
        weakTopics,
        strongTopics,
        recentTests,
        continuePractice,
        recommendations,
        badges: progress.badges.map(b => b.name)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Retrieve all categories grouped by subject dynamically
exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const questionAgg = await MCQQuestion.aggregate([
      {
        $group: {
          _id: { subject: '$subject', topic: '$topic' },
          totalQuestions: { $sum: 1 },
          easyCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
          mediumCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
          hardCount: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } }
        }
      },
      {
        $sort: { '_id.subject': 1, '_id.topic': 1 }
      }
    ]);

    const bookmarksCount = await MCQBookmark.countDocuments({ user: userId });

    const subjectsMap = {};
    questionAgg.forEach(item => {
      const { subject, topic } = item._id;
      if (!subjectsMap[subject]) {
        subjectsMap[subject] = {
          name: subject,
          totalQuestions: 0,
          topics: []
        };
      }
      subjectsMap[subject].totalQuestions += item.totalQuestions;
      subjectsMap[subject].topics.push({
        name: topic,
        totalQuestions: item.totalQuestions,
        easyCount: item.easyCount,
        mediumCount: item.mediumCount,
        hardCount: item.hardCount
      });
    });

    res.status(200).json({
      success: true,
      data: {
        subjects: Object.values(subjectsMap),
        bookmarksCount
      }
    });
  } catch (err) {
    next(err);
  }
};

// Fetch filtered list of questions (e.g. search, pagination, difficulty, status)
exports.getQuestions = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, company, search, solvedStatus, bookmarkedOnly, limit = 15, page = 1 } = req.query;
    const userId = req.user.id;
    const query = {};

    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (company) query.companyTags = company;

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } }
      ];
    }

    if (bookmarkedOnly === 'true') {
      const bMarks = await MCQBookmark.find({ user: userId }).select('question');
      const qIds = bMarks.map(b => b.question);
      query._id = { $in: qIds };
    }

    // Filter solved/unsolved
    if (solvedStatus) {
      const submissions = await MCQSubmission.find({ user: userId }).select('question');
      const solvedIds = submissions.map(s => s.question.toString());
      if (solvedStatus === 'solved') {
        query._id = { ...query._id, $in: solvedIds };
      } else if (solvedStatus === 'unsolved') {
        query._id = { ...query._id, $nin: solvedIds };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const questions = await MCQQuestion.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalQuestions = await MCQQuestion.countDocuments(query);

    // Get bookmark statuses
    const bookmarks = await MCQBookmark.find({ user: userId });
    const bookmarkedSet = new Set(bookmarks.map(b => b.question.toString()));

    const data = questions.map(q => ({
      ...q,
      isBookmarked: bookmarkedSet.has(q._id.toString())
    }));

    res.status(200).json({
      success: true,
      data: {
        questions: data,
        totalQuestions,
        totalPages: Math.ceil(totalQuestions / parseInt(limit)),
        currentPage: parseInt(page)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Fetch details of a single question
exports.getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const question = await MCQQuestion.findById(id).lean();
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const isBookmarked = await MCQBookmark.exists({ user: userId, question: id });
    const isSolved = await MCQSubmission.exists({ user: userId, question: id, isCorrect: true });

    res.status(200).json({
      success: true,
      data: {
        ...question,
        isBookmarked: !!isBookmarked,
        isSolved: !!isSolved
      }
    });
  } catch (err) {
    next(err);
  }
};

// Start a new test and return questions
exports.startTest = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, quizMode = 'Practice', count = 10 } = req.body;
    const filter = {};

    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const matchingQuestions = await MCQQuestion.find(filter).lean();
    if (matchingQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions matching parameters' });
    }

    // Shuffle and slice
    const shuffled = matchingQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, matchingQuestions.length));

    // Get bookmark statuses
    const bookmarks = await MCQBookmark.find({ user: req.user.id });
    const bookmarkedSet = new Set(bookmarks.map(b => b.question.toString()));

    const questionsWithBookmarks = selected.map(q => ({
      ...q,
      isBookmarked: bookmarkedSet.has(q._id.toString())
    }));

    res.status(200).json({
      success: true,
      data: {
        questions: questionsWithBookmarks,
        quizMode,
        subject: subject || 'All',
        topic: topic || 'Multiple Topics'
      }
    });
  } catch (err) {
    next(err);
  }
};

// Submit complete test, tally marks, update streaks
exports.submitTest = async (req, res, next) => {
  try {
    const { subject, topic, quizMode, timeSpent, answers } = req.body;
    const userId = req.user.id;

    if (!subject || !topic || !quizMode || timeSpent === undefined || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: subject, topic, quizMode, timeSpent, and answers'
      });
    }

    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let negativeMarksAccumulated = 0;
    const processedAnswers = [];

    for (const ans of answers) {
      const question = await MCQQuestion.findById(ans.questionId);
      if (!question) continue;

      const isCorrect = question.correctOptionIndex === ans.selectedOptionIndex;
      if (isCorrect) {
        score += (question.marks || 1);
        correctAnswers++;
      } else {
        wrongAnswers++;
        if (quizMode === 'Test') {
          negativeMarksAccumulated += (question.negativeMarks || 0.25);
        }
      }

      processedAnswers.push({
        questionId: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect,
        timeSpent: ans.timeSpent || 0
      });
    }

    const totalQuestions = answers.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const finalScore = Math.max(0, score - negativeMarksAccumulated);

    // 1. Create MCQTest document
    const mcqTest = await MCQTest.create({
      user: userId,
      subject,
      topic,
      quizMode,
      questions: answers.map(a => a.questionId),
      answers: processedAnswers,
      score: finalScore,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      timeSpent,
      accuracy,
      negativeMarksAccumulated
    });

    // 2. Create backward compatible MCQQuizResult document
    await MCQQuizResult.create({
      user: userId,
      subject,
      topic,
      score: finalScore,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      timeSpent,
      accuracy,
      quizMode,
      answers: processedAnswers.map(a => ({
        questionId: a.questionId,
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect: a.isCorrect
      }))
    });

    // 3. Create MCQSubmissions for granularity
    for (const ans of processedAnswers) {
      await MCQSubmission.create({
        user: userId,
        question: ans.questionId,
        selectedOptionIndex: ans.selectedOptionIndex,
        isCorrect: ans.isCorrect,
        timeSpent: ans.timeSpent,
        testId: mcqTest._id
      });
    }

    // 4. Update MCQProgress (Streaks, solved count, topic stats)
    let progress = await MCQProgress.findOne({ user: userId });
    if (!progress) {
      progress = new MCQProgress({ user: userId });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    // Streaks logic
    if (progress.lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const lastActiveStr = new Date(progress.lastActiveDate).toISOString().split('T')[0];

      if (lastActiveStr === yesterdayStr) {
        progress.currentStreak += 1;
        progress.dailySolvedCount = totalQuestions;
      } else if (lastActiveStr === todayStr) {
        progress.dailySolvedCount += totalQuestions;
      } else {
        progress.currentStreak = 1;
        progress.dailySolvedCount = totalQuestions;
      }
    } else {
      progress.currentStreak = 1;
      progress.dailySolvedCount = totalQuestions;
    }

    progress.lastActiveDate = new Date();
    progress.totalSolved += totalQuestions;
    progress.correctCount += correctAnswers;
    progress.wrongCount += wrongAnswers;
    progress.totalTimeSpent += timeSpent;

    // Subject stats
    let subStat = progress.subjectStats.find(s => s.subject === subject);
    if (!subStat) {
      subStat = { subject, solved: 0, correct: 0, totalTime: 0 };
      progress.subjectStats.push(subStat);
    }
    subStat.solved += totalQuestions;
    subStat.correct += correctAnswers;
    subStat.totalTime += timeSpent;

    // Topic stats
    let topStat = progress.topicStats.find(t => t.topic === topic);
    if (!topStat) {
      topStat = { topic, subject, solved: 0, correct: 0, totalTime: 0 };
      progress.topicStats.push(topStat);
    }
    topStat.solved += totalQuestions;
    topStat.correct += correctAnswers;
    topStat.totalTime += timeSpent;

    // Weekly progress track
    let weekStat = progress.weeklyProgress.find(w => w.date === todayStr);
    if (!weekStat) {
      weekStat = { date: todayStr, count: 0 };
      progress.weeklyProgress.push(weekStat);
    }
    weekStat.count += totalQuestions;

    // Check Badges & Achievements
    const badgesToAward = [];
    if (progress.totalSolved >= 1000 && !progress.badges.some(b => b.name === '1000 Questions')) badgesToAward.push('1000 Questions');
    else if (progress.totalSolved >= 500 && !progress.badges.some(b => b.name === '500 Questions')) badgesToAward.push('500 Questions');
    else if (progress.totalSolved >= 250 && !progress.badges.some(b => b.name === '250 Questions')) badgesToAward.push('250 Questions');
    else if (progress.totalSolved >= 100 && !progress.badges.some(b => b.name === '100 Questions')) badgesToAward.push('100 Questions');

    if (subject === 'Computer Science') {
      if (topic === 'Java' && correctAnswers >= 5 && !progress.badges.some(b => b.name === 'Java Master')) badgesToAward.push('Java Master');
      if (topic === 'DBMS' && correctAnswers >= 5 && !progress.badges.some(b => b.name === 'DBMS Master')) badgesToAward.push('DBMS Master');
      if (topic === 'Operating Systems' && correctAnswers >= 5 && !progress.badges.some(b => b.name === 'OS Master')) badgesToAward.push('OS Master');
      if (topic === 'Computer Networks' && correctAnswers >= 5 && !progress.badges.some(b => b.name === 'CN Master')) badgesToAward.push('CN Master');
    }

    if (subject === 'Company Prep') {
      if (topic === 'Google' && accuracy >= 80 && !progress.badges.some(b => b.name === 'Google Ready')) badgesToAward.push('Google Ready');
      if (topic === 'Amazon' && accuracy >= 80 && !progress.badges.some(b => b.name === 'Amazon Ready')) badgesToAward.push('Amazon Ready');
    }

    if (progress.currentStreak >= 30 && !progress.badges.some(b => b.name === '30 Day Streak')) badgesToAward.push('30 Day Streak');
    if (accuracy === 100 && totalQuestions >= 10 && !progress.badges.some(b => b.name === 'Perfect Score')) badgesToAward.push('Perfect Score');

    badgesToAward.forEach(badge => {
      progress.badges.push({ name: badge });
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      data: mcqTest,
      newBadges: badgesToAward
    });
  } catch (err) {
    next(err);
  }
};

// Add Bookmark
exports.addBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    const userId = req.user.id;

    const exists = await MCQBookmark.findOne({ user: userId, question: questionId });
    if (exists) {
      return res.status(200).json({ success: true, message: 'Already bookmarked', bookmarked: true });
    }

    await MCQBookmark.create({ user: userId, question: questionId });
    res.status(201).json({ success: true, message: 'Question bookmarked', bookmarked: true });
  } catch (err) {
    next(err);
  }
};

// Delete Bookmark
exports.deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params; // questionId
    const userId = req.user.id;

    await MCQBookmark.deleteOne({ user: userId, question: id });
    res.status(200).json({ success: true, message: 'Bookmark removed', bookmarked: false });
  } catch (err) {
    next(err);
  }
};

// Legacy Toggle Bookmark
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const existing = await MCQBookmark.findOne({ user: userId, question: questionId });
    if (existing) {
      await MCQBookmark.deleteOne({ _id: existing._id });
      res.status(200).json({ success: true, message: 'Removed', data: { bookmarked: false } });
    } else {
      await MCQBookmark.create({ user: userId, question: questionId });
      res.status(200).json({ success: true, message: 'Saved', data: { bookmarked: true } });
    }
  } catch (err) {
    next(err);
  }
};

// Get Bookmarked Questions
exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await MCQBookmark.find({ user: userId })
      .populate('question')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: { bookmarks: bookmarks.filter(b => b.question !== null) }
    });
  } catch (err) {
    next(err);
  }
};

// Get User's Quiz History
exports.getQuizHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await MCQTest.find({ user: userId })
      .sort({ completedAt: -1 })
      .populate({
        path: 'answers.questionId',
        select: 'question options correctOptionIndex explanation difficulty tags negativeMarks estimatedTime marks hints references'
      })
      .lean();

    res.status(200).json({
      success: true,
      data: { history }
    });
  } catch (err) {
    next(err);
  }
};

// Get detailed stats for Recharts
exports.getMcqStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await MCQProgress.findOne({ user: userId });
    const tests = await MCQTest.find({ user: userId }).sort({ completedAt: 1 }).lean();

    if (!progress || tests.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalQuizzes: 0,
          averageAccuracy: 0,
          totalQuestionsSolved: 0,
          subjectPerformance: [],
          recentPerformance: [],
          difficultyPerformance: [],
          weeklyProgress: []
        }
      });
    }

    // 1. Subject-wise accuracy
    const subjectPerformance = progress.subjectStats.map(s => ({
      subject: s.subject,
      accuracy: s.solved > 0 ? Math.round((s.correct / s.solved) * 100) : 0,
      totalSolved: s.solved
    }));

    // 2. Topic-wise accuracy
    const topicPerformance = progress.topicStats.map(t => ({
      topic: t.topic,
      subject: t.subject,
      accuracy: t.solved > 0 ? Math.round((t.correct / t.solved) * 100) : 0,
      totalSolved: t.solved,
      averageTime: t.solved > 0 ? Math.round(t.totalTime / t.solved) : 0
    }));

    // 3. Difficulty-wise accuracy
    const easySub = await MCQSubmission.find({ user: userId, question: { $in: await MCQQuestion.find({ difficulty: 'Easy' }).distinct('_id') } });
    const medSub = await MCQSubmission.find({ user: userId, question: { $in: await MCQQuestion.find({ difficulty: 'Medium' }).distinct('_id') } });
    const hardSub = await MCQSubmission.find({ user: userId, question: { $in: await MCQQuestion.find({ difficulty: 'Hard' }).distinct('_id') } });

    const getAcc = (subs) => {
      if (subs.length === 0) return 0;
      const correct = subs.filter(s => s.isCorrect).length;
      return Math.round((correct / subs.length) * 100);
    };

    const difficultyPerformance = [
      { difficulty: 'Easy', accuracy: getAcc(easySub), solved: easySub.length },
      { difficulty: 'Medium', accuracy: getAcc(medSub), solved: medSub.length },
      { difficulty: 'Hard', accuracy: getAcc(hardSub), solved: hardSub.length }
    ];

    // 4. Strongest and Weakest 5 Topics
    const sortedTopics = [...topicPerformance].sort((a, b) => b.accuracy - a.accuracy);
    const strongestTopics = sortedTopics.slice(0, 5);
    const weakestTopics = [...topicPerformance].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);

    // 5. Recent 7 attempts for Progress over time
    const recentPerformance = tests.slice(-7).map((t, idx) => ({
      index: idx + 1,
      date: new Date(t.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      accuracy: t.accuracy,
      score: t.score,
      total: t.totalQuestions,
      timeSpent: t.timeSpent
    }));

    // 6. Daily practice heatmap (solved count by date)
    const dailyMap = {};
    const submissions = await MCQSubmission.find({ user: userId });
    submissions.forEach(sub => {
      const dateStr = new Date(sub.submittedAt).toISOString().split('T')[0];
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + 1;
    });
    const dailyPracticeHeatmap = Object.keys(dailyMap).map(date => ({
      date,
      count: dailyMap[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 7. Average solving time
    const averageTime = progress.totalSolved > 0 ? Math.round(progress.totalTimeSpent / progress.totalSolved) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalQuizzes: tests.length,
        averageAccuracy: progress.totalSolved > 0 ? Math.round((progress.correctCount / progress.totalSolved) * 100) : 0,
        totalQuestionsSolved: progress.totalSolved,
        averageTime,
        subjectPerformance,
        topicPerformance,
        difficultyPerformance,
        strongestTopics,
        weakestTopics,
        recentPerformance,
        dailyPracticeHeatmap,
        weeklyProgress: progress.weeklyProgress.slice(-7)
      }
    });
  } catch (err) {
    next(err);
  }
};

// Adaptive learning recommendations
exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await MCQProgress.findOne({ user: userId });
    const targetCompany = req.user.targetCompany || 'Google';

    const recommendations = [];

    // Rule 1: Recommend target company prep
    recommendations.push({
      topic: targetCompany,
      subject: 'Company Prep',
      reason: `Boost your preparation specifically geared towards your target company: ${targetCompany}.`,
      difficulty: 'Medium'
    });

    if (progress && progress.topicStats.length > 0) {
      // Rule 2: Find topic with lowest accuracy (Weak area)
      const topicStatsWithAcc = progress.topicStats.map(t => ({
        ...t,
        accuracy: t.solved > 0 ? (t.correct / t.solved) : 0
      }));

      const weakestTopic = topicStatsWithAcc
        .filter(t => t.solved >= 3)
        .sort((a, b) => a.accuracy - b.accuracy)[0];

      if (weakestTopic && weakestTopic.accuracy < 0.6) {
        recommendations.push({
          topic: weakestTopic.topic,
          subject: weakestTopic.subject,
          reason: `High error rate (${Math.round((1 - weakestTopic.accuracy) * 100)}%) in this topic. Let's practice with Easy questions to review.`,
          difficulty: 'Easy'
        });
      }

      // Rule 3: Solve a topic that took too much time (Speed improvement)
      const slowTopic = topicStatsWithAcc
        .filter(t => t.solved >= 3)
        .sort((a, b) => (b.totalTime / b.solved) - (a.totalTime / a.solved))[0];

      if (slowTopic) {
        const avgTime = Math.round(slowTopic.totalTime / slowTopic.solved);
        recommendations.push({
          topic: slowTopic.topic,
          subject: slowTopic.subject,
          reason: `You take an average of ${avgTime}s per question here. Let's do a timed practice to increase speed.`,
          difficulty: 'Medium'
        });
      }
    }

    // Default CS core recommendation if list is short
    if (recommendations.length < 3) {
      recommendations.push({
        topic: 'DSA',
        subject: 'Computer Science',
        reason: 'Master data structures & algorithms which form 60%+ of tech interviews.',
        difficulty: 'Hard'
      });
    }

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (err) {
    next(err);
  }
};

// Global Leaderboard calculated dynamically
exports.getLeaderboard = async (req, res, next) => {
  try {
    // Dynamic aggregation of MCQProgress
    const progressList = await MCQProgress.find()
      .populate('user', 'fullName avatar email targetCompany targetRole')
      .lean();

    // Map and score candidates dynamically (score = correctCount * 10 - wrongCount * 2)
    const ranked = progressList
      .map(progress => {
        const score = Math.max(0, (progress.correctCount || 0) * 10 - (progress.wrongCount || 0) * 2);
        const accuracy = progress.totalSolved > 0 ? Math.round((progress.correctCount / progress.totalSolved) * 100) : 0;
        return {
          user: progress.user,
          score,
          accuracy,
          solved: progress.totalSolved,
          streak: progress.currentStreak,
          companyReadiness: accuracy // proxy for latest readiness
        };
      })
      .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy)
      .slice(0, 20);

    const formatted = ranked.map((item, idx) => ({
      rank: idx + 1,
      fullName: item.user?.fullName || 'Anonymous Candidate',
      email: item.user?.email || '',
      score: item.score,
      accuracy: item.accuracy,
      solved: item.solved,
      streak: item.streak,
      companyReadiness: item.companyReadiness,
      targetCompany: item.user?.targetCompany || 'Not Configured',
      targetRole: item.user?.targetRole || 'Software Engineer'
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

// Gemini AI Explanation helper with local pre-stored fallback
exports.getAiExplanation = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const questionObj = await MCQQuestion.findById(questionId);

    if (!questionObj) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    try {
      const prompt = `You are an expert technical interviewer and academic placements tutor.
Analyze the following Multiple Choice Question:
Subject: ${questionObj.subject}
Topic: ${questionObj.topic}
Question: ${questionObj.question}
Options:
${questionObj.options.map((opt, i) => `${i}. ${opt}`).join('\n')}
Correct Option: Index ${questionObj.correctOptionIndex} (${questionObj.options[questionObj.correctOptionIndex]})

Provide a comprehensive, clean concept breakdown and step-by-step explanation.
If the subject is Aptitude or Reasoning, provide logical reasoning, formulas used, step-by-step derivation, and any useful "Shortcuts/Placements Tricks" to solve this in under 30 seconds.
If the subject is Computer Science, explain the underlying theory (e.g., how the OS process scheduler works, DBMS indexing detail, OOPs principles) and why other options are incorrect.

Your response MUST be in JSON format matching the schema:
{
  "explanation": "A complete step-by-step breakdown of how to arrive at the correct answer.",
  "concept": "A 1-2 sentence summary of the core concept tested.",
  "shortcut": "Placements trick or shortcut to solve quickly (can be empty if not applicable).",
  "interviewTip": "An interview tip related to this topic for students in placements.",
  "relatedTopic": "A related topic or category name to research next.",
  "commonMistake": "What trap or common mistake candidates usually fall into on this question.",
  "learningResources": "Recommended reading, books, or articles."
}
Return raw JSON text. No markdown wraps or formatting tags.`;

      const response = await generateContentWithRetry(prompt, { temperature: 0.1 });
      let explanationData;

      try {
        explanationData = JSON.parse(response.text);
      } catch (parseErr) {
        const cleanedText = response.text.replace(/```json/gi, '').replace(/```/g, '').trim();
        explanationData = JSON.parse(cleanedText);
      }

      return res.status(200).json({
        success: true,
        data: explanationData
      });
    } catch (aiErr) {
      console.warn('[AI Explanation] Gemini API failed, falling back to local database stored explanation:', aiErr.message);
      // Fallback response using database-stored explanation
      return res.status(200).json({
        success: true,
        data: {
          explanation: questionObj.explanation || 'No step-by-step explanation is pre-configured for this question.',
          concept: `Core concept: ${questionObj.topic}`,
          shortcut: 'Review fundamental equations or concepts for this category to solve quickly.',
          interviewTip: 'Practice speed drills on this subject to ensure you can complete questions in under 1 minute.',
          relatedTopic: questionObj.topic,
          commonMistake: 'Failing to check calculations or forgetting edge conditions.',
          learningResources: `Refer to ${questionObj.subject} textbook chapters on ${questionObj.topic}.`
        }
      });
    }
  } catch (err) {
    next(err);
  }
};
