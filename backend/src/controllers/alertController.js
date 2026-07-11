'use strict';

const Alert = require('../models/Alert');
const Project = require('../models/Project');
const { ok, notFound } = require('../utils/response');
const { paginationMeta } = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// GET /api/projects/:projectId/alerts
const getAlerts = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { project: project._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.severity) filter.severity = req.query.severity;

  const [alerts, total] = await Promise.all([
    Alert.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Alert.countDocuments(filter),
  ]);

  return ok(res, 'Alerts fetched.', alerts, paginationMeta(total, page, limit));
});

// GET /api/projects/:projectId/alerts/active
const getActiveAlerts = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const alerts = await Alert.find({ project: project._id, status: 'active' })
    .sort({ createdAt: -1 });

  return ok(res, 'Active alerts fetched.', alerts);
});

// GET /api/projects/:projectId/alerts/resolved
const getResolvedAlerts = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [alerts, total] = await Promise.all([
    Alert.find({ project: project._id, status: 'resolved' })
      .sort({ resolvedAt: -1 })
      .skip(skip)
      .limit(limit),
    Alert.countDocuments({ project: project._id, status: 'resolved' }),
  ]);

  return ok(res, 'Resolved alerts fetched.', alerts, paginationMeta(total, page, limit));
});

// PUT /api/projects/:projectId/alerts/:id/acknowledge
const acknowledgeAlert = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, project: project._id, status: 'active' },
    { status: 'acknowledged', acknowledgedAt: new Date() },
    { new: true }
  );
  if (!alert) return notFound(res, 'Alert not found or already actioned.');
  return ok(res, 'Alert acknowledged.', alert);
});

// PUT /api/projects/:projectId/alerts/:id/resolve
const resolveAlert = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, project: project._id, status: { $in: ['active', 'acknowledged'] } },
    { status: 'resolved', resolvedAt: new Date(), resolvedBy: req.user._id },
    { new: true }
  );
  if (!alert) return notFound(res, 'Alert not found or already resolved.');
  return ok(res, 'Alert resolved.', alert);
});

module.exports = { getAlerts, getActiveAlerts, getResolvedAlerts, acknowledgeAlert, resolveAlert };
