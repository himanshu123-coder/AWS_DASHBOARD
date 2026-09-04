'use strict';

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },

    // AWS Settings
    awsAccountId: {
      type: String,
      default: '',
      trim: true,
    },

    iamRoleArn: {
      type: String,
      default: '',
      trim: true,
    },

    defaultRegion: {
      type: String,
      default: 'ap-south-1',
      trim: true,
    },

    externalId: {
      type: String,
      default: '',
      trim: true,
    },

    monitoringInterval: {
      type: Number,
      default: 5,
      min: 1,
    },

    enableCostExplorer: {
      type: Boolean,
      default: true,
    },

    enableCloudWatch: {
      type: Boolean,
      default: true,
    },

    // Website Settings
    websiteName: {
      type: String,
      default: '',
      trim: true,
    },

    websiteUrl: {
      type: String,
      default: '',
      trim: true,
    },

    trackingInterval: {
      type: Number,
      default: 1,
      min: 1,
    },

    enableErrorTracking: {
      type: Boolean,
      default: true,
    },

    enableUptimeMonitoring: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);