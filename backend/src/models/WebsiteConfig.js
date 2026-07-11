'use strict';

const mongoose = require('mongoose');

const websiteConfigSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    websiteName: {
      type: String,
      required: [true, 'Website name is required'],
      trim: true,
      maxlength: [100, 'Website name cannot exceed 100 characters'],
    },
    websiteUrl: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    projectTrackingId: {
      type: String,
      unique: true,
      default: () => `trk_${Math.random().toString(36).substr(2, 16)}`,
    },
    enableMonitoring: {
      type: Boolean,
      default: true,
    },
    enableErrorTracking: {
      type: Boolean,
      default: true,
    },
    checkInterval: {
      type: Number,
      default: 5, // minutes
      min: 1,
      max: 60,
    },
    alertThreshold: {
      responseTime: { type: Number, default: 3000 }, // ms
      uptimeMin: { type: Number, default: 99.5 },    // %
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebsiteConfig', websiteConfigSchema);
