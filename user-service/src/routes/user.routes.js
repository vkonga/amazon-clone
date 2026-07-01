const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUpdateProfile, validateAddress } = require('../validators/user.validator');
const { authenticate } = require('../shared');

const jwtSecret = process.env.JWT_SECRET || 'secret123';
const auth = authenticate(jwtSecret);

// Profile routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, validateUpdateProfile, userController.updateProfile);

// Address routes
router.post('/addresses', auth, validateAddress, userController.addAddress);
router.get('/addresses', auth, userController.getAddresses);
router.put('/addresses/:id', auth, validateAddress, userController.updateAddress);
router.delete('/addresses/:id', auth, userController.deleteAddress);

module.exports = router;
