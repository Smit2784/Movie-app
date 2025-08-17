const mongoose = require('mongoose');


const upcomingMovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  rating: { type: Number, required: true },
  poster: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  language: { type: String, required: true },
  director: { type: String, required: true },
  cast: [{ type: String, required: true }],
  price: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('UpcomingMovie', upcomingMovieSchema);