const mongoose = require('mongoose');


const upcomingMovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  poster: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  language: { type: String, default: "English" },
  director: { type: String, required: true },
  cast: [{ type: String }],
  price: { type: Number, default: 0 },
  videoId: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('UpcomingMovie', upcomingMovieSchema);