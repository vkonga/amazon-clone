const Cart = require('../models/cart.model');

class CartRepository {
  async findByUserId(userId) {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [], totalAmount: 0 });
    }
    return cart;
  }

  async update(cart) {
    return await cart.save();
  }

  async clearCart(userId) {
    return await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalAmount: 0 },
      { new: true }
    );
  }
}

module.exports = new CartRepository();
