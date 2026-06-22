const Order = require('../models/order.model');

class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async findById(id) {
    return await Order.findById(id);
  }

  async findByUserId(userId) {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  }

  async findAll(query = {}, skip = 0, limit = 20) {
    const total = await Order.countDocuments(query);
    const data = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return { data, total };
  }

  async update(id, updateData) {
    return await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new OrderRepository();
