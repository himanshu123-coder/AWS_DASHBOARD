'use strict';

const CostRecord = require('../models/CostRecord');

/**
 * Compute current-month spend for a project.
 */
const getCurrentMonthSpend = async (projectId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const agg = await CostRecord.aggregate([
    { $match: { project: projectId, usageDate: { $gte: startOfMonth } } },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        byService: {
          $push: { service: '$service', amount: '$amount' },
        },
      },
    },
  ]);

  return {
    total: agg[0]?.total || 0,
    startOfMonth,
  };
};

/**
 * Predict end-of-month spend using linear projection.
 */
const predictMonthlySpend = async (projectId) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();

  const { total } = await getCurrentMonthSpend(projectId);

  if (daysPassed === 0) return 0;

  const dailyRate = total / daysPassed;
  const predicted = dailyRate * daysInMonth;
  return parseFloat(predicted.toFixed(2));
};

module.exports = { getCurrentMonthSpend, predictMonthlySpend };
