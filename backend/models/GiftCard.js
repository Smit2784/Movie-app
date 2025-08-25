const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100,
    max: 10000
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    maxLength: 200
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired'],
    default: 'active'
  },
  redeemedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  redeemedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GiftCard', giftCardSchema);
