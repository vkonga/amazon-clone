const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { validateProcessPayment } = require('../validators/payment.validator');
const { authenticate } = require('@amazon-clone/shared');

const jwtSecret = process.env.JWT_SECRET || 'secret123';
const auth = authenticate(jwtSecret);

router.post('/payments', auth, validateProcessPayment, paymentController.processPayment);
router.post('/payments/:transactionId/refund', auth, paymentController.refundPayment);
router.get('/payments/history', auth, paymentController.getTransactionHistory);
router.get('/payments/invoices/:orderId', auth, paymentController.getInvoice);

module.exports = router;
