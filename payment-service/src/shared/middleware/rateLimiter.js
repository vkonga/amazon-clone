const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

/**
 * Creates a rate limiter middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max number of requests per window
 * @param {string} message - Error message on limit exceed
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests, please try again later.') => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      sendError(res, message, 429, 'RATE_LIMIT_EXCEEDED');
    }
  });
};

module.exports = createRateLimiter;
