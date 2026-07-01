const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/errors');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticate = (jwtSecret) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Access token is missing or invalid');
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, jwtSecret);
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'Customer'
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to restrict access based on roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
