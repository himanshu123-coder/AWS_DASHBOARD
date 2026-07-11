'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAlerts, getActiveAlerts, getResolvedAlerts, acknowledgeAlert, resolveAlert } = require('../controllers/alertController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { mongoIdParam } = require('../validators');

router.use(protect);

router.get('/', getAlerts);
router.get('/active', getActiveAlerts);
router.get('/resolved', getResolvedAlerts);
router.put('/:id/acknowledge', [mongoIdParam('id'), validate], acknowledgeAlert);
router.put('/:id/resolve', [mongoIdParam('id'), validate], resolveAlert);

module.exports = router;