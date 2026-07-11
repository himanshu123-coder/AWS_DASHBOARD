'use strict';

const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectRules, mongoIdParam } = require('../validators');

router.use(protect);

router.route('/')
  .post(projectRules, validate, createProject)
  .get(getProjects);

router.route('/:id')
  .get([mongoIdParam('id'), validate], getProject)
  .put([mongoIdParam('id'), validate, ...projectRules, validate], updateProject)
  .delete([mongoIdParam('id'), validate], deleteProject);

module.exports = router;