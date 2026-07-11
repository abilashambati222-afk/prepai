const JobDescription = require('../models/JobDescription');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

/**
 * Create a new Job Description
 * POST /api/v1/job-descriptions
 */
exports.createJobDescription = async (req, res, next) => {
  try {
    const { title, company, jobRole, jobDescriptionText } = req.body;

    if (!title || !company || !jobDescriptionText) {
      return next(new BadRequestError('Title, Company, and Job Description content are required.'));
    }

    const jd = await JobDescription.create({
      user: req.user._id,
      title,
      company,
      jobRole: jobRole || title,
      jobDescriptionText
    });

    res.status(201).json({
      success: true,
      message: 'Job Description saved successfully.',
      data: {
        jobDescription: jd
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all Job Descriptions for the logged-in user
 * GET /api/v1/job-descriptions
 */
exports.getMyJobDescriptions = async (req, res, next) => {
  try {
    const jds = await JobDescription.find({ user: req.user._id })
      .sort({ lastUsed: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Job Descriptions retrieved successfully.',
      data: {
        jobDescriptions: jds
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific Job Description
 * GET /api/v1/job-descriptions/:id
 */
exports.getJobDescription = async (req, res, next) => {
  try {
    const jd = await JobDescription.findOne({ _id: req.params.id, user: req.user._id });

    if (!jd) {
      return next(new NotFoundError('Job Description not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Job Description retrieved successfully.',
      data: {
        jobDescription: jd
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a Job Description
 * PUT /api/v1/job-descriptions/:id
 */
exports.updateJobDescription = async (req, res, next) => {
  try {
    const { title, company, jobRole, jobDescriptionText, favorite } = req.body;

    const jd = await JobDescription.findOne({ _id: req.params.id, user: req.user._id });

    if (!jd) {
      return next(new NotFoundError('Job Description not found.'));
    }

    if (title) jd.title = title;
    if (company) jd.company = company;
    if (jobRole !== undefined) jd.jobRole = jobRole;
    if (jobDescriptionText) {
      // Invalidate existing cache if JD text changes
      if (jd.jobDescriptionText !== jobDescriptionText) {
        jd.jobDescriptionText = jobDescriptionText;
        jd.aiAnalysisStatus = 'Idle';
        jd.aiAnalysisData = null;
        jd.analyzedResumeHash = '';
      }
    }
    if (favorite !== undefined) jd.favorite = favorite;

    await jd.save();

    res.status(200).json({
      success: true,
      message: 'Job Description updated successfully.',
      data: {
        jobDescription: jd
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a Job Description
 * DELETE /api/v1/job-descriptions/:id
 */
exports.deleteJobDescription = async (req, res, next) => {
  try {
    const jd = await JobDescription.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!jd) {
      return next(new NotFoundError('Job Description not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'Job Description deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};
