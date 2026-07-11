'use strict';

const CostRecord = require('../models/CostRecord');
const Project = require('../models/Project');
const { predictMonthlySpend } = require('../services/costService');
const { ok, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const _ownedProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// GET /api/projects/:projectId/costs/trend
const getCostTrend = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const months = parseInt(req.query.months, 10) || 6;
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const data = await CostRecord.aggregate([
    { $match: { project: project._id, usageDate: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$usageDate' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, month: '$_id', total: { $round: ['$total', 2] } } },
  ]);

  return ok(res, 'Cost trend fetched.', data);
});

// GET /api/projects/:projectId/costs/by-service
const getCostByService = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const since = new Date();
  since.setDate(1); // start of current month

  const data = await CostRecord.aggregate([
    { $match: { project: project._id, usageDate: { $gte: since } } },
    { $group: { _id: '$service', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, service: '$_id', total: { $round: ['$total', 2] } } },
  ]);

  return ok(res, 'Cost by service fetched.', data);
});

// GET /api/projects/:projectId/costs/by-region
const getCostByRegion = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const since = new Date();
  since.setDate(1);

  const data = await CostRecord.aggregate([
    { $match: { project: project._id, usageDate: { $gte: since } } },
    { $group: { _id: '$region', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, region: '$_id', total: { $round: ['$total', 2] } } },
  ]);

  return ok(res, 'Cost by region fetched.', data);
});

// GET /api/projects/:projectId/costs/prediction
const getCostPrediction = asyncHandler(async (req, res) => {
  const project = await _ownedProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const predicted = await predictMonthlySpend(project._id);
  const budget = parseFloat(process.env.DEFAULT_MONTHLY_BUDGET || '1000');

  const since = new Date();
  since.setDate(1);
  const costAgg = await CostRecord.aggregate([
    { $match: { project: project._id, usageDate: { $gte: since } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const currentSpend = costAgg[0]?.total || 0;

  return ok(res, 'Cost prediction fetched.', {
    currentSpend: parseFloat(currentSpend.toFixed(2)),
    predictedMonthlySpend: predicted,
    budget,
    budgetUsedPercent: parseFloat(((currentSpend / budget) * 100).toFixed(2)),
    isOverBudget: currentSpend > budget,
    projectedOverrun: predicted > budget ? parseFloat((predicted - budget).toFixed(2)) : 0,
  });
});

module.exports = { getCostTrend, getCostByService, getCostByRegion, getCostPrediction };
