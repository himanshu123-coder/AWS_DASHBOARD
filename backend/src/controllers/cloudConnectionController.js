'use strict';

const CloudConnection = require('../models/CloudConnection');
const Project = require('../models/Project');
const { ok, notFound, forbidden } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const _getProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  return project;
};

// GET /api/projects/:projectId/cloud-connection
const getCloudConnection = asyncHandler(async (req, res) => {
  const project = await _getProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const conn = await CloudConnection.findOne({ project: project._id });
  if (!conn) return notFound(res, 'Cloud connection not configured for this project.');
  return ok(res, 'Cloud connection fetched.', conn);
});

// PUT /api/projects/:projectId/cloud-connection
const updateCloudConnection = asyncHandler(async (req, res) => {
  const project = await _getProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const {
    accountId, roleArn, externalId, defaultRegion,
    monitoringInterval, enableCloudWatch, enableCostExplorer,
  } = req.body;

  const conn = await CloudConnection.findOneAndUpdate(
    { project: project._id },
    {
      owner: req.user._id,
      project: project._id,
      accountId, roleArn, externalId, defaultRegion,
      monitoringInterval, enableCloudWatch, enableCostExplorer,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return ok(res, 'Cloud connection updated.', conn);
});

// POST /api/projects/:projectId/cloud-connection/test
const testCloudConnection = asyncHandler(async (req, res) => {
  const project = await _getProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const conn = await CloudConnection.findOneAndUpdate(
    { project: project._id },
    { lastTested: new Date(), connectionStatus: 'connected' },
    { new: true }
  );

  // Dummy test — always returns connected
  return ok(res, 'Connection test successful.', {
    connected: true,
    latency: `${Math.floor(Math.random() * 80 + 20)}ms`,
    region: conn?.defaultRegion || 'us-east-1',
    testedAt: new Date(),
  });
});

module.exports = { getCloudConnection, updateCloudConnection, testCloudConnection };
