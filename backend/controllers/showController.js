const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Theater = require("../models/Theater");
const Booking = require("../models/Booking");

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

        let shows = await Show.find(query)
            .populate("movie")
            .populate("theater")
            .sort({ time: 1 });

        // Filter out past shows when querying today's date
        if (date) {
            const now = new Date();
            const todayStr = now.toISOString().split("T")[0];
            if (date === todayStr) {
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();
                shows = shows.filter((show) => {
                    const [showH, showM] = show.time.split(":").map(Number);
                    return showH > currentHours || (showH === currentHours && showM > currentMinutes);
                });
            }
        }

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

// ADMIN: Get shows for vendor
exports.getAdminShows = async (req, res) => {
    try {
        const userId = req.user.userId;

        const theaters = await Theater.find({ vendorId: userId });
        const theaterIds = theaters.map((t) => t._id);

        const shows = await Show.find({ theater: { $in: theaterIds } })
            .populate("movie")
            .populate("theater")
            .sort({ date: -1, time: 1 }); // Sorted by date then time

        res.json(shows);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching vendor shows",
            error: error.message,
        });
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
        if (!theater)
            return res.status(404).json({ message: "Theater not found" });

        if (theater.vendorId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Not authorized to add shows to this theater",
            });
        }

        // Reject shows scheduled in the past
        const showDate = new Date(date);
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const showDateStr = showDate.toISOString().split("T")[0];

        if (showDateStr < todayStr) {
            return res.status(400).json({
                success: false,
                message: "Cannot schedule a show for a past date.",
            });
        }

        if (showDateStr === todayStr && time) {
            const [showH, showM] = time.split(":").map(Number);
            const currentH = now.getHours();
            const currentM = now.getMinutes();
            if (showH < currentH || (showH === currentH && showM <= currentM)) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot schedule a show for a time that has already passed today.",
                });
            }
        }

        // Enforce minimum price: show price must be >= movie's base price 
        const showPrice = Number(price) || movie.price || 250;
        if (movie.price && showPrice < movie.price) {
            return res.status(400).json({
                success: false,
                message: `Show price (₹${showPrice}) cannot be less than the movie's base price (₹${movie.price})`,
                minimumPrice: movie.price,
            });
        }

        // Enforce screen limits: count existing shows at the identical date and time
        const overlappingShowsCount = await Show.countDocuments({
            theater: theaterId,
            date: new Date(date),
            time: time,
        });

        if (overlappingShowsCount >= theater.screens) {
            return res.status(400).json({
                success: false,
                message: `Theater limit reached: You can only schedule up to ${theater.screens} show(s) at ${time}. Your theater only has ${theater.screens} screen(s).`,
            });
        }

        const availableSeats = theater.capacity;

        const show = new Show({
            movie: movieId,
            theater: theaterId,
            date: new Date(date),
            time,
            price: showPrice,
            totalSeats: theater.capacity,
            availableSeats: availableSeats,
            bookedSeats: [],
        });

        await show.save();

        res.status(201).json({
            success: true,
            message: "Show scheduled successfully!",
            show,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to schedule show",
            error: error.message,
        });
    }
};

// ADMIN/VENDOR: Delete Show
exports.deleteShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate("theater");
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        if (show.theater.vendorId.toString() !== req.user.userId) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this show" });
        }

        await Show.findByIdAndDelete(req.params.id);
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

// VENDOR: Get bookings for vendor's theaters
exports.getVendorBookings = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get vendor's theaters
        const theaters = await Theater.find({ vendorId: userId });
        const theaterIds = theaters.map((t) => t._id);

        // Get shows in those theaters
        const shows = await Show.find({ theater: { $in: theaterIds } });
        const showIds = shows.map((s) => s._id);

        // Get all bookings for those shows
        const bookings = await Booking.find({ show: { $in: showIds } })
            .populate("user", "name email")
            .populate({
                path: "show",
                populate: [
                    { path: "movie", select: "title poster" },
                    { path: "theater", select: "name location" },
                ],
            })
            .sort({ bookingDate: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vendor bookings",
            error: error.message,
        });
    }
};
