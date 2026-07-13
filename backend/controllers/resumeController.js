const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const { parseResume } = require('../services/resumeParser/parser');

/**
 * Helper to delete a file from local disk safely
 * @param {string} filename - The stored filename in uploads directory
 * @param {string} userId - User ID subdirectory path if applicable
 */
const deleteFileFromDisk = async (filename, userId = '') => {
  if (!filename) return;
  const filePath = userId 
    ? path.join(__dirname, '..', 'uploads', 'resumes', userId.toString(), filename)
    : path.join(__dirname, '..', 'uploads', filename);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    // File doesn't exist or deletion failed
    console.warn(`[Disk cleanup] Attempted to delete missing or locked file: ${filename}`);
  }
};

/**
 * Helper to delete the entire user resumes folder recursively
 * @param {string} userId - User ID subdirectory to remove
 */
const deleteUserResumesFolder = async (userId) => {
  if (!userId) return;
  const userDir = path.join(__dirname, '..', 'uploads', 'resumes', userId.toString());
  try {
    await fs.rm(userDir, { recursive: true, force: true });
  } catch (err) {
    console.warn(`[Disk cleanup] Attempted to delete missing or locked user directory: ${userId}`);
  }
};

/**
 * Handle new resume upload or replacement
 * POST /api/v1/resume/upload
 * PUT /api/v1/resume/replace
 */
