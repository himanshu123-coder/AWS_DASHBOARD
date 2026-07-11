'use strict';

const Recommendation = require('../models/Recommendation');
const Project = require('../models/Project');
const { generateRecommendations } = require('../services/recommendationService');
const { ok, notFound } = require('../utils/response');
const { paginationMeta } = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// POST /api/projects/:projectId/recommendations/generate
const generate = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const count = await generateRecommendations(project._id, req.user._id);
  return ok(res, `Generated ${count} new recommendation(s).`, { generated: count });
});

// GET /api/projects/:projectId/recommendations
const getRecommendations = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { project: project._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.severity) filter.severity = req.query.severity;

  const [recs, total] = await Promise.all([
    Recommendation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Recommendation.countDocuments(filter),
  ]);

  return ok(res, 'Recommendations fetched.', recs, paginationMeta(total, page, limit));
});

// PUT /api/projects/:projectId/recommendations/:id/ignore
const ignoreRecommendation = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const rec = await Recommendation.findOneAndUpdate(
    { _id: req.params.id, project: project._id },
    { status: 'ignored', ignoredAt: new Date() },
    { new: true }
  );
  if (!rec) return notFound(res, 'Recommendation not found.');
  return ok(res, 'Recommendation ignored.', rec);
});

// PUT /api/projects/:projectId/recommendations/:id/apply-later
const applyLater = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const rec = await Recommendation.findOneAndUpdate(
    { _id: req.params.id, project: project._id },
    { status: 'apply_later' },
    { new: true }
  );
  if (!rec) return notFound(res, 'Recommendation not found.');
  return ok(res, 'Marked as apply later.', rec);
});

// PUT /api/projects/:projectId/recommendations/:id/mark-applied
const markApplied = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const rec = await Recommendation.findOneAndUpdate(
    { _id: req.params.id, project: project._id },
    { status: 'applied', appliedAt: new Date() },
    { new: true }
  );
  if (!rec) return notFound(res, 'Recommendation not found.');
  return ok(res, 'Recommendation marked as applied.', rec);
});

module.exports = { generate, getRecommendations, ignoreRecommendation, applyLater, markApplied };
