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

const registerSchema = Joi.object({
  name: Joi.string().required().max(50).messages({
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('Customer', 'Admin').default('Customer')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required'
  })
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required'
  })
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  })
});

const updateProfileSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  email: Joi.string().email().optional()
});

const addressSchema = Joi.object({
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
  country: Joi.string().optional().default('United States'),
  isDefault: Joi.boolean().optional().default(false)
});

module.exports = {
  validateRegister: validateRequest(registerSchema),
  validateLogin: validateRequest(loginSchema),
  validateRefresh: validateRequest(refreshSchema),
  validateForgotPassword: validateRequest(forgotPasswordSchema),
  validateResetPassword: validateRequest(resetPasswordSchema),
  validateUpdateProfile: validateRequest(updateProfileSchema),
  validateAddress: validateRequest(addressSchema)
};
