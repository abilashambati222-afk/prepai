const User = require('../models/User');
const JobDescription = require('../models/JobDescription');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const { buildResumeAnalysisPrompt } = require('../services/ai/promptBuilder');
const { generateContentWithRetry } = require('../services/ai/geminiClient');
const { parseAiResponse } = require('../services/ai/responseParser');
const { validateAnalysisResult } = require('../services/ai/resultValidator');

/**
 * Trigger Gemini AI Resume Analysis against a selected Job Description
 * POST /api/v1/resume/analyze
 */
exports.analyzeResume = async (req, res, next) => {
  const user = req.user;

  // 1. Ensure the resume has been successfully parsed first
  if (!user.resumeMetadata || user.resumeMetadata.status !== 'Parsed') {
    return next(new BadRequestError('Resume must be parsed before triggering AI Resume Analysis.'));
  }

  const { jobDescriptionId } = req.body;
  if (!jobDescriptionId) {
    return next(new BadRequestError('jobDescriptionId is required.'));
  }

  try {
    // 2. Fetch target Job Description
    const jd = await JobDescription.findOne({ _id: jobDescriptionId, user: req.user._id });
    if (!jd) {
      return next(new NotFoundError('Job Description not found.'));
    }

    // 3. Cache Match Check: If already analyzed for this exact resume file hash, return cached results directly
    if (jd.aiAnalysisStatus === 'Analyzed' && jd.analyzedResumeHash === user.resumeMetadata.fileHash && jd.aiAnalysisData) {
      jd.lastUsed = new Date();
      await jd.save();

      return res.status(200).json({
        success: true,
        message: 'Resume analyzed successfully by Gemini AI (Cached).',
        data: {
          aiAnalysisStatus: jd.aiAnalysisStatus,
          lastAnalyzed: jd.updatedAt,
          aiAnalysisData: jd.aiAnalysisData,
          aiAnalysisMetadata: jd.aiAnalysisMetadata,
          cached: true
        }
      });
    }

    const startedAt = Date.now();

    // 4. Shift status to Analyzing
    jd.aiAnalysisStatus = 'Analyzing';
    await jd.save();

    // 5. Build Prompt
    const prompt = buildResumeAnalysisPrompt(user.resumeMetadata.parsedData, user, jd.jobDescriptionText);

    // 6. Generate Content via Gemini
    const { text: rawResponse, usageMetadata } = await generateContentWithRetry(prompt);

    const responseTime = Date.now() - startedAt;

    // 7. Parse Response String into JS Object
    const analysisData = parseAiResponse(rawResponse);

    // 8. Validate Output Fields
    validateAnalysisResult(analysisData);

    // 9. Store Output in Job Description document
    jd.aiAnalysisData = analysisData;
    jd.aiAnalysisStatus = 'Analyzed';
    jd.analyzedResumeHash = user.resumeMetadata.fileHash;
    jd.lastUsed = new Date();

    jd.aiAnalysisMetadata = {
      modelName: 'gemini-2.5-flash',
      promptVersion: '1.0.0',
      analyzedAt: new Date(),
      responseTime,
      tokenUsage: {
        promptTokens: usageMetadata?.promptTokenCount || 0,
        candidatesTokens: usageMetadata?.candidatesTokenCount || 0,
        totalTokens: usageMetadata?.totalTokenCount || 0
      },
      analysisVersion: '1.0.0'
    };
    await jd.save();

    // 10. Update latest summary status on User metadata for dashboard view
    user.resumeMetadata.aiAnalysisStatus = 'Analyzed';
    user.resumeMetadata.aiAnalysisData = analysisData;
    user.resumeMetadata.lastAnalyzed = new Date();

    // Accumulate extracted skills
    const currentSkills = user.resumeMetadata.skillsExtracted || [];
    const newSkills = [
      ...(analysisData.missingSkills || []),
      ...(analysisData.recommendedTechnologies || [])
    ];
    user.resumeMetadata.skillsExtracted = [...new Set([...currentSkills, ...newSkills])];

    // Placeholder for atsScore (next phase)
    user.resumeMetadata.atsScore = null;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully by Gemini AI.',
      data: {
        aiAnalysisStatus: jd.aiAnalysisStatus,
        lastAnalyzed: jd.lastUsed,
        aiAnalysisData: jd.aiAnalysisData,
        aiAnalysisMetadata: jd.aiAnalysisMetadata,
        cached: false
      }
    });

  } catch (err) {
    // Attempt to set status to Failed on exception
    try {
      const jd = await JobDescription.findOne({ _id: jobDescriptionId, user: req.user._id });
      if (jd) {
        jd.aiAnalysisStatus = 'Failed';
        await jd.save();
      }
    } catch (dbErr) {
      console.error('Failed to set JobDescription status to Failed:', dbErr);
    }
    next(err);
  }
};

/**
 * Fetch detailed AI Resume Analysis output for a Job Description
 * GET /api/v1/resume/analysis
 */
exports.getAnalysisData = async (req, res, next) => {
  const { jobDescriptionId } = req.query;
  if (!jobDescriptionId) {
    return next(new BadRequestError('jobDescriptionId query parameter is required.'));
  }

  try {
    const jd = await JobDescription.findOne({ _id: jobDescriptionId, user: req.user._id });
    if (!jd || jd.aiAnalysisStatus !== 'Analyzed') {
      return next(new BadRequestError('No analyzed resume data found for this Job Description.'));
    }

    res.status(200).json({
      success: true,
      message: 'AI analysis data retrieved successfully.',
      data: {
        aiAnalysisData: jd.aiAnalysisData,
        aiAnalysisMetadata: jd.aiAnalysisMetadata
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Fetch active analysis status lifecycle details for a Job Description
 * GET /api/v1/resume/analysis/status
 */
exports.getAnalysisStatus = async (req, res, next) => {
  const { jobDescriptionId } = req.query;
  if (!jobDescriptionId) {
    return next(new BadRequestError('jobDescriptionId query parameter is required.'));
  }

  try {
    const jd = await JobDescription.findOne({ _id: jobDescriptionId, user: req.user._id });
    if (!jd) {
      return next(new NotFoundError('Job Description not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'AI analysis status retrieved successfully.',
      data: {
        aiAnalysisStatus: jd.aiAnalysisStatus,
        lastAnalyzed: jd.lastUsed,
        aiAnalysisMetadata: jd.aiAnalysisMetadata
      }
    });
  } catch (err) {
    next(err);
  }
};
