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
  /*
    Frontend se project selector hata diya gaya hai.

    Isliye backend logged-in user ke liye ek default internal workspace/project
    use karega. Agar workspace nahi milega, to automatically create ho jayega.

    Later AWS integration ke time isi workspace me:
    - AWS Account ID
    - Role ARN
    - Region
    - External ID
    attach kiye ja sakte hain.
  */

  let activeWorkspace = await Project.findOne({
    owner: req.user._id,
    status: 'active',
  }).sort({ createdAt: -1 });

  if (!activeWorkspace) {
    activeWorkspace = await Project.create({
      name: 'Default AWS Workspace',
      description: 'Default cloud monitoring workspace',
      environment: 'production',
      cloudProvider: 'AWS',
      owner: req.user._id,
      defaultRegion: 'ap-south-1',
      status: 'active',
    });
  }

  const workspaceId = activeWorkspace._id;

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Independent queries parallel me run hongi
  const [
    instances,
    activeAlerts,
    pendingRecommendations,
    recentWebsiteMetrics,
    costAggregation,
    predictedMonthlySpend,
    cpuTrend,
    costTrend,
    uptimeTrend,
  ] = await Promise.all([
    CloudInstance.find({
      project: workspaceId,
    }).lean(),

    Alert.find({
      project: workspaceId,
      status: 'active',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    Recommendation.find({
      project: workspaceId,
      status: { $in: ['pending', 'new'] },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    WebsiteMetric.find({
      project: workspaceId,
    })
      .sort({ checkedAt: -1 })
      .limit(50)
      .lean(),

    CostRecord.aggregate([
      {
        $match: {
          project: workspaceId,
          usageDate: {
            $gte: currentMonthStart,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]),

    predictMonthlySpend(workspaceId),

    CloudMetric.aggregate([
      {
        $match: {
          project: workspaceId,
          metricType: 'cpu',
          timestamp: {
            $gte: last24Hours,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%dT%H:00:00.000Z',
              date: '$timestamp',
            },
          },
          averageValue: {
            $avg: '$value',
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
          time: '$_id',
          value: {
            $round: ['$averageValue', 1],
          },
        },
      },
    ]),

    CostRecord.aggregate([
      {
        $match: {
          project: workspaceId,
          usageDate: {
            $gte: sixMonthsAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$usageDate',
            },
          },
          total: {
            $sum: '$amount',
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
          month: '$_id',
          total: {
            $round: ['$total', 2],
          },
        },
      },
    ]),

    WebsiteMetric.aggregate([
      {
        $match: {
          project: workspaceId,
          checkedAt: {
            $gte: last7Days,
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
          upChecks: {
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
            $round: [
              {
                $multiply: [
                  {
                    $divide: ['$upChecks', '$totalChecks'],
                  },
                  100,
                ],
              },
              1,
            ],
          },
        },
      },
    ]),
  ]);

  // Instance statistics
  const totalInstances = instances.length;

  const runningInstances = instances.filter(
    (instance) => instance.state === 'running'
  ).length;

  const stoppedInstances = instances.filter(
    (instance) => instance.state === 'stopped'
  ).length;

  const idleInstances = instances.filter(
    (instance) => instance.state === 'idle'
  ).length;

  const warningInstances = instances.filter(
    (instance) => instance.state === 'warning'
  ).length;

  const averageCpuUsage =
    totalInstances > 0
      ? Number(
          (
            instances.reduce(
              (sum, instance) => sum + Number(instance.cpuUsage || 0),
              0
            ) / totalInstances
          ).toFixed(1)
        )
      : 0;

  const averageMemoryUsage =
    totalInstances > 0
      ? Number(
          (
            instances.reduce(
              (sum, instance) => sum + Number(instance.memoryUsage || 0),
              0
            ) / totalInstances
          ).toFixed(1)
        )
      : 0;

  // Cost statistics
  const currentMonthSpend = Number(
    Number(costAggregation[0]?.total || 0).toFixed(2)
  );

  const monthlyBudget = Number(
    process.env.DEFAULT_MONTHLY_BUDGET || 1000
  );

  const budgetUsedPercent =
    monthlyBudget > 0
      ? Number(
          ((currentMonthSpend / monthlyBudget) * 100).toFixed(1)
        )
      : 0;

  const normalizedPrediction =
    typeof predictedMonthlySpend === 'number'
      ? predictedMonthlySpend
      : Number(predictedMonthlySpend?.predicted || 0);

  // Website statistics
  const latestWebsiteMetric = recentWebsiteMetrics[0];

  const websiteUp = latestWebsiteMetric
    ? Boolean(latestWebsiteMetric.isUp)
    : true;

  const averageResponseTime =
    recentWebsiteMetrics.length > 0
      ? Number(
          (
            recentWebsiteMetrics.reduce(
              (sum, metric) =>
                sum + Number(metric.responseTime || 0),
              0
            ) / recentWebsiteMetrics.length
          ).toFixed(0)
        )
      : 0;

  const successfulChecks = recentWebsiteMetrics.filter(
    (metric) => metric.isUp
  ).length;

  const websiteUptime =
    recentWebsiteMetrics.length > 0
      ? Number(
          (
            (successfulChecks / recentWebsiteMetrics.length) *
            100
          ).toFixed(1)
        )
      : 100;

  const failedChecks =
    recentWebsiteMetrics.length - successfulChecks;

  const errorRate =
    recentWebsiteMetrics.length > 0
      ? Number(
          (
            (failedChecks / recentWebsiteMetrics.length) *
            100
          ).toFixed(2)
        )
      : 0;

  const estimatedMonthlySaving = pendingRecommendations.reduce(
    (sum, recommendation) =>
      sum +
      Number(
        recommendation.estimatedMonthlySaving ||
          recommendation.estimatedSaving ||
          0
      ),
    0
  );

  return ok(res, 'Dashboard overview fetched.', {
    workspace: {
      id: activeWorkspace._id,
      name: activeWorkspace.name,
      environment: activeWorkspace.environment,
      cloudProvider: activeWorkspace.cloudProvider,
      defaultRegion: activeWorkspace.defaultRegion,
      status: activeWorkspace.status,
    },

    stats: {
      totalCloudCost: currentMonthSpend,
      currentMonthSpend,
      predictedMonthlySpend: Number(
        Number(normalizedPrediction || 0).toFixed(2)
      ),
      monthlyBudget,
      budgetUsedPercent,

      totalInstances,
      runningInstances,
      stoppedInstances,
      idleInstances,
      warningInstances,
      averageCpuUsage,
      avgCpuUsage: averageCpuUsage,
      averageMemoryUsage,
      avgMemoryUsage: averageMemoryUsage,

      websiteUp,
      websiteUptime,
      averageResponseTime,
      avgResponseTime: averageResponseTime,
      errorRate,

      activeAlertCount: activeAlerts.length,
      pendingRecommendationCount:
        pendingRecommendations.length,

      estimatedMonthlySaving: Number(
        estimatedMonthlySaving.toFixed(2)
      ),
    },

    charts: {
      cpuTrend,
      costTrend,
      uptimeTrend,
    },

    recentAlerts: activeAlerts,
    recommendations: pendingRecommendations,

    lastUpdated: new Date(),
  });
});

module.exports = {
  getOverview,
};