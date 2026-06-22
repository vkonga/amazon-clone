const Transaction = require('../models/transaction.model');

class TransactionRepository {
  async create(transactionData) {
    return await Transaction.create(transactionData);
  }

  async findById(id) {
    return await Transaction.findById(id);
  }

  async findByOrderId(orderId) {
    return await Transaction.find({ orderId });
  }

  async findByUserId(userId) {
    return await Transaction.find({ userId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Transaction.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new TransactionRepository();
