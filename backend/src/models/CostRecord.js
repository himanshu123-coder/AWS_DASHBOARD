'use strict';

const mongoose = require('mongoose');

const costRecordSchema = new mongoose.Schema(
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
    service: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      // e.g. EC2, S3, RDS, Lambda, CloudFront
    },
    amount: {
      type: Number,
      required: [true, 'Cost amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    region: {
      type: String,
      default: 'us-east-1',
    },
    usageDate: {
      type: Date,
      required: [true, 'Usage date is required'],
      index: true,
    },
    resourceId: {
      type: String,
      default: '',
    },
    tags: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

costRecordSchema.index({ project: 1, usageDate: -1 });
costRecordSchema.index({ owner: 1, service: 1 });

module.exports = mongoose.model('CostRecord', costRecordSchema);
