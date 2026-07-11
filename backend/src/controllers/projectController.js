'use strict';

const Project = require('../models/Project');
const { ok, created, notFound, forbidden } = require('../utils/response');
const { paginationMeta } = require('../utils/helpers');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  const { name, description, environment, cloudProvider, defaultRegion } = req.body;
  const project = await Project.create({
    name,
    description,
    environment,
    cloudProvider,
    defaultRegion,
    owner: req.user._id,
  });
  return created(res, 'Project created.', project);
});

// GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { owner: req.user._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.environment) filter.environment = req.query.environment;

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return ok(res, 'Projects fetched.', projects, paginationMeta(total, page, limit));
});

// GET /api/projects/:id
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
  if (!project) return notFound(res, 'Project not found.');
  return ok(res, 'Project fetched.', project);
});

// PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, environment, cloudProvider, defaultRegion, status } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { name, description, environment, cloudProvider, defaultRegion, status },
    { new: true, runValidators: true }
  );
  if (!project) return notFound(res, 'Project not found.');
  return ok(res, 'Project updated.', project);
});

// DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!project) return notFound(res, 'Project not found.');
  return ok(res, 'Project deleted.');
});

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
