'use strict';

const mongoose = require('mongoose');

const cloudConnectionSchema = new mongoose.Schema(
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
    accountId: {
      type: String,
      trim: true,
      default: '',
    },
    roleArn: {
      type: String,
      trim: true,
      default: '',
    },
    externalId: {
      type: String,
      trim: true,
      default: '',
    },
    defaultRegion: {
      type: String,
      default: 'us-east-1',
    },
    monitoringInterval: {
      type: Number,
      default: 5, // minutes
      min: [1, 'Interval must be at least 1 minute'],
      max: [60, 'Interval cannot exceed 60 minutes'],
    },
    enableCloudWatch: {
      type: Boolean,
      default: true,
    },
    enableCostExplorer: {
      type: Boolean,
      default: true,
    },
    lastTested: {
      type: Date,
      default: null,
    },
    connectionStatus: {
      type: String,
      enum: ['connected', 'failed', 'untested'],
      default: 'untested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CloudConnection', cloudConnectionSchema);
