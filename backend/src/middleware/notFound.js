'use strict';

const { notFound: notFoundResponse } = require('../utils/response');

/**
 * Catch-all for unregistered routes — returns 404 in the standard envelope.
 */
const notFound = (req, res) => {
  notFoundResponse(res, `Route ${req.originalUrl} not found.`);
};

module.exports = notFound;
