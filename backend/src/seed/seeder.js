'use strict';

/**
 * Seed script — populates the database with realistic dummy data.
 * Run: npm run seed
 * Wipe + reseed: node src/seed/seeder.js --fresh
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const User = require('../models/User');
const Project = require('../models/Project');
const CloudConnection = require('../models/CloudConnection');
const WebsiteConfig = require('../models/WebsiteConfig');
const CloudInstance = require('../models/CloudInstance');
const CloudMetric = require('../models/CloudMetric');
const WebsiteMetric = require('../models/WebsiteMetric');
const CostRecord = require('../models/CostRecord');
const Alert = require('../models/Alert');
const Recommendation = require('../models/Recommendation');

const { randFloat, randInt, pickRandom } = require('../utils/helpers');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cloud_monitor';

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
const INSTANCE_TYPES = ['t3.micro', 't3.small', 't3.medium', 't3.large', 'm5.large', 'c5.xlarge'];
const STATES = ['running', 'running', 'running', 'running', 'stopped', 'idle'];
const SERVICES = ['EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'ELB', 'ECS'];
const ENVIRONMENTS = ['production', 'staging', 'development'];
const CLOUD_PROVIDERS = ['AWS', 'GCP', 'Azure'];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const fresh = process.argv.includes('--fresh');
  if (fresh) {
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      CloudConnection.deleteMany({}),
      WebsiteConfig.deleteMany({}),
      CloudInstance.deleteMany({}),
      CloudMetric.deleteMany({}),
      WebsiteMetric.deleteMany({}),
      CostRecord.deleteMany({}),
      Alert.deleteMany({}),
      Recommendation.deleteMany({}),
    ]);
    console.log('Wiped all collections.');
  }

  // ── Users ──────────────────────────────────────────────────────────
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@cloudmonitor.dev',
    password: 'Admin@1234',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=80',
  });

  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@cloudmonitor.dev',
    password: 'Demo@1234',
    role: 'user',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=80',
  });

  console.log('Users created.');

  // ── Projects ───────────────────────────────────────────────────────
  const projectData = [
    { name: 'Production AWS', description: 'Main production workload on AWS', environment: 'production', cloudProvider: 'AWS', defaultRegion: 'us-east-1' },
    { name: 'Staging GCP', description: 'Staging environment on Google Cloud', environment: 'staging', cloudProvider: 'GCP', defaultRegion: 'us-west-2' },
    { name: 'Dev Environment', description: 'Development and testing workloads', environment: 'development', cloudProvider: 'AWS', defaultRegion: 'eu-west-1' },
  ];

  const projects = [];
  for (const pd of projectData) {
    const p = await Project.create({ ...pd, owner: adminUser._id });
    projects.push(p);
  }

  // Give demo user one project too
  const demoProject = await Project.create({
    name: 'Demo Project',
    description: 'Demo project for exploration',
    environment: 'development',
    cloudProvider: 'AWS',
    defaultRegion: 'us-east-1',
    owner: demoUser._id,
  });

  console.log('Projects created.');

  // ── Cloud Connections ──────────────────────────────────────────────
  for (const project of projects) {
    await CloudConnection.create({
      project: project._id,
      owner: adminUser._id,
      accountId: `${randInt(100000000000, 999999999999)}`,
      roleArn: `arn:aws:iam::${randInt(100000000000, 999999999999)}:role/CloudMonitorRole`,
      externalId: `ext-${Math.random().toString(36).substr(2, 12)}`,
      defaultRegion: project.defaultRegion,
      monitoringInterval: pickRandom([1, 5, 10]),
      enableCloudWatch: true,
      enableCostExplorer: true,
      connectionStatus: 'connected',
      lastTested: new Date(),
    });
  }

  console.log('Cloud connections created.');

  // ── Website Configs ────────────────────────────────────────────────
  const websiteConfigs = [];
  const websiteSamples = [
    { websiteName: 'Main Website', websiteUrl: 'https://example.com' },
    { websiteName: 'API Gateway', websiteUrl: 'https://api.example.com' },
    { websiteName: 'Admin Portal', websiteUrl: 'https://admin.example.com' },
  ];
  for (let i = 0; i < projects.length; i++) {
    const wc = await WebsiteConfig.create({
      project: projects[i]._id,
      owner: adminUser._id,
      websiteName: websiteSamples[i].websiteName,
      websiteUrl: websiteSamples[i].websiteUrl,
      enableMonitoring: true,
      enableErrorTracking: true,
      checkInterval: 5,
    });
    websiteConfigs.push(wc);
  }

  console.log('Website configs created.');

  // ── Cloud Instances ────────────────────────────────────────────────
  const allInstances = [];
  for (const project of projects) {
    const count = randInt(3, 8);
    for (let i = 0; i < count; i++) {
      const state = pickRandom(STATES);
      const cpuUsage = state === 'running' ? randFloat(2, 95) : 0;
      const inst = await CloudInstance.create({
        project: project._id,
        owner: adminUser._id,
        instanceId: `i-${Math.random().toString(16).substr(2, 17)}`,
        name: `${project.name.split(' ')[0]}-server-${i + 1}`,
        instanceType: pickRandom(INSTANCE_TYPES),
        state,
        region: pickRandom(REGIONS),
        cpuUsage,
        memoryUsage: state === 'running' ? randFloat(20, 95) : 0,
        storageUsed: randFloat(10, 500),
        networkIn: state === 'running' ? randFloat(0.1, 100) : 0,
        networkOut: state === 'running' ? randFloat(0.1, 50) : 0,
        monthlyCost: randFloat(20, 800),
        uptime: state === 'running' ? randFloat(95, 100) : 0,
      });
      allInstances.push(inst);
    }
  }

  console.log(`Cloud instances created: ${allInstances.length}`);

  // ── Cloud Metrics (last 24 hours, hourly) ──────────────────────────
  const metricBatch = [];
  const metricTypes = ['cpu', 'memory', 'network', 'storage'];
  const units = { cpu: 'percent', memory: 'percent', network: 'MB/s', storage: 'GB' };

  const runningInstances = allInstances.filter((i) => i.state === 'running');
  for (const inst of runningInstances) {
    for (let h = 23; h >= 0; h--) {
      const ts = new Date(Date.now() - h * 60 * 60 * 1000);
      for (const type of metricTypes) {
        let value;
        if (type === 'cpu') value = randFloat(Math.max(0, inst.cpuUsage - 15), Math.min(100, inst.cpuUsage + 15));
        else if (type === 'memory') value = randFloat(Math.max(0, inst.memoryUsage - 10), Math.min(100, inst.memoryUsage + 10));
        else if (type === 'network') value = randFloat(0.1, 80);
        else value = randFloat(inst.storageUsed * 0.9, inst.storageUsed * 1.1);

        metricBatch.push({
          instance: inst._id,
          project: inst.project,
          metricType: type,
          value: parseFloat(value.toFixed(2)),
          unit: units[type],
          timestamp: ts,
          region: inst.region,
        });
      }
    }
  }
  if (metricBatch.length) await CloudMetric.insertMany(metricBatch);
  console.log(`Cloud metrics inserted: ${metricBatch.length}`);

  // ── Website Metrics (last 7 days, every 30 min) ────────────────────
  const websiteMetricBatch = [];
  for (const wc of websiteConfigs) {
    for (let m = 336; m >= 0; m -= 1) { // every 30-min slot for 7 days = ~336 slots
      const ts = new Date(Date.now() - m * 30 * 60 * 1000);
      const isUp = Math.random() > 0.03; // 97% uptime
      const responseTime = isUp ? randInt(80, 2500) : 0;
      const errorRate = isUp ? randFloat(0, 3) : 100;

      websiteMetricBatch.push({
        websiteConfig: wc._id,
        project: wc.project,
        responseTime,
        statusCode: isUp ? 200 : pickRandom([500, 503, 504, 0]),
        uptime: isUp ? randFloat(98, 100) : 0,
        requestCount: randInt(50, 5000),
        errorRate,
        isUp,
        checkedAt: ts,
      });
    }
  }
  if (websiteMetricBatch.length) await WebsiteMetric.insertMany(websiteMetricBatch);
  console.log(`Website metrics inserted: ${websiteMetricBatch.length}`);

  // ── Cost Records (last 6 months, daily) ────────────────────────────
  const costBatch = [];
  for (const project of projects) {
    for (let d = 180; d >= 0; d--) {
      const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
      const numServices = randInt(2, 5);
      const services = [...SERVICES].sort(() => 0.5 - Math.random()).slice(0, numServices);
      for (const service of services) {
        costBatch.push({
          project: project._id,
          owner: adminUser._id,
          service,
          amount: randFloat(5, 150),
          region: pickRandom(REGIONS),
          usageDate: date,
          resourceId: `resource-${Math.random().toString(36).substr(2, 8)}`,
        });
      }
    }
  }
  if (costBatch.length) await CostRecord.insertMany(costBatch);
  console.log(`Cost records inserted: ${costBatch.length}`);

  // ── Alerts ─────────────────────────────────────────────────────────
  const alertTypes = ['high_cpu', 'website_down', 'budget_exceeded', 'high_error_rate', 'slow_api', 'storage_full', 'high_memory'];
  const alertSeverities = ['low', 'medium', 'high', 'critical'];
  const alertStatuses = ['active', 'active', 'active', 'acknowledged', 'resolved'];

  for (const project of projects) {
    for (let i = 0; i < randInt(4, 10); i++) {
      const type = pickRandom(alertTypes);
      const severity = pickRandom(alertSeverities);
      const status = pickRandom(alertStatuses);
      await Alert.create({
        project: project._id,
        owner: adminUser._id,
        type,
        severity,
        title: `${type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Alert`,
        message: `Simulated ${type} alert for project ${project.name}.`,
        resourceId: `i-${Math.random().toString(16).substr(2, 8)}`,
        resourceName: `server-${randInt(1, 10)}`,
        metricValue: randFloat(70, 100),
        threshold: 80,
        status,
        ...(status === 'acknowledged' && { acknowledgedAt: new Date() }),
        ...(status === 'resolved' && {
          resolvedAt: new Date(),
          resolvedBy: adminUser._id,
        }),
      });
    }
  }

  console.log('Alerts created.');

  // ── Recommendations ────────────────────────────────────────────────
  const recTypes = ['underutilized_instance', 'overloaded_instance', 'idle_instance', 'budget_exceeded', 'slow_website', 'rightsizing', 'reserved_instance'];
  const recStatuses = ['pending', 'pending', 'pending', 'ignored', 'applied', 'apply_later'];

  for (const project of projects) {
    for (let i = 0; i < randInt(3, 7); i++) {
      const type = pickRandom(recTypes);
      const status = pickRandom(recStatuses);
      await Recommendation.create({
        project: project._id,
        owner: adminUser._id,
        type,
        title: `${type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
        description: `AI-generated recommendation: ${type.replace(/_/g, ' ')} detected in project ${project.name}.`,
        severity: pickRandom(alertSeverities),
        savingEstimate: randFloat(0, 300),
        confidenceScore: randFloat(0.7, 1.0),
        reason: 'Based on last 7 days of usage patterns and cost analysis.',
        resourceId: `i-${Math.random().toString(16).substr(2, 8)}`,
        resourceName: `server-${randInt(1, 10)}`,
        status,
        ...(status === 'applied' && { appliedAt: new Date() }),
        ...(status === 'ignored' && { ignoredAt: new Date() }),
      });
    }
  }

  console.log('Recommendations created.');

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────────────');
  console.log(' Admin  → admin@cloudmonitor.dev  / Admin@1234');
  console.log(' Demo   → demo@cloudmonitor.dev   / Demo@1234');
  console.log('─────────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
