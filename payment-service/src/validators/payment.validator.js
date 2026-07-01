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

const processPaymentSchema = Joi.object({
  orderId: Joi.string().required().messages({
    'any.required': 'Order ID is required'
  }),
  amount: Joi.number().required().min(0.01).messages({
    'any.required': 'Payment amount is required',
    'number.min': 'Amount must be greater than 0'
  }),
  paymentMethod: Joi.string().valid('Credit Card', 'PayPal', 'COD').required().messages({
    'any.required': 'Payment method is required'
  })
});

module.exports = {
  validateProcessPayment: validateRequest(processPaymentSchema)
};
