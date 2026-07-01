require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Joi = require('joi');
const { logger, errorHandler, notFoundHandler, loadConfig } = require('./shared');

// Define configurations schema using Joi
const configSchema = Joi.object({
  PORT: Joi.number().default(3002),
  MONGODB_URI: Joi.string().required().default('mongodb://localhost:27017/amazon_clone_product'),
  JWT_SECRET: Joi.string().required().default('secret123'),
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

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'product-service' });
});

// API Routes
const productRoutes = require('./routes/product.routes');
app.use('/api', productRoutes);

// Handle undefined routes
app.use(notFoundHandler);

// Handle errors
app.use(errorHandler);

// Database connection & Server bootstrap (only if not running tests)
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('Connected to MongoDB successfully for Product Service.');
      app.listen(config.PORT, () => {
        logger.info(`Product Service is running on port ${config.PORT}`);
      });
    })
    .catch((err) => {
      logger.error('Database connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
