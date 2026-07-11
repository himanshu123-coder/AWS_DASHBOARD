'use strict';

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    environment: {
      type: String,
      enum: ['production', 'staging', 'development', 'testing'],
      default: 'development',
    },
    cloudProvider: {
      type: String,
      enum: ['AWS', 'GCP', 'Azure', 'DigitalOcean', 'Other'],
      default: 'AWS',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    defaultRegion: {
      type: String,
      default: 'us-east-1',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Ensure a user cannot have duplicate project names
projectSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
