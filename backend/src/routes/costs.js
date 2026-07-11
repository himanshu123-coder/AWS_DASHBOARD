'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCostTrend, getCostByService, getCostByRegion, getCostPrediction } = require('../controllers/costController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/trend', getCostTrend);
router.get('/by-service', getCostByService);
router.get('/by-region', getCostByRegion);
router.get('/prediction', getCostPrediction);

module.exports = router;
