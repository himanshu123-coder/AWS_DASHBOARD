'use strict';

const CostRecord = require('../models/CostRecord');
const Project = require('../models/Project');

const { predictMonthlySpend } = require('../services/costService');
const { ok, created } = require('../utils/response');
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
const createCostRecord = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const costRecord = await CostRecord.create({
    project: workspace._id,
    owner: req.user._id,
    service: req.body.service,
    amount: Number(req.body.amount),
    currency: req.body.currency || 'INR',
    region: req.body.region || workspace.defaultRegion,
    usageDate: req.body.usageDate
      ? new Date(req.body.usageDate)
      : new Date(),
    source: req.body.source || 'manual',
  });

  return created(res, 'Cost record created.', costRecord);
});



// GET /api/costs/trend
const getCostTrend = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const rawMonths = Number.parseInt(req.query.months, 10);
  const months =
    Number.isFinite(rawMonths) && rawMonths > 0
      ? Math.min(rawMonths, 24)
      : 6;

  const since = new Date();
  since.setMonth(since.getMonth() - months);
  since.setHours(0, 0, 0, 0);

  const data = await CostRecord.aggregate([
    {
      $match: {
        project: workspace._id,
        usageDate: {
          $gte: since,
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
  ]);

  return ok(res, 'Cost trend fetched.', data);
});

// GET /api/costs/by-service
const getCostByService = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const data = await CostRecord.aggregate([
    {
      $match: {
        project: workspace._id,
        usageDate: {
          $gte: currentMonthStart,
        },
      },
    },
    {
      $group: {
        _id: '$service',
        total: {
          $sum: '$amount',
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $project: {
        _id: 0,
        service: '$_id',
        total: {
          $round: ['$total', 2],
        },
      },
    },
  ]);

  return ok(res, 'Cost by service fetched.', data);
});

// GET /api/costs/by-region
const getCostByRegion = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const data = await CostRecord.aggregate([
    {
      $match: {
        project: workspace._id,
        usageDate: {
          $gte: currentMonthStart,
        },
      },
    },
    {
      $group: {
        _id: '$region',
        total: {
          $sum: '$amount',
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $project: {
        _id: 0,
        region: '$_id',
        total: {
          $round: ['$total', 2],
        },
      },
    },
  ]);

  return ok(res, 'Cost by region fetched.', data);
});

// GET /api/costs/prediction
const getCostPrediction = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const predictedResult = await predictMonthlySpend(workspace._id);

  const predictedMonthlySpend =
    typeof predictedResult === 'number'
      ? predictedResult
      : Number(predictedResult?.predicted || 0);

  const budget = Number(
    process.env.DEFAULT_MONTHLY_BUDGET || 1000
  );

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const costAggregation = await CostRecord.aggregate([
    {
      $match: {
        project: workspace._id,
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
  ]);

  const currentSpend = Number(
    Number(costAggregation[0]?.total || 0).toFixed(2)
  );

  const budgetUsedPercent =
    budget > 0
      ? Number(((currentSpend / budget) * 100).toFixed(2))
      : 0;

  const projectedOverrun =
    predictedMonthlySpend > budget
      ? Number((predictedMonthlySpend - budget).toFixed(2))
      : 0;

  return ok(res, 'Cost prediction fetched.', {
    currentSpend,
    predictedMonthlySpend: Number(
      Number(predictedMonthlySpend || 0).toFixed(2)
    ),
    budget,
    budgetUsedPercent,
    isOverBudget: currentSpend > budget,
    projectedOverrun,
  });
});

module.exports = {
  getCostTrend,
  getCostByService,
  getCostByRegion,
  getCostPrediction,
  createCostRecord,
};