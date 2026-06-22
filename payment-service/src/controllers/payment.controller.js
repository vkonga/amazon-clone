const paymentService = require('../services/payment.service');
const { sendSuccess } = require('@amazon-clone/shared');

class PaymentController {
  async processPayment(req, res, next) {
    try {
      const transaction = await paymentService.processPayment(req.user.id, req.body);
      sendSuccess(res, transaction, 'Payment processed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const refund = await paymentService.refundPayment(req.user.id, req.params.transactionId);
      sendSuccess(res, refund, 'Refund processed successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionHistory(req, res, next) {
    try {
      const history = await paymentService.getTransactionHistory(req.user.id);
      sendSuccess(res, history, 'Transaction history retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getInvoice(req, res, next) {
    try {
      const invoice = await paymentService.getInvoiceByOrderId(req.user.id, req.params.orderId);
      sendSuccess(res, invoice, 'Invoice generated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
