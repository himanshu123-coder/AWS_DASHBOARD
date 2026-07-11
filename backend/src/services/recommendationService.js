'use strict';

const Recommendation = require('../models/Recommendation');
const CloudInstance = require('../models/CloudInstance');
const CostRecord = require('../models/CostRecord');
const WebsiteMetric = require('../models/WebsiteMetric');
const Alert = require('../models/Alert');
const logger = require('../utils/logger');

/**
 * Rule-based AI recommendation engine.
 * Analyses project data and upserts recommendations.
 */
const generateRecommendations = async (projectId, ownerId) => {
  const recommendations = [];

  // ── Load current data ──────────────────────────────────────────────
  const instances = await CloudInstance.find({ project: projectId });

  for (const inst of instances) {
    // Rule: CPU below 10% → underutilised
    if (inst.cpuUsage < 10 && inst.state === 'running') {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'underutilized_instance',
        title: `Underutilized Instance: ${inst.name}`,
        description: `Instance ${inst.name} (${inst.instanceId}) has CPU usage of only ${inst.cpuUsage.toFixed(1)}%. Consider downsizing or stopping it.`,
        severity: 'medium',
        savingEstimate: parseFloat((inst.monthlyCost * 0.4).toFixed(2)),
        confidenceScore: 0.87,
        reason: `CPU utilization has been below 10% (current: ${inst.cpuUsage.toFixed(1)}%) indicating this instance is overprovisioned.`,
        resourceId: inst.instanceId,
        resourceName: inst.name,
        status: 'pending',
      });
    }

    // Rule: CPU above 80% → overloaded
    if (inst.cpuUsage > 80 && inst.state === 'running') {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'overloaded_instance',
        title: `Overloaded Instance: ${inst.name}`,
        description: `Instance ${inst.name} has CPU usage of ${inst.cpuUsage.toFixed(1)}%. Consider upgrading or load-balancing.`,
        severity: 'high',
        savingEstimate: 0,
        confidenceScore: 0.92,
        reason: `Sustained CPU above 80% degrades application performance and may cause instability.`,
        resourceId: inst.instanceId,
        resourceName: inst.name,
        status: 'pending',
      });
    }

    // Rule: Idle instance (stopped but still incurring storage cost)
    if (inst.state === 'stopped' || inst.state === 'idle') {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'idle_instance',
        title: `Idle Instance Detected: ${inst.name}`,
        description: `Instance ${inst.name} is ${inst.state}. Terminating or snapshotting it could reduce costs.`,
        severity: 'low',
        savingEstimate: parseFloat((inst.monthlyCost * 0.8).toFixed(2)),
        confidenceScore: 0.95,
        reason: `Instance has been in ${inst.state} state. Storage costs continue to accrue.`,
        resourceId: inst.instanceId,
        resourceName: inst.name,
        status: 'pending',
      });
    }

    // Rule: Right-sizing (memory > 90%)
    if (inst.memoryUsage > 90) {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'rightsizing',
        title: `High Memory Usage: ${inst.name}`,
        description: `Memory usage is ${inst.memoryUsage.toFixed(1)}% on ${inst.name}. Upgrade to a memory-optimised instance type.`,
        severity: 'high',
        savingEstimate: 0,
        confidenceScore: 0.88,
        reason: `Memory pressure above 90% leads to swapping and performance degradation.`,
        resourceId: inst.instanceId,
        resourceName: inst.name,
        status: 'pending',
      });
    }
  }

  // ── Budget Rule ────────────────────────────────────────────────────
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const costAgg = await CostRecord.aggregate([
    { $match: { project: projectId, usageDate: { $gte: thirtyDaysAgo } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalCost = costAgg[0]?.total || 0;
  const budget = parseFloat(process.env.DEFAULT_MONTHLY_BUDGET || '1000');

  if (totalCost > budget) {
    recommendations.push({
      project: projectId,
      owner: ownerId,
      type: 'budget_exceeded',
      title: 'Monthly Budget Exceeded',
      description: `Current spend ($${totalCost.toFixed(2)}) has exceeded the budget ($${budget.toFixed(2)}). Review resource allocation.`,
      severity: 'critical',
      savingEstimate: parseFloat((totalCost - budget).toFixed(2)),
      confidenceScore: 1.0,
      reason: `Actual monthly cost exceeds configured budget by $${(totalCost - budget).toFixed(2)}.`,
      resourceId: '',
      resourceName: 'Budget',
      status: 'pending',
    });
  }

  // ── Website Rules ──────────────────────────────────────────────────
  const recentMetrics = await WebsiteMetric.find({ project: projectId })
    .sort({ checkedAt: -1 })
    .limit(20);

  if (recentMetrics.length > 0) {
    const avgResponseTime =
      recentMetrics.reduce((s, m) => s + m.responseTime, 0) / recentMetrics.length;
    const avgErrorRate =
      recentMetrics.reduce((s, m) => s + m.errorRate, 0) / recentMetrics.length;

    if (avgResponseTime > 3000) {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'slow_website',
        title: 'Slow Website Response Detected',
        description: `Average response time is ${avgResponseTime.toFixed(0)}ms. Target is <1000ms. Consider CDN, caching, or server optimisation.`,
        severity: 'high',
        savingEstimate: 0,
        confidenceScore: 0.85,
        reason: `Response time above 3 seconds negatively impacts user experience and SEO rankings.`,
        resourceId: '',
        resourceName: 'Website',
        status: 'pending',
      });
    }

    if (avgErrorRate > 5) {
      recommendations.push({
        project: projectId,
        owner: ownerId,
        type: 'high_error_rate',
        title: 'High Website Error Rate',
        description: `Error rate is ${avgErrorRate.toFixed(1)}%. Investigate 4xx/5xx responses.`,
        severity: 'critical',
        savingEstimate: 0,
        confidenceScore: 0.9,
        reason: `Error rate above 5% indicates application instability or misconfiguration.`,
        resourceId: '',
        resourceName: 'Website',
        status: 'pending',
      });
    }
  }

  // ── Persist (insert only new, skip duplicates by title+project) ──────
  let saved = 0;
  for (const rec of recommendations) {
    const exists = await Recommendation.findOne({
      project: rec.project,
      title: rec.title,
      status: 'pending',
    });
    if (!exists) {
      await Recommendation.create(rec);
      saved++;
    }
  }

  logger.info(`[RecommendationEngine] Generated ${saved} new recommendations for project ${projectId}`);
  return saved;
};

module.exports = { generateRecommendations };
