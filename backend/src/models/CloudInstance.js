'use strict';

const mongoose = require('mongoose');

const cloudInstanceSchema = new mongoose.Schema(
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
    instanceId: {
      type: String,
      required: [true, 'Instance ID is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Instance name is required'],
      trim: true,
    },
    instanceType: {
      type: String,
      default: 't3.medium',
    },
    state: {
      type: String,
      enum: ['running', 'stopped', 'pending', 'terminated', 'idle'],
      default: 'running',
    },
    region: {
      type: String,
      default: 'us-east-1',
    },
    cpuUsage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    memoryUsage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    storageUsed: {
      type: Number,
      default: 0, // GB
    },
    networkIn: {
      type: Number,
      default: 0, // MB/s
    },
    networkOut: {
      type: Number,
      default: 0, // MB/s
    },
    monthlyCost: {
      type: Number,
      default: 0, // USD
    },
    uptime: {
      type: Number,
      default: 100, // percentage
    },
    tags: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

cloudInstanceSchema.index({ project: 1, instanceId: 1 }, { unique: true });
cloudInstanceSchema.index({ owner: 1, state: 1 });

module.exports = mongoose.model('CloudInstance', cloudInstanceSchema);
