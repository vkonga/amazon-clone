/**
 * Utility to load and validate environment configurations
 */
const Joi = require('joi');

const loadConfig = (schema) => {
  const { value, error } = schema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: false
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
};

module.exports = { loadConfig };
