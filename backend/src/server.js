'use strict';

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { startJobs } = require('./jobs/scheduler');
const logger = require('./utils/logger');
const { PORT } = require('./config/constants');

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`API base:     http://localhost:${PORT}/api`);
  });

  // Start background cron jobs after DB is ready
  startJobs();

  // ── Graceful shutdown ─────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      const mongoose = require('mongoose');
      await mongoose.disconnect();
      logger.info('MongoDB disconnected. Bye!');
      process.exit(0);
    });

    // Force kill after 10 s
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    shutdown('unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    shutdown('uncaughtException');
  });
};

startServer();
