const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// Public
router.get("/movies", movieController.getMovies);
router.get("/movies/:id", movieController.getMovieById);
router.get("/upcoming-movies", movieController.getUpcomingMovies);
router.get("/upcoming-movies/:id", movieController.getUpcomingMovieById);
router.get("/seed-upcoming-movies", movieController.seedUpcomingMovies);

// Admin
router.post("/admin/movies", authenticateToken, authAdmin, movieController.createMovie);
router.put("/admin/movies/:id", authenticateToken, authAdmin, movieController.updateMovie);
router.delete("/admin/movies/:id", authenticateToken, authAdmin, movieController.deleteMovie);

module.exports = router;
