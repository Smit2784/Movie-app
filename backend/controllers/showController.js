const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Theater = require("../models/Theater");

// Get all shows (with filters)
exports.getShows = async (req, res) => {
    try {
        const { movieId, date } = req.query;
        let query = {};

        if (movieId) {
            query.movie = movieId;
        }

        if (date) {
            const searchDate = new Date(date + "T00:00:00.000Z");
            const endDate = new Date(date + "T23:59:59.999Z");

            query.date = {
                $gte: searchDate,
                $lte: endDate,
            };
        }

        const shows = await Show.find(query)
            .populate("movie")
            .populate("theater")
            .sort({ time: 1 });

        res.json(shows);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching shows",
            error: error.message,
        });
    }
};

// Get single show
exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate("movie")
            .populate("theater");

        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.json(show);
    } catch (error) {
        res.status(500).json({ message: "Error fetching show" });
    }
};

// ADMIN: Create Show
exports.createShow = async (req, res) => {
    try {
        const { movieId, theaterId, date, time, price } = req.body;

        if (!movieId || !theaterId || !date || !time) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const movie = await Movie.findById(movieId);
        const theater = await Theater.findById(theaterId);

        if (!movie) return res.status(404).json({ message: "Movie not found" });
        if (!theater) return res.status(404).json({ message: "Theater not found" });

        const availableSeats = theater.capacity;

        const show = new Show({
            movie: movieId,
            theater: theaterId,
            date: new Date(date),
            time,
            price: price || 250,
            totalSeats: theater.capacity,
            availableSeats: availableSeats,
            bookedSeats: []
        });

        await show.save();

        res.status(201).json({
            success: true,
            message: "Show scheduled successfully!",
            show
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to schedule show",
            error: error.message
        });
    }
};

// ADMIN: Delete Show
exports.deleteShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }
        res.json({ success: true, message: "Show deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting show" });
    }
};

// Debug: Check seats
exports.checkSeats = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.json({
            showId: show._id,
            bookedSeats: show.bookedSeats,
            bookedSeatsTypes: show.bookedSeats.map((seat) => typeof seat),
            availableSeats: show.availableSeats,
            totalSeats: show.totalSeats,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clean up seats
exports.cleanupSeats = async (req, res) => {
    try {
        const shows = await Show.find();
        let cleanedShows = 0;

        for (let show of shows) {
            const originalLength = show.bookedSeats.length;
            show.bookedSeats = [
                ...new Set(show.bookedSeats.map((seat) => String(seat))),
            ];
            if (originalLength !== show.bookedSeats.length) {
                await show.save();
                cleanedShows++;
            }
        }

        res.json({
            message: `Cleanup complete. Fixed ${cleanedShows} shows.`,
            totalShows: shows.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Cleanup failed" });
    }
};
