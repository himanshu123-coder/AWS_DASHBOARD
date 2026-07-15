'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const corsOptions = require('./config/cors');
const { globalLimiter } = require('./config/rateLimit');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// ── Route imports ──────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const cloudConnectionRoutes = require('./routes/cloudConnection');
const websiteConfigRoutes = require('./routes/websiteConfig');
const instanceRoutes = require('./routes/instances');
const metricsRoutes = require('./routes/metrics');
const websiteMetricsRoutes = require('./routes/websiteMetrics');
const costRoutes = require('./routes/costs');
const alertRoutes = require('./routes/alerts');
const recommendationRoutes = require('./routes/recommendations');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));


// ── Request parsing ────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(compression());

// ── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// ── Global rate limit ──────────────────────────────────────────────────────
app.use('/api', globalLimiter);

// ── Health check (no auth) ─────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Cloud Monitor API is running.',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date(),
  });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);

// Sub-resource routes (nested under /api/projects/:projectId)
app.use('/api/projects/:projectId/cloud-connection', cloudConnectionRoutes);
app.use('/api/website-config', websiteConfigRoutes);
app.use('/api/instances', instanceRoutes);
app.use('/api/projects/:projectId/metrics', metricsRoutes);
app.use('/api/website-metrics', websiteMetricsRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/projects/:projectId/alerts', alertRoutes);
app.use('/api/projects/:projectId/recommendations', recommendationRoutes);

// ── 404 ────────────────────────────────────────────────────────────────────
app.use(notFound);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
