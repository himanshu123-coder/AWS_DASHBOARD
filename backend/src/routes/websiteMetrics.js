'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getWebsiteSummary, getResponseTimeTrend, getUptimeTrend, manualHealthCheck } = require('../controllers/websiteMetricsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', getWebsiteSummary);
router.get('/response-time-trend', getResponseTimeTrend);
router.get('/uptime-trend', getUptimeTrend);
router.post('/check', manualHealthCheck);

module.exports = router;