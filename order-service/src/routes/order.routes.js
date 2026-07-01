const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const orderController = require('../controllers/order.controller');
const {
  validateCartItem,
  validateCartItemQty,
  validateCheckout,
  validateOrderStatus
} = require('../validators/order.validator');
const { authenticate, authorize } = require('../shared');

const jwtSecret = process.env.JWT_SECRET || 'secret123';
const auth = authenticate(jwtSecret);
const adminOnly = authorize('Admin');

// Shopping cart routes
router.get('/cart', auth, cartController.getCart);
router.post('/cart', auth, validateCartItem, cartController.addItem);
router.put('/cart/items/:productId', auth, validateCartItemQty, cartController.updateItemQuantity);
router.delete('/cart/items/:productId', auth, cartController.removeItem);
router.delete('/cart', auth, cartController.clearCart);

// Checkout & Order routes
router.post('/orders', auth, validateCheckout, orderController.createOrder);
router.get('/orders', auth, orderController.getUserOrders);
router.get('/orders/all', auth, adminOnly, orderController.listAllOrders);
router.get('/orders/:id', auth, orderController.getOrder);
router.put('/orders/:id/status', auth, adminOnly, validateOrderStatus, orderController.updateOrderStatus);

module.exports = router;