exports.uploadResume = async (req, res, next) => {
  try {
    const file = req.file;

    // 1. Ensure file is present
    if (!file) {
      return next(new BadRequestError('No resume file provided. Please upload a PDF file.'));
    }

    const user = req.user;

    // 2. Read file to calculate SHA-256 Hash
    const fileBuffer = await fs.readFile(file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 3. Cache Match Check: If uploaded file hash is identical, skip reset unless forced
    const oldMetadata = user.resumeMetadata || {};
    const oldHash = oldMetadata.fileHash;

    if (oldHash === fileHash && req.body.forceReanalyze !== 'true' && req.query.forceReanalyze !== 'true') {
      // Clean up duplicate temp upload from local storage
      await deleteFileFromDisk(file.filename, user._id);
      
      return res.status(200).json({
        success: true,
        duplicate: true,
        message: 'This resume is identical to your latest uploaded version. Do you want to analyze it again?',
        data: {
          resumeMetadata: user.resumeMetadata
        }
      });
    }

    const oldVersion = oldMetadata.version || 0;
    const oldResumeId = oldMetadata.resumeId;

    const resumeId = oldResumeId || new mongoose.Types.ObjectId().toString();
    const version = oldVersion + 1;

    // Push the current resume to version history before overwriting (lightweight)
    if (oldMetadata && oldMetadata.version) {
      user.resumeVersions.push({
        version: oldMetadata.version,
        uploadedAt: oldMetadata.uploadedAt || new Date(),
        atsScore: oldMetadata.atsScore || 0,
        fileHash: oldMetadata.fileHash,
        summary: oldMetadata.analysisSummary || '',
        storagePath: oldMetadata.storagePath,
        analysisSnapshot: {
          skills: oldMetadata.parsedData?.skills || [],
          projects: oldMetadata.parsedData?.projects || [],
          certifications: oldMetadata.parsedData?.certifications || [],
          education: oldMetadata.parsedData?.education || [],
          experience: oldMetadata.parsedData?.experience || [],
          links: oldMetadata.parsedData?.links || {},
          resumeHealth: oldMetadata.resumeHealth,
          resumeQuality: oldMetadata.resumeQuality,
          sectionScores: oldMetadata.sectionScores,
          atsChecklist: oldMetadata.atsChecklist
        }
      });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const finalFileName = `v${version}${ext}`;
    const userDir = path.dirname(file.path);
    const finalFilePath = path.join(userDir, finalFileName);
    
    // Rename temp file to final versioned name v[version].pdf
    await fs.rename(file.path, finalFilePath);

    // 5. Store metadata directly on user schema
    user.resumeMetadata = {
      resumeId,
      version,
      fileHash,
      status: 'Uploaded',
      uploadedAt: new Date(),
      fileSize: file.size,
      storagePath: `/uploads/resumes/${user._id.toString()}/${finalFileName}`,
      mimeType: file.mimetype,
      originalFileName: file.originalname,
      storedFileName: finalFileName,
      rawText: '',
      parsedData: {},
      parsingConfidence: 0,
      parserVersion: '1.0.0',
      parsingLogs: {
        startedAt: null,
        completedAt: null,
        duration: 0,
        errors: []
      },
      aiAnalysisStatus: 'Idle',
      atsScore: null,
      lastAnalyzed: null,
      skillsExtracted: [],
      analysisSummary: '',
      analysisStatus: 'Idle',
      analysisDuration: 0,
      resumeHealth: 'Average',
      resumeQuality: 0,
      atsChecklist: {},
      processingSteps: [
        { step: 'Uploading', status: 'Completed', startedAt: new Date(), completedAt: new Date(), duration: 150 },
        { step: 'Parsing', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
        { step: 'Extracting Skills', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
        { step: 'Calculating ATS', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
        { step: 'Running AI Analysis', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
        { step: 'Saving Results', status: 'Pending', startedAt: null, completedAt: null, duration: 0 }
      ],
      lastComparisonVersion: oldVersion || null
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully.',
      data: {
        resumeMetadata: user.resumeMetadata
      }
    });
  } catch (err) {
    // Cleanup on failure
    if (req.file) {
      await deleteFileFromDisk(req.file.filename, user?._id);
    }
    next(err);
  }
};

/**
 * Fetch active resume metadata
 * GET /api/v1/resume
 */
exports.getResume = async (req, res, next) => {
  const user = req.user;

  if (!user.resumeMetadata || !user.resumeMetadata.storedFileName) {
    return next(new NotFoundError('No resume has been uploaded yet.'));
  }

  res.status(200).json({
    success: true,
    message: 'Resume metadata retrieved successfully.',
    data: {
      resumeMetadata: user.resumeMetadata
    }
  });
};

/**
 * Delete resume and unlink from disk storage
 * DELETE /api/v1/resume
 */
exports.deleteResume = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.resumeMetadata || !user.resumeMetadata.storedFileName) {
      return next(new BadRequestError('No resume found to delete.'));
    }

    // 1. Remove physical files folder from disk
    await deleteUserResumesFolder(user._id);

    // 2. Reset metadata fields
    user.resumeMetadata = {
      resumeId: '',
      version: 1,
      fileHash: '',
      status: 'Uploaded',
      uploadedAt: null,
      fileSize: 0,
      storagePath: '',
      mimeType: '',
      originalFileName: '',
      storedFileName: '',
      rawText: '',
      parsedData: {},
      parsingConfidence: 0,
      parserVersion: '1.0.0',
      parsingLogs: {
        startedAt: null,
        completedAt: null,
        duration: 0,
        errors: []
      },
      aiAnalysisStatus: null,
      atsScore: null,
      lastAnalyzed: null,
      skillsExtracted: []
    };

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Trigger Resume Parsing Engine
 * POST /api/v1/resume/parse
 */
exports.parseResume = async (req, res, next) => {
  const user = req.user;

  if (!user.resumeMetadata || !user.resumeMetadata.storedFileName) {
    return next(new BadRequestError('Please upload a resume before triggering the parsing engine.'));
  }

  const startedAt = new Date();

  try {
    // 1. Update status to Parsing and set processing steps
    user.resumeMetadata.status = 'Parsing';
    user.resumeMetadata.parsingLogs.startedAt = startedAt;
    user.resumeMetadata.processingSteps = [
      { step: 'Uploading', status: 'Completed', startedAt: startedAt, completedAt: startedAt, duration: 150 },
      { step: 'Parsing', status: 'In Progress', startedAt: startedAt, completedAt: null, duration: 0 },
      { step: 'Extracting Skills', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
      { step: 'Calculating ATS', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
      { step: 'Running AI Analysis', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
      { step: 'Saving Results', status: 'Pending', startedAt: null, completedAt: null, duration: 0 }
    ];
    await user.save({ validateBeforeSave: false });

    // 2. Read PDF buffer from disk
    const filePath = path.join(__dirname, '..', 'uploads', 'resumes', user._id.toString(), user.resumeMetadata.storedFileName);
    const fileBuffer = await fs.readFile(filePath);

    // 3. Extract and parse using the modular parsing engine
    const { rawText, parsedData, parsingConfidence } = await parseResume(fileBuffer, {
      size: user.resumeMetadata.fileSize,
      name: user.resumeMetadata.originalFileName
    });

    const completedAt = new Date();
    const duration = completedAt.getTime() - startedAt.getTime();

    // 3.5 Run rule engine calculations
    const { evaluateResume } = require('../services/career/ruleEngine');
    const evaluation = evaluateResume(parsedData, user);

    // Inject metrics in parsedData metadata
    parsedData.metadata.atsScore = evaluation.overallScore;
    parsedData.metadata.resumeHealth = evaluation.resumeHealth;
    parsedData.metadata.resumeQuality = evaluation.resumeQuality;
    parsedData.metadata.sectionScores = evaluation.sectionScores;
    parsedData.metadata.atsChecklist = evaluation.atsChecklist;
    parsedData.metadata.readability = evaluation.readability;
    parsedData.metadata.completeness = evaluation.completeness;

    // 4. Update model fields on success
    user.resumeMetadata.rawText = rawText;
    user.resumeMetadata.parsedData = parsedData;
    user.resumeMetadata.parsingConfidence = parsingConfidence;
    user.resumeMetadata.skillsExtracted = parsedData.skills || [];
    user.resumeMetadata.status = 'Parsed';
    user.resumeMetadata.parsingLogs = {
      startedAt,
      completedAt,
      duration,
      errors: []
    };

    user.resumeMetadata.atsScore = evaluation.overallScore;
    user.resumeMetadata.resumeHealth = evaluation.resumeHealth;
    user.resumeMetadata.resumeQuality = evaluation.resumeQuality;
    user.resumeMetadata.sectionScores = evaluation.sectionScores;
    user.resumeMetadata.atsChecklist = evaluation.atsChecklist;

    // Update steps
    const uploadTime = user.resumeMetadata.uploadedAt || startedAt;
    user.resumeMetadata.processingSteps = [
      { step: 'Uploading', status: 'Completed', startedAt: uploadTime, completedAt: uploadTime, duration: 150 },
      { step: 'Parsing', status: 'Completed', startedAt: startedAt, completedAt: completedAt, duration: duration },
      { step: 'Extracting Skills', status: 'Completed', startedAt: completedAt, completedAt: completedAt, duration: 40 },
      { step: 'Calculating ATS', status: 'Completed', startedAt: completedAt, completedAt: completedAt, duration: 25 },
      { step: 'Running AI Analysis', status: 'Pending', startedAt: null, completedAt: null, duration: 0 },
      { step: 'Saving Results', status: 'Completed', startedAt: completedAt, completedAt: completedAt, duration: 15 }
    ];

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Resume parsed successfully.',
      data: {
        resumeMetadata: user.resumeMetadata
      }
    });
  } catch (err) {
    
    console.log("\n================ PARSE ERROR ================\n");
    console.error(err);
    console.error(err.stack);

    const completedAt = new Date();
    const duration = completedAt.getTime() - startedAt.getTime();

    user.resumeMetadata.status = 'Failed';
    user.resumeMetadata.parsingLogs = {
        startedAt,
        completedAt,
        duration,
        errors: [err.message]
    };

    // Mark steps as failed
    if (user.resumeMetadata.processingSteps && user.resumeMetadata.processingSteps.length > 0) {
      user.resumeMetadata.processingSteps = user.resumeMetadata.processingSteps.map(step => {
        if (step.status === 'In Progress' || step.status === 'Pending') {
          step.status = 'Failed';
          step.completedAt = completedAt;
          if (step.startedAt) {
            step.duration = completedAt.getTime() - step.startedAt.getTime();
          }
        }
        return step;
      });
    }

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
        success: false,
        error: err.message,
        stack: err.stack
    });
  }
};

/**
 * Fetch parsed structured data JSON
 * GET /api/v1/resume/parsed
 */
exports.getParsedData = async (req, res, next) => {
  const user = req.user;

  if (!user.resumeMetadata || user.resumeMetadata.status !== 'Parsed') {
    return next(new BadRequestError('No parsed resume data found. Please parse your resume first.'));
  }

  res.status(200).json({
    success: true,
    message: 'Parsed resume data retrieved successfully.',
    data: {
      parsedData: user.resumeMetadata.parsedData
    }
  });
};

/**
 * Fetch current parsing status lifecycle details
 * GET /api/v1/resume/status
 */
exports.getParsingStatus = async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: 'Parsing status retrieved successfully.',
    data: {
      status: user.resumeMetadata?.status || 'Uploaded',
      version: user.resumeMetadata?.version || 1,
      parsingConfidence: user.resumeMetadata?.parsingConfidence || 0,
      parserVersion: user.resumeMetadata?.parserVersion || '1.0.0',
      lastParsed: user.resumeMetadata?.parsingLogs?.completedAt || user.resumeMetadata?.uploadedAt || null
    }
  });
};

