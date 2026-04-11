const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

// Helper: recalculate and update Movie's average rating
const updateMovieRating = async (movieId) => {
    const result = await Rating.aggregate([
        { $match: { movie: movieId } },
        {
            $group: {
                _id: "$movie",
                avgRating: { $avg: "$score" },
                count: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await Movie.findByIdAndUpdate(movieId, {
            rating: Math.round(result[0].avgRating * 10) / 10, // 1 decimal
            ratingCount: result[0].count,
        });
    } else {
        await Movie.findByIdAndUpdate(movieId, {
            rating: 0,
            ratingCount: 0,
        });
    }
};

// POST /api/movies/:movieId/ratings — Submit or update a rating
exports.submitRating = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { score } = req.body;
        const userId = req.user.userId;

        if (!score || score < 1 || score > 10) {
            return res
                .status(400)
                .json({ message: "Score must be between 1 and 10" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Upsert: create or update user's rating
        await Rating.findOneAndUpdate(
            { user: userId, movie: movieId },
            { score },
            { upsert: true, new: true },
        );

        // Recalculate average
        await updateMovieRating(movie._id);

        const updatedMovie = await Movie.findById(movieId);

        res.json({
            success: true,
            message: "Rating submitted successfully",
            averageRating: updatedMovie.rating,
            ratingCount: updatedMovie.ratingCount,
        });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Error submitting rating" });
    }
};

// GET /api/movies/:movieId/ratings — Get average rating for a movie
exports.getMovieRating = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.json({
            averageRating: movie.rating,
            ratingCount: movie.ratingCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching rating" });
    }
};

// GET /api/movies/:movieId/ratings/me — Get logged-in user's rating
exports.getUserRating = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.userId;

        const rating = await Rating.findOne({ user: userId, movie: movieId });

        res.json({
            userRating: rating ? rating.score : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user rating" });
    }
};
