'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { generate, getRecommendations, ignoreRecommendation, applyLater, markApplied } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

router.use(protect);

router.post('/generate', generate);
router.get('/', getRecommendations);
router.put('/:id/ignore', [mongoIdParam('id'), validate], ignoreRecommendation);
router.put('/:id/apply-later', [mongoIdParam('id'), validate], applyLater);
router.put('/:id/mark-applied', [mongoIdParam('id'), validate], markApplied);

module.exports = router;
