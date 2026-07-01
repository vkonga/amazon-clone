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

const cartItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  }),
  name: Joi.string().required().messages({
    'any.required': 'Product name is required'
  }),
  price: Joi.number().required().min(0).messages({
    'any.required': 'Product price is required'
  }),
  image: Joi.string().optional().allow(''),
  quantity: Joi.number().optional().min(1).default(1)
});

const cartItemQtySchema = Joi.object({
  quantity: Joi.number().required().min(1).messages({
    'any.required': 'Quantity is required',
    'number.min': 'Quantity must be at least 1'
  })
});

const checkoutSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().required().messages({
      'any.required': 'Full name is required'
    }),
    phoneNumber: Joi.string().required().messages({
      'any.required': 'Phone number is required'
    }),
    streetAddress: Joi.string().required().messages({
      'any.required': 'Street address is required'
    }),
    city: Joi.string().required().messages({
      'any.required': 'City is required'
    }),
    state: Joi.string().required().messages({
      'any.required': 'State is required'
    }),
    postalCode: Joi.string().required().messages({
      'any.required': 'Postal code is required'
    }),
    country: Joi.string().required().messages({
      'any.required': 'Country is required'
    })
  }).required().messages({
    'any.required': 'Shipping address is required'
  }),
  paymentMethod: Joi.string().valid('Credit Card', 'PayPal', 'COD').default('Credit Card')
});

const orderStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled').required().messages({
    'any.required': 'Order status is required'
  })
});

module.exports = {
  validateCartItem: validateRequest(cartItemSchema),
  validateCartItemQty: validateRequest(cartItemQtySchema),
  validateCheckout: validateRequest(checkoutSchema),
  validateOrderStatus: validateRequest(orderStatusSchema)
};
