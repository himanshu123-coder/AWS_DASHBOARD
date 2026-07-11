'use strict';

const Project = require('../models/Project');
const CloudInstance = require('../models/CloudInstance');
const CloudMetric = require('../models/CloudMetric');
const WebsiteMetric = require('../models/WebsiteMetric');
const Alert = require('../models/Alert');
const Recommendation = require('../models/Recommendation');
const CostRecord = require('../models/CostRecord');
const { predictMonthlySpend } = require('../services/costService');
const { ok } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/dashboard/overview
const getOverview = asyncHandler(async (req, res) => {
  // Use the first active project for this user (or accept ?projectId param)
  const projectId = req.query.projectId;
  const projectFilter = { owner: req.user._id };
  if (projectId) projectFilter._id = projectId;

  const projects = await Project.find(projectFilter).sort({ createdAt: -1 }).limit(10);
  const activeProject = projects[0];

  if (!activeProject) {
    return ok(res, 'Dashboard overview fetched (no projects yet).', {
      stats: {},
      charts: {},
      recentAlerts: [],
      recommendations: [],
      lastUpdated: new Date(),
    });
  }

  const pid = activeProject._id;

  // ── Run all queries in parallel ───────────────────────────────────
  const [
    instances,
    activeAlerts,
    pendingRecs,
    recentWebMetrics,
    costAgg,
    predicted,
    cpuTrend,
    costTrend,
    uptimeTrend,
  ] = await Promise.all([
    CloudInstance.find({ project: pid }),
    Alert.find({ project: pid, status: 'active' }).sort({ createdAt: -1 }).limit(10),
    Recommendation.find({ project: pid, status: 'pending' }).sort({ createdAt: -1 }).limit(5),

    WebsiteMetric.find({ project: pid }).sort({ checkedAt: -1 }).limit(50).lean(),

    CostRecord.aggregate([
      {
        $match: {
          project: pid,
          usageDate: { $gte: new Date(new Date().setDate(1)) },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),

    predictMonthlySpend(pid),

    CloudMetric.aggregate([
      {
        $match: {
          project: pid,
          metricType: 'cpu',
          timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%dT%H:00:00.000Z', date: '$timestamp' } },
          avg: { $avg: '$value' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, time: '$_id', value: { $round: ['$avg', 1] } } },
    ]),

    CostRecord.aggregate([
      {
        $match: {
          project: pid,
          usageDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$usageDate' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', total: { $round: ['$total', 2] } } },
    ]),

    WebsiteMetric.aggregate([
      {
        $match: {
          project: pid,
          checkedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
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
          uptime: { $round: [{ $multiply: [{ $divide: ['$upChecks', '$totalChecks'] }, 100] }, 1] },
        },
      },
    ]),
  ]);

  const totalInstances = instances.length;
  const runningInstances = instances.filter((i) => i.state === 'running').length;
  const avgCpu = totalInstances
    ? parseFloat((instances.reduce((s, i) => s + i.cpuUsage, 0) / totalInstances).toFixed(1))
    : 0;
  const avgMemory = totalInstances
    ? parseFloat((instances.reduce((s, i) => s + i.memoryUsage, 0) / totalInstances).toFixed(1))
    : 0;

  const currentSpend = costAgg[0]?.total || 0;
  const budget = parseFloat(process.env.DEFAULT_MONTHLY_BUDGET || '1000');

  const websiteUp = recentWebMetrics.length > 0 ? recentWebMetrics[0].isUp : true;
  const avgResponseTime = recentWebMetrics.length
    ? parseFloat(
        (recentWebMetrics.reduce((s, m) => s + m.responseTime, 0) / recentWebMetrics.length).toFixed(0)
      )
    : 0;
  const upChecks = recentWebMetrics.filter((m) => m.isUp).length;
  const websiteUptime = recentWebMetrics.length
    ? parseFloat(((upChecks / recentWebMetrics.length) * 100).toFixed(1))
    : 100;

  return ok(res, 'Dashboard overview fetched.', {
    project: activeProject,
    projects,
    stats: {
      totalInstances,
      runningInstances,
      stoppedInstances: totalInstances - runningInstances,
      avgCpuUsage: avgCpu,
      avgMemoryUsage: avgMemory,
      currentMonthSpend: parseFloat(currentSpend.toFixed(2)),
      predictedMonthlySpend: predicted,
      budget,
      budgetUsedPercent: parseFloat(((currentSpend / budget) * 100).toFixed(1)),
      activeAlertCount: activeAlerts.length,
      pendingRecommendationCount: pendingRecs.length,
      websiteUp,
      avgResponseTime,
      websiteUptime,
    },
    charts: {
      cpuTrend,
      costTrend,
      uptimeTrend,
    },
    recentAlerts: activeAlerts,
    recommendations: pendingRecs,
    lastUpdated: new Date(),
  });
});

module.exports = { getOverview };
