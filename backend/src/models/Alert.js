'use strict';

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'high_cpu',
        'website_down',
        'budget_exceeded',
        'high_error_rate',
        'slow_api',
        'storage_full',
        'high_memory',
        'instance_idle',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    resourceName: {
      type: String,
      default: '',
    },
    metricValue: {
      type: Number,
      default: null,
    },
    threshold: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'acknowledged', 'resolved'],
      default: 'active',
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

alertSchema.index({ project: 1, status: 1, createdAt: -1 });
alertSchema.index({ owner: 1, type: 1 });

module.exports = mongoose.model('Alert', alertSchema);
