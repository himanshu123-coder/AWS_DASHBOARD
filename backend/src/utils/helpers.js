'use strict';

const mongoose = require('mongoose');

/**
 * Returns true if value is a valid MongoDB ObjectId string.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Clamp a number between min and max.
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Generate a random float between min and max (inclusive), rounded to `decimals`.
 */
const randFloat = (min, max, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

/**
 * Generate a random integer between min and max (inclusive).
 */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Pick a random element from an array.
 */
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Build a pagination meta object to attach to list responses.
 */
const paginationMeta = (total, page, limit) => ({
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  },
});

module.exports = { isValidObjectId, clamp, randFloat, randInt, pickRandom, paginationMeta };