/**
 * Compare current resume version with a historical version
 * GET /api/v1/resume/compare
 */
exports.compareResumes = async (req, res, next) => {
  const user = req.user;
  const currentVersion = user.resumeMetadata?.version || 1;
  
  if (!user.resumeVersions || user.resumeVersions.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        hasComparison: false,
        message: 'No previous resume versions found to compare against.'
      }
    });
  }

  // Find version (v-1) or fall back to the most recent historical version
  const prevVersion = user.resumeVersions.find(v => v.version === currentVersion - 1) || user.resumeVersions[user.resumeVersions.length - 1];

  if (!prevVersion) {
    return res.status(200).json({
      success: true,
      data: {
        hasComparison: false,
        message: 'Previous resume version not found.'
      }
    });
  }

  const currSkills = user.resumeMetadata?.parsedData?.skills || [];
  const prevSkills = prevVersion.analysisSnapshot?.skills || [];
  
  const newSkills = currSkills.filter(s => !prevSkills.some(p => p.toLowerCase().trim() === s.toLowerCase().trim()));
  const removedSkills = prevSkills.filter(p => !currSkills.some(s => s.toLowerCase().trim() === p.toLowerCase().trim()));

  const currProj = (user.resumeMetadata?.parsedData?.projects || []).map(p => p.title || p.name || '').filter(Boolean);
  const prevProj = (prevVersion.analysisSnapshot?.projects || []).map(p => p.title || p.name || '').filter(Boolean);
  const newProjects = currProj.filter(p => !prevProj.some(pr => pr.toLowerCase().trim() === p.toLowerCase().trim()));

  // Certifications Comparison
  const currCert = (user.resumeMetadata?.parsedData?.certifications || []).map(c => c.name || c.title || c.certificationName || c.toString()).filter(Boolean);
  const prevCert = (prevVersion.analysisSnapshot?.certifications || []).map(c => c.name || c.title || c.certificationName || c.toString()).filter(Boolean);
  const newCertifications = currCert.filter(c => !prevCert.some(pr => pr.toLowerCase().trim() === c.toLowerCase().trim()));
  const removedCertifications = prevCert.filter(pr => !currCert.some(c => c.toLowerCase().trim() === pr.toLowerCase().trim()));

  // Experience Comparison (New Roles)
  const currExp = (user.resumeMetadata?.parsedData?.experience || []).map(e => e.role || e.title || '').filter(Boolean);
  const prevExp = (prevVersion.analysisSnapshot?.experience || []).map(e => e.role || e.title || '').filter(Boolean);
  const newExperience = currExp.filter(e => !prevExp.some(pr => pr.toLowerCase().trim() === e.toLowerCase().trim()));

  // Education Comparison (New Institutions/Degrees)
  const currEdu = (user.resumeMetadata?.parsedData?.education || []).map(ed => ed.institution || ed.school || '').filter(Boolean);
  const prevEdu = (prevVersion.analysisSnapshot?.education || []).map(ed => ed.institution || ed.school || '').filter(Boolean);
  const newEducation = currEdu.filter(ed => !prevEdu.some(pr => pr.toLowerCase().trim() === ed.toLowerCase().trim()));

  // Links Comparison
  const currLinks = user.resumeMetadata?.parsedData?.links || {};
  const prevLinks = prevVersion.analysisSnapshot?.links || {};
  const newLinks = Object.keys(currLinks)
    .filter(k => currLinks[k] && (!prevLinks[k] || prevLinks[k] !== currLinks[k]))
    .map(k => ({ platform: k, url: currLinks[k] }));

  // Formatting Improvements Comparison
  const bulletsImproved = user.resumeMetadata?.atsChecklist?.bulletPointsFound && !prevVersion.analysisSnapshot?.atsChecklist?.bulletPointsFound;
  const verbsImproved = user.resumeMetadata?.atsChecklist?.actionVerbsFound && !prevVersion.analysisSnapshot?.atsChecklist?.actionVerbsFound;
  const formattingImprovements = [];
  if (bulletsImproved) formattingImprovements.push('Standardized bullet formatting added');
  if (verbsImproved) formattingImprovements.push('Action verbs matching density improved');

  // Keyword Score comparison
  const keywordScoreCurrent = user.resumeMetadata?.keywordScore || 75;
  const keywordScorePrevious = prevVersion.analysisSnapshot?.keywordScore || 75;
  const keywordDiff = keywordScoreCurrent - keywordScorePrevious;

  // Company Readiness Comparison using Snapshots
  const atsDiff = (user.resumeMetadata?.atsScore || 0) - (prevVersion.atsScore || 0);

  res.status(200).json({
    success: true,
    data: {
      hasComparison: true,
      currentVersion,
      previousVersion: prevVersion.version,
      atsDiff,
      atsScoreCurrent: user.resumeMetadata?.atsScore || 0,
      atsScorePrevious: prevVersion.atsScore || 0,
      newSkills,
      removedSkills,
      newProjects,
      newCertifications,
      removedCertifications,
      newExperience,
      newEducation,
      newLinks,
      formattingImprovements,
      keywordDiff,
      healthCurrent: user.resumeMetadata?.resumeHealth || 'Average',
      healthPrevious: prevVersion.analysisSnapshot?.resumeHealth || 'Average',
      qualityCurrent: user.resumeMetadata?.resumeQuality || 0,
      qualityPrevious: prevVersion.analysisSnapshot?.resumeQuality || 0
    }
  });
};
