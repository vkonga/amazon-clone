const orderService = require('../services/order.service');
const { sendSuccess, ApiResponse } = require('@amazon-clone/shared');

class OrderController {
  async createOrder(req, res, next) {
    try {
      // Extract authentication token to forward to other services
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const { shippingAddress, paymentMethod } = req.body;
      const order = await orderService.createOrder(req.user.id, shippingAddress, paymentMethod, token);
      sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.user.id, req.params.id);
      sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const orders = await orderService.getUserOrders(req.user.id);
      sendSuccess(res, orders, 'User orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      // Forward token to rollback stock if order is cancelled
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      const { status } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status, token);
      sendSuccess(res, order, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async listAllOrders(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { data, total } = await orderService.listAllOrders(page, limit);
      
      const paginated = ApiResponse.paginate(data, total, page, limit);
      sendSuccess(res, paginated.data, 'All orders retrieved successfully', 200, paginated.pagination);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
