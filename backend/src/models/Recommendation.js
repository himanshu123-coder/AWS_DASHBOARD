'use strict';

const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
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
        'underutilized_instance',
        'overloaded_instance',
        'budget_exceeded',
        'idle_instance',
        'slow_website',
        'high_error_rate',
        'rightsizing',
        'reserved_instance',
        'unused_resource',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    savingEstimate: {
      type: Number,
      default: 0, // USD/month
    },
    confidenceScore: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },
    reason: {
      type: String,
      default: '',
    },
    resourceId: {
      type: String,
      default: '',
    },
    resourceName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'ignored', 'applied', 'apply_later'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: null,
    },
    ignoredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

recommendationSchema.index({ project: 1, status: 1 });
recommendationSchema.index({ owner: 1, type: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
