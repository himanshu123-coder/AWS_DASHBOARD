'use strict';

const CloudMetric = require('../models/CloudMetric');
const CloudInstance = require('../models/CloudInstance');
const Project = require('../models/Project');
const { ok, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// GET /api/projects/:projectId/metrics/cpu-trend
const getCpuTrend = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const hours = parseInt(req.query.hours, 10) || 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const metrics = await CloudMetric.aggregate([
    {
      $match: {
        project: project._id,
        metricType: 'cpu',
        timestamp: { $gte: since },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: '$timestamp' },
        },
        avgValue: { $avg: '$value' },
        maxValue: { $max: '$value' },
        minValue: { $min: '$value' },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        timestamp: '$_id',
        avg: { $round: ['$avgValue', 2] },
        max: { $round: ['$maxValue', 2] },
        min: { $round: ['$minValue', 2] },
      },
    },
  ]);

  return ok(res, 'CPU trend fetched.', metrics);
});

// GET /api/projects/:projectId/metrics/network-trend
const getNetworkTrend = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const hours = parseInt(req.query.hours, 10) || 24;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [networkIn, networkOut] = await Promise.all([
    CloudMetric.aggregate([
      { $match: { project: project._id, metricType: 'network', timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: '$timestamp' } },
          avgValue: { $avg: '$value' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, timestamp: '$_id', value: { $round: ['$avgValue', 2] } } },
    ]),
    CloudMetric.aggregate([
      { $match: { project: project._id, metricType: 'storage', timestamp: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: '$timestamp' } },
          avgValue: { $avg: '$value' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, timestamp: '$_id', value: { $round: ['$avgValue', 2] } } },
    ]),
  ]);

  return ok(res, 'Network trend fetched.', { networkIn, networkOut });
});

// GET /api/projects/:projectId/metrics/summary
const getMetricsSummary = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const instances = await CloudInstance.find({ project: project._id });
  const total = instances.length;
  const running = instances.filter((i) => i.state === 'running').length;

  const avgCpu = total
    ? parseFloat((instances.reduce((s, i) => s + i.cpuUsage, 0) / total).toFixed(2))
    : 0;
  const avgMemory = total
    ? parseFloat((instances.reduce((s, i) => s + i.memoryUsage, 0) / total).toFixed(2))
    : 0;
  const totalStorage = instances.reduce((s, i) => s + i.storageUsed, 0);
  const totalMonthlyCost = instances.reduce((s, i) => s + i.monthlyCost, 0);

  return ok(res, 'Metrics summary fetched.', {
    totalInstances: total,
    runningInstances: running,
    avgCpuUsage: avgCpu,
    avgMemoryUsage: avgMemory,
    totalStorageUsed: totalStorage,
    totalMonthlyCost: parseFloat(totalMonthlyCost.toFixed(2)),
  });
});

module.exports = { getCpuTrend, getNetworkTrend, getMetricsSummary };
