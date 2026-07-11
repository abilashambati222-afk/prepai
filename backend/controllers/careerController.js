const Career = require('../models/Career');
const { analyzeCareerProfile } = require('../services/career/careerEngine');
const { getProgressComparison } = require('../services/career/historyTracker');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

/**
 * Trigger hybrid Career Intelligence analysis (Rule Engine + Gemini)
 * POST /api/v1/career/analyze
 */
exports.analyzeCareer = async (req, res, next) => {
  try {
    const { jobDescriptionId } = req.body;
    const user = req.user;

    // Run the hybrid intelligence analysis
    const analysisResults = await analyzeCareerProfile(user, jobDescriptionId);

    // Look for an existing Career document
    let career = await Career.findOne({ user: user._id });

    if (career) {
      // Overwrite current profile results
      career.careerScore = analysisResults.careerScore;
      career.resumeHash = analysisResults.resumeHash;
      career.companyReadiness = analysisResults.companyReadiness;
      career.companyRecommendations = analysisResults.companyRecommendations;
      career.recommendedRoles = analysisResults.recommendedRoles;
      career.roadmap = analysisResults.roadmap;
      career.resources = analysisResults.resources;
      career.projects = analysisResults.projects;
      career.certifications = analysisResults.certifications;
      career.salaryPrediction = analysisResults.salaryPrediction;
      career.timeline = analysisResults.timeline;
      career.motivationalSummary = analysisResults.motivationalSummary;

      // Handle skill gap array updates
      if (analysisResults.skillGapReport) {
        const gapIndex = career.skillGaps.findIndex(
          gap => gap.jobDescriptionId.toString() === analysisResults.skillGapReport.jobDescriptionId.toString()
        );

        if (gapIndex >= 0) {
          career.skillGaps[gapIndex] = analysisResults.skillGapReport;
        } else {
          career.skillGaps.push(analysisResults.skillGapReport);
        }
      }

      await career.save();
    } else {
      // Create new document
      career = await Career.create({
        user: user._id,
        careerScore: analysisResults.careerScore,
        resumeHash: analysisResults.resumeHash,
        companyReadiness: analysisResults.companyReadiness,
        companyRecommendations: analysisResults.companyRecommendations,
        recommendedRoles: analysisResults.recommendedRoles,
        roadmap: analysisResults.roadmap,
        resources: analysisResults.resources,
        projects: analysisResults.projects,
        certifications: analysisResults.certifications,
        salaryPrediction: analysisResults.salaryPrediction,
        timeline: analysisResults.timeline,
        motivationalSummary: analysisResults.motivationalSummary,
        skillGaps: analysisResults.skillGapReport ? [analysisResults.skillGapReport] : []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Career analysis completed successfully.',
      data: {
        career
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper to retrieve or initialize Career document
 */
const getOrInitializeCareer = async (user) => {
  let career = await Career.findOne({ user: user._id });
  if (!career) {
    const initial = await analyzeCareerProfile(user, null);
    career = await Career.create({
      user: user._id,
      careerScore: initial.careerScore,
      resumeHash: initial.resumeHash,
      companyReadiness: initial.companyReadiness,
      companyRecommendations: initial.companyRecommendations,
      recommendedRoles: initial.recommendedRoles,
      roadmap: initial.roadmap,
      resources: initial.resources,
      projects: initial.projects,
      certifications: initial.certifications,
      salaryPrediction: initial.salaryPrediction,
      timeline: initial.timeline,
      motivationalSummary: initial.motivationalSummary,
      skillGaps: []
    });
  }
  return career;
};

/**
 * Retrieve saved career intelligence details
 * GET /api/v1/career
 */
exports.getCareerData = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      message: 'Career details retrieved successfully.',
      data: {
        career
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get progress history snapshots comparison
 * GET /api/v1/career/history
 */
exports.getCareerHistory = async (req, res, next) => {
  try {
    const progress = await getProgressComparison(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Career progress comparison retrieved successfully.',
      data: progress
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get learning roadmap
 * GET /api/v1/career/roadmap
 */
exports.getRoadmap = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      data: {
        roadmap: career.roadmap
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get recommended learning resources
 * GET /api/v1/career/resources
 */
exports.getResources = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      data: {
        resources: career.resources
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get project recommendations
 * GET /api/v1/career/projects
 */
exports.getProjects = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      data: {
        projects: career.projects,
        certifications: career.certifications
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get salary predictions
 * GET /api/v1/career/salary
 */
exports.getSalary = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      data: {
        salaryPrediction: career.salaryPrediction
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get study timeline estimations
 * GET /api/v1/career/timeline
 */
exports.getTimeline = async (req, res, next) => {
  try {
    const career = await getOrInitializeCareer(req.user);
    res.status(200).json({
      success: true,
      data: {
        timeline: career.timeline
      }
    });
  } catch (err) {
    next(err);
  }
};
