'use strict';

const cron = require('node-cron');
const { runAllChecks } = require('../services/monitoringService');
const { generateRecommendations } = require('../services/recommendationService');
const Project = require('../models/Project');
const CloudInstance = require('../models/CloudInstance');
const CloudMetric = require('../models/CloudMetric');
const logger = require('../utils/logger');
const { randFloat, pickRandom } = require('../utils/helpers');

/**
 * Schedule all background cron jobs.
 * Called once after the DB connection is established.
 */
const startJobs = () => {
  // ── Website Monitoring: every 5 minutes ────────────────────────────
  cron.schedule('*/5 * * * *', async () => {
    logger.info('[Cron] Running website health checks...');
    try {
      await runAllChecks();
    } catch (err) {
      logger.error(`[Cron] Website check error: ${err.message}`);
    }
  });

  // ── Simulate Cloud Metrics: every 2 minutes ────────────────────────
  cron.schedule('*/2 * * * *', async () => {
    logger.info('[Cron] Simulating cloud metrics...');
    try {
      const instances = await CloudInstance.find({ state: 'running' });
      const metricTypes = ['cpu', 'memory', 'network', 'storage'];
      const units = { cpu: 'percent', memory: 'percent', network: 'MB/s', storage: 'GB' };

      const metrics = [];
      for (const inst of instances) {
        for (const type of metricTypes) {
          let value;
          if (type === 'cpu') value = randFloat(inst.cpuUsage * 0.8, Math.min(inst.cpuUsage * 1.2, 100));
          else if (type === 'memory') value = randFloat(inst.memoryUsage * 0.9, Math.min(inst.memoryUsage * 1.1, 100));
          else if (type === 'network') value = randFloat(0.1, 50);
          else value = randFloat(inst.storageUsed * 0.95, inst.storageUsed * 1.05);

          metrics.push({
            instance: inst._id,
            project: inst.project,
            metricType: type,
            value: parseFloat(value.toFixed(2)),
            unit: units[type],
            timestamp: new Date(),
            region: inst.region,
          });
        }
      }
      if (metrics.length) await CloudMetric.insertMany(metrics);
    } catch (err) {
      logger.error(`[Cron] Metrics simulation error: ${err.message}`);
    }
  });

  // ── AI Recommendations: every 30 minutes ─────────────────────────
  cron.schedule('*/30 * * * *', async () => {
    logger.info('[Cron] Running AI recommendation engine...');
    try {
      const projects = await Project.find({ status: 'active' }).populate('owner');
      for (const project of projects) {
        await generateRecommendations(project._id, project.owner._id);
      }
    } catch (err) {
      logger.error(`[Cron] Recommendation engine error: ${err.message}`);
    }
  });

  // ── Cleanup old metrics: daily at 2am ─────────────────────────────
  cron.schedule('0 2 * * *', async () => {
    logger.info('[Cron] Cleaning up old cloud metrics...');
    try {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await CloudMetric.deleteMany({ timestamp: { $lt: cutoff } });
      logger.info(`[Cron] Deleted ${result.deletedCount} old metric records`);
    } catch (err) {
      logger.error(`[Cron] Cleanup error: ${err.message}`);
    }
  });

  logger.info('[Cron] All background jobs scheduled.');
};

module.exports = { startJobs };
