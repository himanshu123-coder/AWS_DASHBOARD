'use strict';

const express = require('express');
const router = express.Router({ mergeParams: true });
const { createInstance, getInstances, getInstance, updateInstance, deleteInstance } = require('../controllers/instanceController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { instanceRules, mongoIdParam, paginationRules } = require('../validators');

router.use(protect);

router.route('/')
  .post(instanceRules, validate, createInstance)
  .get(paginationRules, validate, getInstances);

router.route('/:id')
  .get([mongoIdParam('id'), validate], getInstance)
  .put([mongoIdParam('id'), validate], updateInstance)
  .delete([mongoIdParam('id'), validate], deleteInstance);

module.exports = router;