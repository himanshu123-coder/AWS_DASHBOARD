'use strict';

const mongoose = require('mongoose');

const websiteMetricSchema = new mongoose.Schema(
  {
    websiteConfig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WebsiteConfig',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    responseTime: {
      type: Number,
      default: 0, // ms
    },
    statusCode: {
      type: Number,
      default: 200,
    },
    uptime: {
      type: Number,
      default: 100, // percent
      min: 0,
      max: 100,
    },
    requestCount: {
      type: Number,
      default: 0,
    },
    errorRate: {
      type: Number,
      default: 0, // percent
      min: 0,
      max: 100,
    },
    isUp: {
      type: Boolean,
      default: true,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

websiteMetricSchema.index({ websiteConfig: 1, checkedAt: -1 });
websiteMetricSchema.index({ project: 1, checkedAt: -1 });

module.exports = mongoose.model('WebsiteMetric', websiteMetricSchema);
