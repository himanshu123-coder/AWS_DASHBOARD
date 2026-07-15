'use strict';

const WebsiteMetric = require('../models/WebsiteMetric');
const WebsiteConfig = require('../models/WebsiteConfig');
const Project = require('../models/Project');

const { checkWebsite } = require('../services/monitoringService');
const { ok, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

async function getOrCreateWorkspace(userId) {
  let workspace = await Project.findOne({
    owner: userId,
    status: 'active',
  }).sort({ createdAt: -1 });

  if (!workspace) {
    workspace = await Project.create({
      name: 'Default AWS Workspace',
      description: 'Default cloud monitoring workspace',
      environment: 'production',
      cloudProvider: 'AWS',
      owner: userId,
      defaultRegion: 'ap-south-1',
      status: 'active',
    });
  }

  return workspace;
}

// GET /api/website-metrics/summary
const getWebsiteSummary = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const config = await WebsiteConfig.findOne({
    project: workspace._id,
  }).lean();

  if (!config) {
    return notFound(res, 'Website not configured.');
  }

  const recentMetrics = await WebsiteMetric.find({
    project: workspace._id,
    websiteConfig: config._id,
  })
    .sort({ checkedAt: -1 })
    .limit(100)
    .lean();

  const totalChecks = recentMetrics.length;

  const successfulChecks = recentMetrics.filter(
    (metric) => metric.isUp
  ).length;

  const failedChecks = totalChecks - successfulChecks;

  const averageResponseTime =
    totalChecks > 0
      ? Number(
          (
            recentMetrics.reduce(
              (sum, metric) =>
                sum + Number(metric.responseTime || 0),
              0
            ) / totalChecks
          ).toFixed(2)
        )
      : 0;

  const averageErrorRate =
    totalChecks > 0
      ? Number(
          (
            recentMetrics.reduce(
              (sum, metric) =>
                sum + Number(metric.errorRate || 0),
              0
            ) / totalChecks
          ).toFixed(2)
        )
      : 0;

  const uptimePercentage =
    totalChecks > 0
      ? Number(
          ((successfulChecks / totalChecks) * 100).toFixed(2)
        )
      : 100;

  const latestMetric = recentMetrics[0] || null;

  return ok(res, 'Website summary fetched.', {
    websiteName: config.websiteName,
    websiteUrl: config.websiteUrl,

    isUp: latestMetric?.isUp ?? true,

    uptimePercentage,
    averageResponseTime,
    avgResponseTime: averageResponseTime,

    averageErrorRate,
    avgErrorRate: averageErrorRate,

    totalChecks,
    successfulChecks,
    failedChecks,

    lastChecked: latestMetric?.checkedAt || null,
    lastStatusCode: latestMetric?.statusCode || null,
  });
});

// GET /api/website-metrics/response-time-trend
const getResponseTimeTrend = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const rawHours = Number.parseInt(req.query.hours, 10);
  const hours =
    Number.isFinite(rawHours) && rawHours > 0
      ? Math.min(rawHours, 720)
      : 24;

  const since = new Date(
    Date.now() - hours * 60 * 60 * 1000
  );

  const data = await WebsiteMetric.aggregate([
    {
      $match: {
        project: workspace._id,
        checkedAt: {
          $gte: since,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%dT%H:00:00.000Z',
            date: '$checkedAt',
          },
        },
        averageResponseTime: {
          $avg: '$responseTime',
        },
        maximumResponseTime: {
          $max: '$responseTime',
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        timestamp: '$_id',
        average: {
          $round: ['$averageResponseTime', 0],
        },
        avg: {
          $round: ['$averageResponseTime', 0],
        },
        maximum: {
          $round: ['$maximumResponseTime', 0],
        },
        max: {
          $round: ['$maximumResponseTime', 0],
        },
      },
    },
  ]);

  return ok(res, 'Response time trend fetched.', data);
});

// GET /api/website-metrics/uptime-trend
const getUptimeTrend = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const rawDays = Number.parseInt(req.query.days, 10);
  const days =
    Number.isFinite(rawDays) && rawDays > 0
      ? Math.min(rawDays, 365)
      : 7;

  const since = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  );

  const data = await WebsiteMetric.aggregate([
    {
      $match: {
        project: workspace._id,
        checkedAt: {
          $gte: since,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$checkedAt',
          },
        },
        totalChecks: {
          $sum: 1,
        },
        successfulChecks: {
          $sum: {
            $cond: ['$isUp', 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        uptime: {
          $cond: [
            {
              $gt: ['$totalChecks', 0],
            },
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$successfulChecks',
                        '$totalChecks',
                      ],
                    },
                    100,
                  ],
                },
                2,
              ],
            },
            100,
          ],
        },
        totalChecks: 1,
        successfulChecks: 1,
      },
    },
  ]);

  return ok(res, 'Uptime trend fetched.', data);
});

// POST /api/website-metrics/check
const manualHealthCheck = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const config = await WebsiteConfig.findOne({
    project: workspace._id,
  });

  if (!config) {
    return notFound(res, 'Website not configured.');
  }

  const metric = await checkWebsite(config);

  return ok(res, 'Health check completed.', metric);
});

module.exports = {
  getWebsiteSummary,
  getResponseTimeTrend,
  getUptimeTrend,
  manualHealthCheck,
};