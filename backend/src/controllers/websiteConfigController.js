'use strict';

const WebsiteConfig = require('../models/WebsiteConfig');
const Project = require('../models/Project');

const { ok, notFound } = require('../utils/response');
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

function generateTrackingScript(trackingId) {
  const frontendUrl =
    process.env.FRONTEND_URL || 'http://localhost:5173';

  return `
<script>
  (function(w,d,s,i){
    w.CloudMonitorQueue = w.CloudMonitorQueue || [];
    w.CloudMonitorQueue.push(['init', '${trackingId}']);

    var firstScript = d.getElementsByTagName(s)[0];
    var trackerScript = d.createElement(s);

    trackerScript.async = true;
    trackerScript.src = '${frontendUrl}/tracker.js';

    firstScript.parentNode.insertBefore(
      trackerScript,
      firstScript
    );
  })(window, document, 'script', '${trackingId}');
</script>
  `.trim();
}

// GET /api/website-config
const getWebsiteConfig = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const config = await WebsiteConfig.findOne({
    project: workspace._id,
    owner: req.user._id,
  });

  if (!config) {
    return notFound(res, 'Website config not found.');
  }

  const trackingScript = generateTrackingScript(
    config.projectTrackingId
  );

  return ok(res, 'Website config fetched.', {
    config,
    trackingScript,
  });
});

// PUT /api/website-config
const updateWebsiteConfig = asyncHandler(async (req, res) => {
  const workspace = await getOrCreateWorkspace(req.user._id);

  const {
    websiteName,
    websiteUrl,
    enableMonitoring,
    enableErrorTracking,
    enableUptimeMonitoring,
    checkInterval,
    trackingInterval,
  } = req.body;

  const normalizedInterval =
    Number(checkInterval ?? trackingInterval) || 5;

  const normalizedMonitoring =
    typeof enableMonitoring === 'boolean'
      ? enableMonitoring
      : typeof enableUptimeMonitoring === 'boolean'
        ? enableUptimeMonitoring
        : true;

  const config = await WebsiteConfig.findOneAndUpdate(
    {
      project: workspace._id,
      owner: req.user._id,
    },
    {
      $set: {
        owner: req.user._id,
        project: workspace._id,
        websiteName,
        websiteUrl,
        enableMonitoring: normalizedMonitoring,
        enableErrorTracking:
          typeof enableErrorTracking === 'boolean'
            ? enableErrorTracking
            : true,
        checkInterval: normalizedInterval,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  const trackingScript = generateTrackingScript(
    config.projectTrackingId
  );

  return ok(res, 'Website config updated.', {
    config,
    trackingScript,
  });
});

module.exports = {
  getWebsiteConfig,
  updateWebsiteConfig,
};