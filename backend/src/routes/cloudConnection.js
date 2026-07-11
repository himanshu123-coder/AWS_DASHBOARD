'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCloudConnection, updateCloudConnection, testCloudConnection } = require('../controllers/cloudConnectionController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cloudConnectionRules } = require('../validators');

router.use(protect);

router.get('/', getCloudConnection);
router.put('/', cloudConnectionRules, validate, updateCloudConnection);
router.post('/test', testCloudConnection);

module.exports = router;