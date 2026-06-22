const transactionRepository = require('../repositories/transaction.repository');
const { NotFoundError, ValidationError } = require('@amazon-clone/shared');

class PaymentService {
  async processPayment(userId, paymentData) {
    const { orderId, amount, paymentMethod } = paymentData;

    // Simulate mock payment gateway validation (Stripe / PayPal)
    // 95% success rate simulation
    const isSuccess = Math.random() < 0.95;
    const status = isSuccess ? 'Completed' : 'Failed';

    const transaction = await transactionRepository.create({
      userId,
      orderId,
      amount,
      paymentMethod,
      status,
      transactionType: 'Payment'
    });

    if (status === 'Failed') {
      throw new ValidationError('Payment declined by card issuer');
    }

    return transaction;
  }

  async refundPayment(userId, transactionId) {
    const parentTx = await transactionRepository.findById(transactionId);
    if (!parentTx) {
      throw new NotFoundError('Transaction');
    }

    if (parentTx.status !== 'Completed') {
      throw new ValidationError('Cannot refund an incomplete transaction');
    }

    // Mark parent transaction as Refunded
    await transactionRepository.update(transactionId, { status: 'Refunded' });

    // Create a new Refund transaction
    return await transactionRepository.create({
      userId: parentTx.userId,
      orderId: parentTx.orderId,
      amount: parentTx.amount,
      paymentMethod: parentTx.paymentMethod,
      status: 'Completed',
      transactionType: 'Refund'
    });
  }

  async getTransactionHistory(userId) {
    return await transactionRepository.findByUserId(userId);
  }

  async getInvoiceByOrderId(userId, orderId) {
    const transactions = await transactionRepository.findByOrderId(orderId);
    const invoiceTx = transactions.find(t => t.transactionType === 'Payment' && t.status === 'Completed');
    if (!invoiceTx) {
      throw new NotFoundError('Completed transaction / invoice');
    }
    
    // Check ownership
    if (invoiceTx.userId !== userId) {
      throw new ValidationError('Access denied');
    }

    return {
      invoiceNumber: invoiceTx.invoiceNumber,
      invoiceDate: invoiceTx.invoiceDate,
      orderId: invoiceTx.orderId,
      amount: invoiceTx.amount,
      paymentMethod: invoiceTx.paymentMethod,
      status: invoiceTx.status
    };
  }
}

module.exports = new PaymentService();
