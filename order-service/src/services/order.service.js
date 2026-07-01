const axios = require('axios');
const orderRepository = require('../repositories/order.repository');
const cartService = require('./cart.service');
const { NotFoundError, ValidationError, logger } = require('../shared');

class OrderService {
  constructor() {
    this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002/api';
    this.paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004/api';
  }

  async createOrder(userId, shippingAddress, paymentMethod, token) {
    const cart = await cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Cannot create an order with an empty cart');
    }

    const items = [];
    let subtotal = 0;

    // 1. Verify products & stock from Product Service
    for (const item of cart.items) {
      try {
        const response = await axios.get(`${this.productServiceUrl}/products/${item.productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const product = response.data.data;
        if (!product) {
          throw new NotFoundError(`Product ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new ValidationError(`Insufficient stock for product ${product.name}. Available: ${product.stock}`);
        }

        items.push({
          productId: item.productId,
          name: product.name,
          price: product.price,
          image: product.images[0] || '',
          quantity: item.quantity
        });

        subtotal += product.price * item.quantity;
      } catch (err) {
        logger.error(`Failed to verify product stock: ${err.message}`);
        throw err.response?.data?.error ? new ValidationError(err.response.data.error.message) : err;
      }
    }

    // 2. Calculations
    const shippingPrice = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = parseFloat((subtotal * 0.08).toFixed(2)); // 8% tax
    const totalAmount = parseFloat((subtotal + shippingPrice + taxPrice).toFixed(2));

    // 3. Create order in Pending state
    const order = await orderRepository.create({
      userId,
      items,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      taxPrice,
      totalAmount,
      paymentStatus: 'Pending',
      orderStatus: 'Pending'
    });

    // 4. Decrement inventory stock in Product Service
    for (const item of items) {
      try {
        await axios.put(`${this.productServiceUrl}/products/${item.productId}/stock`, 
          { stock: -item.quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        logger.error(`Failed to decrement stock for product ${item.productId}: ${err.message}`);
        // Attempt rollback of completed decrements in production, but here we throw to trigger order failure.
        throw new ValidationError('Inventory lock failed');
      }
    }

    // 5. Call Payment Service to process payment
    let paymentSuccess = false;
    let paymentId = null;

    try {
      const paymentResponse = await axios.post(`${this.paymentServiceUrl}/payments`, {
        orderId: order._id.toString(),
        amount: totalAmount,
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const paymentResult = paymentResponse.data.data;
      if (paymentResult.status === 'Completed') {
        paymentSuccess = true;
        paymentId = paymentResult.id;
      }
    } catch (err) {
      logger.error(`Payment service communication failed: ${err.message}`);
    }

    if (paymentSuccess) {
      // 6. Update order to Confirmed & Paid
      const updatedOrder = await orderRepository.update(order._id, {
        paymentStatus: 'Paid',
        orderStatus: 'Confirmed',
        paymentId
      });

      // Clear the user's shopping cart
      await cartService.clearCart(userId);
      return updatedOrder;
    } else {
      // 7. Payment failed: rollback stock & cancel order
      for (const item of items) {
        try {
          await axios.put(`${this.productServiceUrl}/products/${item.productId}/stock`, 
            { stock: item.quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (rollbackErr) {
          logger.error(`Critical: Failed to rollback stock for product ${item.productId}: ${rollbackErr.message}`);
        }
      }

      const updatedOrder = await orderRepository.update(order._id, {
        paymentStatus: 'Failed',
        orderStatus: 'Cancelled'
      });

      throw new ValidationError('Payment processing failed. Your order has been cancelled and stock restored.');
    }
  }

  async getOrderById(userId, orderId) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order');
    }
    // Check ownership
    if (order.userId !== userId) {
      throw new ValidationError('You do not own this order');
    }
    return order;
  }

  async getUserOrders(userId) {
    return await orderRepository.findByUserId(userId);
  }

  async updateOrderStatus(orderId, status, token) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order');
    }

    // Rollback stock if order is cancelled
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        try {
          await axios.put(`${this.productServiceUrl}/products/${item.productId}/stock`, 
            { stock: item.quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          logger.error(`Failed to restore stock on order cancel: ${err.message}`);
        }
      }
    }

    return await orderRepository.update(orderId, { orderStatus: status });
  }

  async listAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await orderRepository.findAll({}, skip, limit);
  }
}

module.exports = new OrderService();
