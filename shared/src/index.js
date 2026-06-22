const logger = require('./utils/logger');
const errors = require('./utils/errors');
const apiResponse = require('./utils/apiResponse');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const createRateLimiter = require('./middleware/rateLimiter');
const config = require('./config/config');

module.exports = {
  logger,
  ...errors,
  ...apiResponse,
  ...errorHandler,
  ...authMiddleware,
  createRateLimiter,
  ...config
};
