'use strict';

const axios = require('axios');
const WebsiteMetric = require('../models/WebsiteMetric');
const WebsiteConfig = require('../models/WebsiteConfig');
const Alert = require('../models/Alert');
const logger = require('../utils/logger');

/**
 * Perform an HTTP health check for a single WebsiteConfig document.
 * Creates a WebsiteMetric entry and fires alerts when thresholds are breached.
 */
const checkWebsite = async (config) => {
  const start = Date.now();
  let statusCode = 0;
  let isUp = false;
  let responseTime = 0;

  try {
    const response = await axios.get(config.websiteUrl, {
      timeout: 10000,
      validateStatus: () => true, // don't throw on 4xx/5xx
      maxRedirects: 5,
      headers: { 'User-Agent': 'CloudMonitor/1.0' },
    });
    statusCode = response.status;
    responseTime = Date.now() - start;
    isUp = statusCode >= 200 && statusCode < 400;
  } catch (err) {
    statusCode = 0;
    responseTime = Date.now() - start;
    isUp = false;
  }

  // Calculate simple rolling error rate from last 10 checks
  const recent = await WebsiteMetric.find({ websiteConfig: config._id })
    .sort({ checkedAt: -1 })
    .limit(10)
    .lean();

  const errorCount = recent.filter((m) => !m.isUp).length + (isUp ? 0 : 1);
  const errorRate = parseFloat(((errorCount / (recent.length + 1)) * 100).toFixed(2));

  const uptimePct = parseFloat((((recent.length + (isUp ? 1 : 0)) / (recent.length + 1)) * 100).toFixed(2));

  const metric = await WebsiteMetric.create({
    websiteConfig: config._id,
    project: config.project,
    responseTime,
    statusCode,
    uptime: uptimePct,
    requestCount: (recent[0]?.requestCount || 0) + 1,
    errorRate,
    isUp,
    checkedAt: new Date(),
  });

  // Alert: website down
  if (!isUp) {
    await _fireAlert(config, {
      type: 'website_down',
      severity: 'critical',
      title: `Website Down: ${config.websiteName}`,
      message: `${config.websiteUrl} is not responding (status: ${statusCode || 'timeout'}).`,
      metricValue: statusCode,
      threshold: 200,
    });
  }

  // Alert: slow response
  const slowThreshold = config.alertThreshold?.responseTime || 3000;
  if (isUp && responseTime > slowThreshold) {
    await _fireAlert(config, {
      type: 'slow_api',
      severity: 'high',
      title: `Slow Response: ${config.websiteName}`,
      message: `Response time is ${responseTime}ms (threshold: ${slowThreshold}ms).`,
      metricValue: responseTime,
      threshold: slowThreshold,
    });
  }

  // Alert: high error rate
  if (errorRate > 10) {
    await _fireAlert(config, {
      type: 'high_error_rate',
      severity: 'high',
      title: `High Error Rate: ${config.websiteName}`,
      message: `Error rate is ${errorRate}% over the last ${recent.length + 1} checks.`,
      metricValue: errorRate,
      threshold: 10,
    });
  }

  return metric;
};

/**
 * Create an alert only if no active alert of the same type exists for this config.
 */
const _fireAlert = async (config, alertData) => {
  const existing = await Alert.findOne({
    project: config.project,
    type: alertData.type,
    resourceId: config._id.toString(),
    status: 'active',
  });
  if (!existing) {
    await Alert.create({
      project: config.project,
      owner: config.owner,
      ...alertData,
      resourceId: config._id.toString(),
      resourceName: config.websiteName,
    });
  }
};

/**
 * Run checks for all enabled website configurations.
 */
const runAllChecks = async () => {
  const configs = await WebsiteConfig.find({ enableMonitoring: true });
  logger.info(`[WebsiteMonitor] Checking ${configs.length} websites`);
  const results = await Promise.allSettled(configs.map(checkWebsite));
  const failed = results.filter((r) => r.status === 'rejected').length;
  if (failed) logger.warn(`[WebsiteMonitor] ${failed} check(s) failed`);
};

module.exports = { checkWebsite, runAllChecks };
