const Joi = require('joi');
const { ValidationError } = require('../shared');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return next(new ValidationError('Validation failed', details));
    }

    req.body = value;
    next();
  };
};

const categorySchema = Joi.object({
  name: Joi.string().required().max(50).messages({
    'any.required': 'Category name is required'
  }),
  description: Joi.string().optional().allow('')
});

const productSchema = Joi.object({
  name: Joi.string().required().max(200).messages({
    'any.required': 'Product name is required'
  }),
  description: Joi.string().required().messages({
    'any.required': 'Product description is required'
  }),
  price: Joi.number().required().min(0).messages({
    'any.required': 'Product price is required',
    'number.min': 'Price cannot be negative'
  }),
  category: Joi.string().required().messages({
    'any.required': 'Product category ID is required'
  }),
  stock: Joi.number().optional().min(0).default(0),
  images: Joi.array().items(Joi.string()).optional()
});

const stockSchema = Joi.object({
  stock: Joi.number().required().messages({
    'any.required': 'Stock count is required'
  })
});

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5).messages({
    'any.required': 'Rating is required',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5'
  }),
  comment: Joi.string().required().messages({
    'any.required': 'Comment is required'
  })
});

module.exports = {
  validateCategory: validateRequest(categorySchema),
  validateProduct: validateRequest(productSchema),
  validateStock: validateRequest(stockSchema),
  validateReview: validateRequest(reviewSchema)
};
