'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const User = require('../models/User');
const { unauthorized } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes — verifies Bearer JWT and attaches req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return unauthorized(res, 'Access denied. No token provided.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return unauthorized(res, 'Invalid or expired token.');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return unauthorized(res, 'User no longer exists.');
  }

  req.user = user;
  next();
});

/**
 * Restrict access to specified roles.
 * Usage: authorize('admin')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not allowed to perform this action.`,
    });
  }
  next();
};

module.exports = { protect, authorize };
