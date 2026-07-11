'use strict';

const WebsiteMetric = require('../models/WebsiteMetric');
const WebsiteConfig = require('../models/WebsiteConfig');
const Project = require('../models/Project');
const { checkWebsite } = require('../services/monitoringService');
const { ok, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// GET /api/projects/:projectId/website-metrics/summary
const getWebsiteSummary = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const config = await WebsiteConfig.findOne({ project: project._id });
  if (!config) return notFound(res, 'Website not configured.');

  const recent = await WebsiteMetric.find({ websiteConfig: config._id })
    .sort({ checkedAt: -1 })
    .limit(100)
    .lean();

  const totalChecks = recent.length;
  const upChecks = recent.filter((m) => m.isUp).length;
  const avgResponseTime = totalChecks
    ? parseFloat((recent.reduce((s, m) => s + m.responseTime, 0) / totalChecks).toFixed(2))
    : 0;
  const avgErrorRate = totalChecks
    ? parseFloat((recent.reduce((s, m) => s + m.errorRate, 0) / totalChecks).toFixed(2))
    : 0;
  const uptimePct = totalChecks ? parseFloat(((upChecks / totalChecks) * 100).toFixed(2)) : 100;
  const latest = recent[0] || null;

  return ok(res, 'Website summary fetched.', {
    websiteName: config.websiteName,
    websiteUrl: config.websiteUrl,
    isUp: latest?.isUp ?? true,
    avgResponseTime,
    uptimePercentage: uptimePct,
    avgErrorRate,
    totalChecks,
    lastChecked: latest?.checkedAt || null,
    lastStatusCode: latest?.statusCode || null,
  });
});

// GET /api/projects/:projectId/website-metrics/response-time-trend
const getResponseTimeTrend = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const hours = parseInt(req.query.hours, 10) || 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const data = await WebsiteMetric.aggregate([
    { $match: { project: project._id, checkedAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: '$checkedAt' } },
        avgResponseTime: { $avg: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        timestamp: '$_id',
        avg: { $round: ['$avgResponseTime', 0] },
        max: { $round: ['$maxResponseTime', 0] },
      },
    },
  ]);

  return ok(res, 'Response time trend fetched.', data);
});

// GET /api/projects/:projectId/website-metrics/uptime-trend
const getUptimeTrend = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const days = parseInt(req.query.days, 10) || 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const data = await WebsiteMetric.aggregate([
    { $match: { project: project._id, checkedAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkedAt' } },
        totalChecks: { $sum: 1 },
        upChecks: { $sum: { $cond: ['$isUp', 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: '$_id',
        uptime: {
          $round: [{ $multiply: [{ $divide: ['$upChecks', '$totalChecks'] }, 100] }, 2],
        },
        totalChecks: 1,
      },
    },
  ]);

  return ok(res, 'Uptime trend fetched.', data);
});

// POST /api/projects/:projectId/website-metrics/check
const manualHealthCheck = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const config = await WebsiteConfig.findOne({ project: project._id });
  if (!config) return notFound(res, 'Website not configured.');

  const metric = await checkWebsite(config);
  return ok(res, 'Health check completed.', metric);
});

module.exports = { getWebsiteSummary, getResponseTimeTrend, getUptimeTrend, manualHealthCheck };
