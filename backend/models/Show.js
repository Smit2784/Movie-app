const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie', 
    required: true 
  },
  theater: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Theater', 
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  availableSeats: { type: Number, required: true },
  bookedSeats: [{ type: String }],
  price: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);
