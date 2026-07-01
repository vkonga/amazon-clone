const userRepository = require('../repositories/user.repository');
const { NotFoundError } = require('../shared');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Only allow updating name and email
    const allowedUpdates = {};
    if (updateData.name) allowedUpdates.name = updateData.name;
    if (updateData.email) allowedUpdates.email = updateData.email;

    const user = await userRepository.update(userId, allowedUpdates);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  // Address operations
  async addAddress(userId, addressData) {
    if (addressData.isDefault) {
      await userRepository.unsetDefaultAddresses(userId);
    }
    return await userRepository.createAddress({
      ...addressData,
      userId
    });
  }

  async getAddresses(userId) {
    return await userRepository.findAddressesByUserId(userId);
  }

  async updateAddress(userId, addressId, updateData) {
    if (updateData.isDefault) {
      await userRepository.unsetDefaultAddresses(userId);
    }
    const address = await userRepository.updateAddress(addressId, userId, updateData);
    if (!address) {
      throw new NotFoundError('Address');
    }
    return address;
  }

  async deleteAddress(userId, addressId) {
    const address = await userRepository.deleteAddress(addressId, userId);
    if (!address) {
      throw new NotFoundError('Address');
    }
    return { message: 'Address deleted successfully' };
  }
}

module.exports = new UserService();
