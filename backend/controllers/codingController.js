const CodingProblem = require('../models/CodingProblem');
const CodingSubmission = require('../models/CodingSubmission');
const CodingProgress = require('../models/CodingProgress');
const CodingBookmark = require('../models/CodingBookmark');
const { executeCode } = require('../services/codeExecutionService');

// Get all coding problems with optional search and filters
const getProblems = async (req, res) => {
  try {
    const { search, difficulty, category, tag, company } = req.query;
    const userId = req.user.id;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (company) {
      filter.companyTags = company;
    }

    const problems = await CodingProblem.find(filter).lean();

    // Retrieve user progress and bookmarks to mark problem states
    const progress = await CodingProgress.findOne({ user: userId });
    const bookmarks = await CodingBookmark.find({ user: userId });

    const solvedSet = new Set(progress ? progress.solvedProblems.map(id => id.toString()) : []);
    const bookmarkSet = new Set(bookmarks.map(b => b.problem.toString()));

    const problemsWithStatus = problems.map(prob => ({
      ...prob,
      status: solvedSet.has(prob._id.toString()) ? 'Solved' : 'Unsolved',
      isBookmarked: bookmarkSet.has(prob._id.toString())
    }));

    res.status(200).json({
      status: 'success',
      data: { problems: problemsWithStatus }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get problem details by slug
const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    const problem = await CodingProblem.findOne({ slug }).lean();
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Fetch note and bookmark states
    const bookmark = await CodingBookmark.findOne({ user: userId, problem: problem._id });
    const progress = await CodingProgress.findOne({ user: userId });

    let noteContent = '';
    if (progress) {
      const existingNote = progress.problemNotes.find(n => n.problem.toString() === problem._id.toString());
      if (existingNote) {
        noteContent = existingNote.content;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        problem,
        isBookmarked: !!bookmark,
        note: noteContent
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Test run code against sample test cases
const runCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Use the first sample testcase for run
    const sampleTestCase = problem.testCases.find(tc => !tc.isHidden) || problem.testCases[0];
    if (!sampleTestCase) {
      return res.status(400).json({ error: 'No testcases available for this problem' });
    }

    const result = await executeCode(language, code, sampleTestCase.input, sampleTestCase.output);

    res.status(200).json({
      status: 'success',
      data: {
        ...result,
        input: sampleTestCase.input,
        expectedOutput: sampleTestCase.output
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit code and evaluate against hidden and public test cases
const submitSolution = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user.id;

    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    let allPassed = true;
    let failedTestCase = null;
    let avgTime = 0;
    let maxMemory = 0;
    let executionOutputDetails = null;

    // Run code against all test cases
    for (const testCase of problem.testCases) {
      const result = await executeCode(language, code, testCase.input, testCase.output);
      avgTime += result.executionTime;
      maxMemory = Math.max(maxMemory, result.memory);

      if (result.verdict !== 'Accepted') {
        allPassed = false;
        failedTestCase = {
          input: testCase.isHidden ? 'Hidden testcase input' : testCase.input,
          expected: testCase.isHidden ? 'Hidden testcase expected' : testCase.output,
          actual: result.stdout || result.stderr || 'No output',
          verdict: result.verdict
        };
        executionOutputDetails = result;
        break;
      }
    }

    const finalVerdict = allPassed ? 'Accepted' : (executionOutputDetails ? executionOutputDetails.verdict : 'Wrong Answer');
    avgTime = Math.round(avgTime / problem.testCases.length);

    // Save Submission record
    const submission = await CodingSubmission.create({
      user: userId,
      problem: problemId,
      language,
      code,
      verdict: finalVerdict,
      executionTime: avgTime,
      memory: maxMemory
    });

    // Update user stats if the verdict is Accepted
    if (finalVerdict === 'Accepted') {
      let progress = await CodingProgress.findOne({ user: userId });
      if (!progress) {
        progress = new CodingProgress({ user: userId });
      }

      const alreadySolved = progress.solvedProblems.includes(problemId);
      if (!alreadySolved) {
        progress.solvedProblems.push(problemId);

        // Increment difficulty count
        if (problem.difficulty === 'Easy') progress.easySolved += 1;
        else if (problem.difficulty === 'Medium') progress.mediumSolved += 1;
        else if (problem.difficulty === 'Hard') progress.hardSolved += 1;
      }

      // Calculate streak
      const today = new Date().toISOString().split('T')[0];
      if (progress.lastActiveDate) {
        const lastActive = progress.lastActiveDate.toISOString().split('T')[0];
        const diffTime = Math.abs(new Date(today) - new Date(lastActive));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          progress.dailyStreak += 1;
        } else if (diffDays > 1) {
          progress.dailyStreak = 1;
        }
      } else {
        progress.dailyStreak = 1;
      }
      progress.lastActiveDate = new Date();

      // Log monthly activity counts
      const currentMonth = today.substring(0, 7); // YYYY-MM
      const monthlyLog = progress.monthlySubmissions.find(m => m.date === today);
      if (monthlyLog) {
        monthlyLog.count += 1;
      } else {
        progress.monthlySubmissions.push({ date: today, count: 1 });
      }

      // Update languages used
      const langLog = progress.languagesUsed.find(l => l.language.toLowerCase() === language.toLowerCase());
      if (langLog) {
        langLog.count += 1;
      } else {
        progress.languagesUsed.push({ language, count: 1 });
      }

      // Recalculate success rate based on user's total submissions
      const totalSubCount = await CodingSubmission.countDocuments({ user: userId });
      const acceptedCount = await CodingSubmission.countDocuments({ user: userId, verdict: 'Accepted' });
      progress.successRate = totalSubCount > 0 ? parseFloat(((acceptedCount / totalSubCount) * 100).toFixed(1)) : 100.0;

      await progress.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        submission,
        allPassed,
        failedTestCase
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get past submissions history
const getSubmissionsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await CodingSubmission.find({ user: userId })
      .populate('problem', 'title slug difficulty')
      .sort({ submittedAt: -1 })
      .lean();

    res.status(200).json({
      status: 'success',
      data: { submissions }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get stats & analytics
const getCodingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    let progress = await CodingProgress.findOne({ user: userId }).populate('solvedProblems', 'difficulty category');
    
    if (!progress) {
      progress = await CodingProgress.create({ user: userId });
    }

    const totalSolved = progress.solvedProblems.length;

    // Difficulty breakdown
    const difficultyDistribution = [
      { name: 'Easy', count: progress.easySolved, color: '#22c55e' },
      { name: 'Medium', count: progress.mediumSolved, color: '#eab308' },
      { name: 'Hard', count: progress.hardSolved, color: '#ef4444' }
    ];

    // Category breakdown
    const categoryCounts = {};
    progress.solvedProblems.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      count: categoryCounts[cat]
    }));

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalSolved,
          easySolved: progress.easySolved,
          mediumSolved: progress.mediumSolved,
          hardSolved: progress.hardSolved,
          dailyStreak: progress.dailyStreak,
          successRate: progress.successRate,
          languagesUsed: progress.languagesUsed,
          monthlySubmissions: progress.monthlySubmissions
        },
        difficultyDistribution,
        categoryDistribution
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bookmark problem
const addBookmark = async (req, res) => {
  try {
    const { problemId } = req.body;
    const userId = req.user.id;

    const bookmark = await CodingBookmark.create({
      user: userId,
      problem: problemId
    });

    res.status(200).json({
      status: 'success',
      data: { bookmark }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove bookmark
const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params; // problemId
    const userId = req.user.id;

    await CodingBookmark.deleteOne({ user: userId, problem: id });

    res.status(200).json({
      status: 'success',
      message: 'Bookmark removed successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save notes per problem
const saveNotes = async (req, res) => {
  try {
    const { problemId, content } = req.body;
    const userId = req.user.id;

    let progress = await CodingProgress.findOne({ user: userId });
    if (!progress) {
      progress = new CodingProgress({ user: userId });
    }

    const existingNoteIdx = progress.problemNotes.findIndex(n => n.problem.toString() === problemId);
    if (existingNoteIdx > -1) {
      progress.problemNotes[existingNoteIdx].content = content;
      progress.problemNotes[existingNoteIdx].updatedAt = new Date();
    } else {
      progress.problemNotes.push({
        problem: problemId,
        content,
        updatedAt: new Date()
      });
    }

    await progress.save();

    res.status(200).json({
      status: 'success',
      message: 'Notes updated successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProblems,
  getProblemBySlug,
  runCode,
  submitSolution,
  getSubmissionsHistory,
  getCodingStats,
  addBookmark,
  deleteBookmark,
  saveNotes
};
