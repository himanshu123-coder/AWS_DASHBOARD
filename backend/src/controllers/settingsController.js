'use strict';

const Settings = require('../models/Settings');
const Project = require('../models/Project');

const { ok, created, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// Check whether project belongs to logged-in user
const _ownedProject = async (projectId, userId) =>
  Project.findOne({
    _id: projectId,
    owner: userId,
  });

// GET /api/projects/:projectId/settings
const getSettings = asyncHandler(async (req, res) => {
  const project = await _ownedProject(
    req.params.projectId,
    req.user._id
  );

  if (!project) {
    return notFound(res, 'Project not found.');
  }

  let settings = await Settings.findOne({
    project: project._id,
  });

  // Create default settings if they don't exist
  if (!settings) {
    settings = await Settings.create({
      project: project._id,
      defaultRegion: project.defaultRegion || 'ap-south-1',
    });
  }

  return ok(res, 'Settings fetched.', settings);
});

// PUT /api/projects/:projectId/settings
const updateSettings = asyncHandler(async (req, res) => {
  const project = await _ownedProject(
    req.params.projectId,
    req.user._id
  );

  if (!project) {
    return notFound(res, 'Project not found.');
  }

  const {
    awsAccountId,
    iamRoleArn,
    defaultRegion,
    externalId,
    monitoringInterval,
    enableCostExplorer,
    enableCloudWatch,
    websiteName,
    websiteUrl,
    trackingInterval,
    enableErrorTracking,
    enableUptimeMonitoring,
  } = req.body;

  const settings = await Settings.findOneAndUpdate(
    {
      project: project._id,
    },
    {
      awsAccountId,
      iamRoleArn,
      defaultRegion,
      externalId,
      monitoringInterval,
      enableCostExplorer,
      enableCloudWatch,
      websiteName,
      websiteUrl,
      trackingInterval,
      enableErrorTracking,
      enableUptimeMonitoring,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return ok(res, 'Settings updated.', settings);
});

module.exports = {
  getSettings,
  updateSettings,
};