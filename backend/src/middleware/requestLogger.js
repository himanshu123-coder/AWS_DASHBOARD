'use strict';

const morgan = require('morgan');
const logger = require('../utils/logger');

// Stream morgan output through winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream }
);

module.exports = morganMiddleware;
