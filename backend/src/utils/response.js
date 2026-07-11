'use strict';

/**
 * Send a standardised JSON response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {boolean} success
 * @param {string} message
 * @param {*} data
 * @param {object} [meta]  - extra envelope fields (pagination, etc.)
 */
const sendResponse = (res, statusCode, success, message, data = null, meta = {}) => {
  const payload = { success, message };
  if (data !== null) payload.data = data;
  if (Object.keys(meta).length) Object.assign(payload, meta);
  return res.status(statusCode).json(payload);
};

const ok = (res, message, data, meta) => sendResponse(res, 200, true, message, data, meta);
const created = (res, message, data) => sendResponse(res, 201, true, message, data);
const badRequest = (res, message, data) => sendResponse(res, 400, false, message, data);
const unauthorized = (res, message = 'Unauthorized') => sendResponse(res, 401, false, message);
const forbidden = (res, message = 'Forbidden') => sendResponse(res, 403, false, message);
const notFound = (res, message = 'Resource not found') => sendResponse(res, 404, false, message);
const conflict = (res, message) => sendResponse(res, 409, false, message);
const serverError = (res, message = 'Internal server error') => sendResponse(res, 500, false, message);

module.exports = { sendResponse, ok, created, badRequest, unauthorized, forbidden, notFound, conflict, serverError };
