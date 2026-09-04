'use strict';

const express = require('express');

const {
  getSettings,
  updateSettings,
} = require('../controllers/settingsController');

const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Authentication
router.use(protect);

// GET settings
router.get('/', getSettings);

// UPDATE settings
router.put('/', updateSettings);

module.exports = router;