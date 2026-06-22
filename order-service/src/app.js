require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Joi = require('joi');
const { logger, errorHandler, notFoundHandler, loadConfig } = require('@amazon-clone/shared');

// Define configuration schema using Joi
const configSchema = Joi.object({
  PORT: Joi.number().default(3003),
  MONGODB_URI: Joi.string().required().default('mongodb://localhost:27017/amazon_clone_order'),
  JWT_SECRET: Joi.string().required().default('secret123'),
  PRODUCT_SERVICE_URL: Joi.string().default('http://localhost:3002/api'),
  PAYMENT_SERVICE_URL: Joi.string().default('http://localhost:3004/api'),
  NODE_ENV: Joi.string().default('development')
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
  res.status(200).json({ status: 'UP', service: 'order-service' });
});

// API Routes
const orderRoutes = require('./routes/order.routes');
app.use('/api', orderRoutes);

// Handle undefined routes
app.use(notFoundHandler);

// Handle errors
app.use(errorHandler);

// Database connection & Server bootstrap (only if not running tests)
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB successfully for Order Service.');
      app.listen(config.PORT, () => {
        logger.info(`Order Service is running on port ${config.PORT}`);
      });
    })
    .catch((err) => {
      logger.error('Database connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
