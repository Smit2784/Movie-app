const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Public: get average rating for a movie
router.get("/movies/:movieId/ratings", ratingController.getMovieRating);

// Authenticated: submit or update a rating
router.post(
    "/movies/:movieId/ratings",
    authenticateToken,
    ratingController.submitRating,
);

// Authenticated: get logged-in user's rating for a movie
router.get(
    "/movies/:movieId/ratings/me",
    authenticateToken,
    ratingController.getUserRating,
);

module.exports = router;
