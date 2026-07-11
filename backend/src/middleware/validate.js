'use strict';

const { validationResult } = require('express-validator');
const { badRequest } = require('../utils/response');

/**
 * Runs after express-validator chains.
 * If there are errors, returns 400 with the first error message.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0];
    return badRequest(res, firstError.msg, { errors: errors.array() });
  }
  next();
};

module.exports = validate;
