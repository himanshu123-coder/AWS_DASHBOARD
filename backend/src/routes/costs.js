'use strict';

const express = require('express');
const router = express.Router();

const {
  getCostTrend,
  getCostByService,
  getCostByRegion,
  getCostPrediction,
  createCostRecord,
} = require('../controllers/costController');

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createCostRecord);
router.get('/trend', getCostTrend);
router.get('/by-service', getCostByService);
router.get('/by-region', getCostByRegion);
router.get('/prediction', getCostPrediction);

module.exports = router;