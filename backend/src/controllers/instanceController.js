'use strict';

const CloudInstance = require('../models/CloudInstance');
const Project = require('../models/Project');
const Alert = require('../models/Alert');

const {
  ok,
  created,
  notFound,
} = require('../utils/response');

const {
  paginationMeta,
} = require('../utils/helpers');

const asyncHandler = require('../utils/asyncHandler');

async function getOrCreateWorkspace(userId) {
  let workspace = await Project.findOne({
    owner: userId,
    status: 'active',
  }).sort({ createdAt: -1 });

  if (!workspace) {
    workspace = await Project.create({
      name: 'Default AWS Workspace',
      description: 'Default cloud monitoring workspace',
      environment: 'production',
      cloudProvider: 'AWS',
      owner: userId,
      defaultRegion: 'ap-south-1',
      status: 'active',
    });
  }

  return workspace;
}

// POST /api/instances
const createInstance = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const instance = await CloudInstance.create({
    ...req.body,
    project: workspace._id,
    owner: req.user._id,
  });

  return created(res, 'Instance created.', instance);
});

// GET /api/instances
const getInstances = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const page = Math.max(
    parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  const allowedSortFields = [
    'createdAt',
    'name',
    'instanceId',
    'cpuUsage',
    'memoryUsage',
    'monthlyCost',
    'state',
    'region',
  ];

  const requestedSortField = req.query.sortBy || 'createdAt';

  const sortField = allowedSortFields.includes(
    requestedSortField
  )
    ? requestedSortField
    : 'createdAt';

  const sortDirection =
    req.query.sortDir === 'asc' ? 1 : -1;

  const filter = {
    project: workspace._id,
    owner: req.user._id,
  };

  if (req.query.state) {
    filter.state = req.query.state;
  }

  if (req.query.region) {
    filter.region = req.query.region;
  }

  if (req.query.search?.trim()) {
    const search = req.query.search.trim();

    filter.$or = [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        instanceId: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  const [instances, total] = await Promise.all([
    CloudInstance.find(filter)
      .sort({
        [sortField]: sortDirection,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    CloudInstance.countDocuments(filter),
  ]);

  return ok(
    res,
    'Instances fetched.',
    instances,
    paginationMeta(total, page, limit)
  );
});

// GET /api/instances/:id
const getInstance = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const instance = await CloudInstance.findOne({
    _id: req.params.id,
    project: workspace._id,
    owner: req.user._id,
  }).lean();

  if (!instance) {
    return notFound(res, 'Instance not found.');
  }

  return ok(res, 'Instance fetched.', instance);
});

// PUT /api/instances/:id
const updateInstance = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const instance = await CloudInstance.findOneAndUpdate(
    {
      _id: req.params.id,
      project: workspace._id,
      owner: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!instance) {
    return notFound(res, 'Instance not found.');
  }

  if (Number(instance.cpuUsage || 0) > 80) {
    const existingAlert = await Alert.findOne({
      project: workspace._id,
      owner: req.user._id,
      type: 'high_cpu',
      resourceId: instance.instanceId,
      status: 'active',
    });

    if (!existingAlert) {
      await Alert.create({
        project: workspace._id,
        owner: req.user._id,
        type: 'high_cpu',
        severity: 'high',
        title: `High CPU: ${instance.name}`,
        message: `CPU usage is at ${Number(
          instance.cpuUsage
        ).toFixed(1)}% on ${instance.name}.`,
        resourceId: instance.instanceId,
        resourceName: instance.name,
        metricValue: Number(instance.cpuUsage),
        threshold: 80,
        status: 'active',
      });
    }
  }

  return ok(res, 'Instance updated.', instance);
});

// DELETE /api/instances/:id
const deleteInstance = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const instance = await CloudInstance.findOneAndDelete({
    _id: req.params.id,
    project: workspace._id,
    owner: req.user._id,
  });

  if (!instance) {
    return notFound(res, 'Instance not found.');
  }

  return ok(res, 'Instance deleted.', {
    id: instance._id,
  });
});

module.exports = {
  createInstance,
  getInstances,
  getInstance,
  updateInstance,
  deleteInstance,
};