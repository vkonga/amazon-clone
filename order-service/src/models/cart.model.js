const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String, // Referencing Product ID from Product Service
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: String, // String representation of User ID from User Service
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-save hook to calculate totalAmount
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  // Round to 2 decimal places
  this.totalAmount = Math.round(this.totalAmount * 100) / 100;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
