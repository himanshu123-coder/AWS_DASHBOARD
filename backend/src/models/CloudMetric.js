'use strict';

const mongoose = require('mongoose');

const cloudMetricSchema = new mongoose.Schema(
  {
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CloudInstance',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    metricType: {
      type: String,
      enum: ['cpu', 'memory', 'network', 'storage'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['percent', 'MB', 'GB', 'MB/s', 'GB/s', 'count'],
      default: 'percent',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    region: {
      type: String,
      default: 'us-east-1',
    },
  },
  { timestamps: false }
);

cloudMetricSchema.index({ instance: 1, metricType: 1, timestamp: -1 });
cloudMetricSchema.index({ project: 1, timestamp: -1 });

module.exports = mongoose.model('CloudMetric', cloudMetricSchema);
