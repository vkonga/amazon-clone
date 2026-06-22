const cartService = require('../services/cart.service');
const { sendSuccess } = require('@amazon-clone/shared');

class CartController {
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user.id);
      sendSuccess(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const cart = await cartService.addItem(req.user.id, req.body);
      sendSuccess(res, cart, 'Item added to cart successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async updateItemQuantity(req, res, next) {
    try {
      const { quantity } = req.body;
      const { productId } = req.params;
      const cart = await cartService.updateItemQuantity(req.user.id, productId, quantity);
      sendSuccess(res, cart, 'Cart item quantity updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req, res, next) {
    try {
      const { productId } = req.params;
      const cart = await cartService.removeItem(req.user.id, productId);
      sendSuccess(res, cart, 'Item removed from cart successfully');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req, res, next) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      sendSuccess(res, cart, 'Cart cleared successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
