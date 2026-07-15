'use strict';

const express = require('express');
const router = express.Router();

const {
  createInstance,
  getInstances,
  getInstance,
  updateInstance,
  deleteInstance,
} = require('../controllers/instanceController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  instanceRules,
  mongoIdParam,
  paginationRules,
} = require('../validators');

router.use(protect);

router
  .route('/')
  .get(paginationRules, validate, getInstances)
  .post(instanceRules, validate, createInstance);

router
  .route('/:id')
  .get(mongoIdParam('id'), validate, getInstance)
  .put(mongoIdParam('id'), validate, updateInstance)
  .delete(mongoIdParam('id'), validate, deleteInstance);

module.exports = router;