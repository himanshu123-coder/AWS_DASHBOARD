'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { getWebsiteConfig, updateWebsiteConfig } = require('../controllers/websiteConfigController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { websiteConfigRules } = require('../validators');

router.use(protect);

router.get('/', getWebsiteConfig);
router.put('/', websiteConfigRules, validate, updateWebsiteConfig);

module.exports = router;
