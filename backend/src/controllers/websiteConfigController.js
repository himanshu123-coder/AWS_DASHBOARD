'use strict';

const WebsiteConfig = require('../models/WebsiteConfig');
const Project = require('../models/Project');
const { ok, notFound } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const _getProject = async (projectId, userId) =>
  Project.findOne({ _id: projectId, owner: userId });

// GET /api/projects/:projectId/website-config
const getWebsiteConfig = asyncHandler(async (req, res) => {
  const project = await _getProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const config = await WebsiteConfig.findOne({ project: project._id });
  if (!config) return notFound(res, 'Website config not found.');

  const trackingScript = _generateTrackingScript(config.projectTrackingId);
  return ok(res, 'Website config fetched.', { config, trackingScript });
});

// PUT /api/projects/:projectId/website-config
const updateWebsiteConfig = asyncHandler(async (req, res) => {
  const project = await _getProject(req.params.projectId, req.user._id);
  if (!project) return notFound(res, 'Project not found.');

  const { websiteName, websiteUrl, enableMonitoring, enableErrorTracking, checkInterval } = req.body;

  const config = await WebsiteConfig.findOneAndUpdate(
    { project: project._id },
    {
      owner: req.user._id,
      project: project._id,
      websiteName, websiteUrl,
      enableMonitoring, enableErrorTracking, checkInterval,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  const trackingScript = _generateTrackingScript(config.projectTrackingId);
  return ok(res, 'Website config updated.', { config, trackingScript });
});

const _generateTrackingScript = (trackingId) => `
<script>
  (function(w,d,s,i){
    w.CloudMonitorQueue = w.CloudMonitorQueue || [];
    w.CloudMonitorQueue.push(['init', '${trackingId}']);
    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    j.async = true;
    j.src = '${process.env.FRONTEND_URL || 'http://localhost:5173'}/tracker.js';
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', '${trackingId}');
</script>`.trim();

module.exports = { getWebsiteConfig, updateWebsiteConfig };
