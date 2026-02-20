const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  screens: { type: Number, default: 1 },
  facilities: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Theater', theaterSchema);
