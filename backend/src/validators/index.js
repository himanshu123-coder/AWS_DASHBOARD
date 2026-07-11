'use strict';

const { body, param, query } = require('express-validator');

const VALID_REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-central-1',
  'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1',
  'sa-east-1', 'ca-central-1',
];

// ─── Auth ──────────────────────────────────────────────────────────────────

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

// ─── Project ───────────────────────────────────────────────────────────────

const projectRules = [
  body('name').trim().notEmpty().withMessage('Project name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('environment').optional()
    .isIn(['production', 'staging', 'development', 'testing'])
    .withMessage('Invalid environment'),
  body('cloudProvider').optional()
    .isIn(['AWS', 'GCP', 'Azure', 'DigitalOcean', 'Other'])
    .withMessage('Invalid cloud provider'),
  body('defaultRegion').optional()
    .isIn(VALID_REGIONS).withMessage('Invalid region'),
];

// ─── Cloud Connection ──────────────────────────────────────────────────────

const cloudConnectionRules = [
  body('monitoringInterval').optional().isInt({ min: 1, max: 60 })
    .withMessage('Monitoring interval must be 1–60 minutes'),
  body('defaultRegion').optional().isIn(VALID_REGIONS).withMessage('Invalid region'),
];

// ─── Website Config ────────────────────────────────────────────────────────

const websiteConfigRules = [
  body('websiteName').trim().notEmpty().withMessage('Website name is required')
    .isLength({ max: 100 }).withMessage('Website name cannot exceed 100 characters'),
  body('websiteUrl').trim().notEmpty().withMessage('Website URL is required')
    .isURL({ require_protocol: true }).withMessage('Valid URL with protocol is required'),
];

// ─── Cloud Instance ────────────────────────────────────────────────────────

const instanceRules = [
  body('instanceId').trim().notEmpty().withMessage('Instance ID is required'),
  body('name').trim().notEmpty().withMessage('Instance name is required'),
  body('state').optional().isIn(['running', 'stopped', 'pending', 'terminated', 'idle'])
    .withMessage('Invalid state'),
  body('region').optional().isIn(VALID_REGIONS).withMessage('Invalid region'),
  body('cpuUsage').optional().isFloat({ min: 0, max: 100 }).withMessage('CPU usage must be 0–100'),
  body('memoryUsage').optional().isFloat({ min: 0, max: 100 }).withMessage('Memory usage must be 0–100'),
];

// ─── Common ────────────────────────────────────────────────────────────────

const mongoIdParam = (paramName = 'id') =>
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`);

const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
];

module.exports = {
  registerRules,
  loginRules,
  changePasswordRules,
  projectRules,
  cloudConnectionRules,
  websiteConfigRules,
  instanceRules,
  mongoIdParam,
  paginationRules,
};
