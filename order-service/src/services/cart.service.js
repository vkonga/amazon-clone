const cartRepository = require('../repositories/cart.repository');
const { NotFoundError, ValidationError } = require('../shared');

class CartService {
  async getCart(userId) {
    return await cartRepository.findByUserId(userId);
  }

  async addItem(userId, itemData) {
    const cart = await cartRepository.findByUserId(userId);
    const existingIndex = cart.items.findIndex(
      (item) => item.productId === itemData.productId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += itemData.quantity || 1;
    } else {
      cart.items.push({
        productId: itemData.productId,
        name: itemData.name,
        price: itemData.price,
        image: itemData.image || '',
        quantity: itemData.quantity || 1
      });
    }

    return await cartRepository.update(cart);
  }

  async updateItemQuantity(userId, productId, quantity) {
    if (quantity < 1) {
      throw new ValidationError('Quantity must be at least 1');
    }

    const cart = await cartRepository.findByUserId(userId);
    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new NotFoundError('Cart item');
    }

    item.quantity = quantity;
    return await cartRepository.update(cart);
  }

  async removeItem(userId, productId) {
    const cart = await cartRepository.findByUserId(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    return await cartRepository.update(cart);
  }

  async clearCart(userId) {
    return await cartRepository.clearCart(userId);
  }
}

module.exports = new CartService();
