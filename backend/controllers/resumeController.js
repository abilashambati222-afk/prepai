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
 */
const deleteFileFromDisk = async (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (err) {
    // File doesn't exist or deletion failed
    console.warn(`[Disk cleanup] Attempted to delete missing or locked file: ${filename}`);
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

    // 3. Cache Match Check: If uploaded file hash is identical, skip reset
    const oldMetadata = user.resumeMetadata || {};
    const oldHash = oldMetadata.fileHash;

    if (oldHash === fileHash) {
      // Clean up duplicate temp upload from local storage
      await deleteFileFromDisk(file.filename);
      
      return res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully (Identical file detected, using cached version).',
        data: {
          resumeMetadata: user.resumeMetadata
        }
      });
    }

    const oldFileName = oldMetadata.storedFileName;
    const oldVersion = oldMetadata.version || 0;
    const oldResumeId = oldMetadata.resumeId;

    const resumeId = oldResumeId || new mongoose.Types.ObjectId().toString();
    const version = oldVersion + 1;

    // 4. Cleanup old file from disk
    if (oldFileName) {
      await deleteFileFromDisk(oldFileName);
    }

    // 5. Store metadata directly on user schema
    user.resumeMetadata = {
      resumeId,
      version,
      fileHash,
      status: 'Uploaded',
      uploadedAt: new Date(),
      fileSize: file.size,
      storagePath: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      originalFileName: file.originalname,
      storedFileName: file.filename,
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
      message: 'Resume uploaded successfully.',
      data: {
        resumeMetadata: user.resumeMetadata
      }
    });
  } catch (err) {
    // Cleanup on failure
    if (req.file) {
      await deleteFileFromDisk(req.file.filename);
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

    // 1. Remove physical file from disk
    await deleteFileFromDisk(user.resumeMetadata.storedFileName);

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
    // 1. Update status to Parsing
    user.resumeMetadata.status = 'Parsing';
    user.resumeMetadata.parsingLogs.startedAt = startedAt;
    await user.save({ validateBeforeSave: false });

    // 2. Read PDF buffer from disk
    const filePath = path.join(__dirname, '..', 'uploads', user.resumeMetadata.storedFileName);
    const fileBuffer = await fs.readFile(filePath);

    // 3. Extract and parse using the modular parsing engine
    const { rawText, parsedData, parsingConfidence } = await parseResume(fileBuffer, {
      size: user.resumeMetadata.fileSize,
      name: user.resumeMetadata.originalFileName
    });

    const completedAt = new Date();
    const duration = completedAt.getTime() - startedAt.getTime();

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

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
        success: false,
        error: err.message,
        stack: err.stack
    });
}
  }
;

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
