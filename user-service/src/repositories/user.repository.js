const User = require('../models/user.model');
const Address = require('../models/address.model');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findById(id).populate('addresses');
  }

  async findByEmail(email, selectPassword = false) {
    let query = User.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query.populate('addresses');
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate('addresses');
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });
  }

  // Address Repositories
  async createAddress(addressData) {
    const address = await Address.create(addressData);
    await User.findByIdAndUpdate(addressData.userId, {
      $push: { addresses: address._id }
    });
    return address;
  }

  async findAddressById(id) {
    return await Address.findById(id);
  }

  async findAddressesByUserId(userId) {
    return await Address.find({ userId });
  }

  async updateAddress(id, userId, updateData) {
    return await Address.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteAddress(id, userId) {
    const address = await Address.findOneAndDelete({ _id: id, userId });
    if (address) {
      await User.findByIdAndUpdate(userId, {
        $pull: { addresses: id }
      });
    }
    return address;
  }

  async unsetDefaultAddresses(userId) {
    return await Address.updateMany({ userId, isDefault: true }, { isDefault: false });
  }
}

module.exports = new UserRepository();
