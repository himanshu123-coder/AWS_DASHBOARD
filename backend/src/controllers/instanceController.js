'use strict';

const CloudInstance = require('../models/CloudInstance');
const Project = require('../models/Project');
const Alert = require('../models/Alert');
const { ok, created, notFound } = require('../utils/response');
const { paginationMeta } = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// POST /api/projects/:projectId/instances
const createInstance = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const instance = await CloudInstance.create({
    ...req.body,
    project: project._id,
    owner: req.user._id,
  });
  return created(res, 'Instance created.', instance);
});

// GET /api/projects/:projectId/instances
const getInstances = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortBy || 'createdAt';
  const sortDir = req.query.sortDir === 'asc' ? 1 : -1;

  const filter = { project: project._id };
  if (req.query.state) filter.state = req.query.state;
  if (req.query.region) filter.region = req.query.region;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { instanceId: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [instances, total] = await Promise.all([
    CloudInstance.find(filter)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit),
    CloudInstance.countDocuments(filter),
  ]);

  return ok(res, 'Instances fetched.', instances, paginationMeta(total, page, limit));
});

// GET /api/projects/:projectId/instances/:id
const getInstance = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const instance = await CloudInstance.findOne({ _id: req.params.id, project: project._id });
  if (!instance) return notFound(res, 'Instance not found.');
  return ok(res, 'Instance fetched.', instance);
});

// PUT /api/projects/:projectId/instances/:id
const updateInstance = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const instance = await CloudInstance.findOneAndUpdate(
    { _id: req.params.id, project: project._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!instance) return notFound(res, 'Instance not found.');

  // Auto-alert: High CPU
  if (instance.cpuUsage > 80) {
    const existingAlert = await Alert.findOne({
      project: project._id,
      type: 'high_cpu',
      resourceId: instance.instanceId,
      status: 'active',
    });
    if (!existingAlert) {
      await Alert.create({
        project: project._id,
        owner: req.user._id,
        type: 'high_cpu',
        severity: 'high',
        title: `High CPU: ${instance.name}`,
        message: `CPU usage is at ${instance.cpuUsage.toFixed(1)}% on ${instance.name}.`,
        resourceId: instance.instanceId,
        resourceName: instance.name,
        metricValue: instance.cpuUsage,
        threshold: 80,
      });
    }
  }

  return ok(res, 'Instance updated.', instance);
});

// DELETE /api/projects/:projectId/instances/:id
const deleteInstance = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const instance = await CloudInstance.findOneAndDelete({ _id: req.params.id, project: project._id });
  if (!instance) return notFound(res, 'Instance not found.');
  return ok(res, 'Instance deleted.');
});

module.exports = { createInstance, getInstances, getInstance, updateInstance, deleteInstance };
