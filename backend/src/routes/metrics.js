'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCpuTrend, getNetworkTrend, getMetricsSummary } = require('../controllers/metricsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/cpu-trend', getCpuTrend);
router.get('/network-trend', getNetworkTrend);
router.get('/summary', getMetricsSummary);

module.exports = router;
