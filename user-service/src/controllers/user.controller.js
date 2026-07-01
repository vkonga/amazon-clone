const userService = require('../services/user.service');
const { sendSuccess } = require('../shared');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Address logic
  async addAddress(req, res, next) {
    try {
      const address = await userService.addAddress(req.user.id, req.body);
      sendSuccess(res, address, 'Address added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req, res, next) {
    try {
      const addresses = await userService.getAddresses(req.user.id);
      sendSuccess(res, addresses, 'Addresses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req, res, next) {
    try {
      const address = await userService.updateAddress(req.user.id, req.params.id, req.body);
      sendSuccess(res, address, 'Address updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req, res, next) {
    try {
      const result = await userService.deleteAddress(req.user.id, req.params.id);
      sendSuccess(res, result, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
