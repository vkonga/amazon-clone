require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Joi = require('joi');
const { logger, errorHandler, notFoundHandler, loadConfig } = require('@amazon-clone/shared');

// Define configurations schema using Joi
const configSchema = Joi.object({
  PORT: Joi.number().default(3001),
  MONGODB_URI: Joi.string().required().default('mongodb://localhost:27017/amazon_clone_user'),
  JWT_SECRET: Joi.string().required().default('secret123'),
  JWT_ACCESS_EXPIRE: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRE: Joi.string().default('7d')
});

let config;
try {
  config = loadConfig(configSchema);
} catch (err) {
  logger.error('Failed to load configs:', err);
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

// API Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Handle undefined routes
app.use(notFoundHandler);

// Handle errors
app.use(errorHandler);

// Database connection & Server bootstrap (only if not running tests)
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB successfully for User Service.');
      app.listen(config.PORT, () => {
        logger.info(`User Service is running on port ${config.PORT}`);
      });
    })
    .catch((err) => {
      logger.error('Database connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
