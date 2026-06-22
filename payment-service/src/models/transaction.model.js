const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'COD'],
    default: 'Credit Card'
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  transactionType: {
    type: String,
    enum: ['Payment', 'Refund'],
    default: 'Payment'
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  invoiceDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Auto-generate invoice number before save if completed
transactionSchema.pre('save', function(next) {
  if (this.status === 'Completed' && !this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.invoiceDate = new Date();
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
