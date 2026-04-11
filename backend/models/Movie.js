const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  poster: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  language: { type: String, required: true },
  director: { type: String, required: true },
  cast: [{ type: String, required: true }],
  price: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
