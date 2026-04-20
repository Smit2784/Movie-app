const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorName: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['feature', 'bug', 'movie', 'improvement', 'other'],
    default: 'other'
  },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'resolved', 'rejected'],
    default: 'pending'
  },
  adminReply: { type: String, default: '' },
  repliedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
