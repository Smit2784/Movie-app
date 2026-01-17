const Booking = require("../models/Booking");
const Show = require("../models/Show");
const User = require("../models/User");

// Create Booking
exports.createBooking = async (req, res) => {
    let seatReservationMade = false;
    let reservedShowId = null;
    let reservedSeats = [];

    try {
        const { showId, seats, totalAmount } = req.body;
        const requestedSeatsStr = seats.map((seat) => String(seat));

        const updatedShow = await Show.findOneAndUpdate(
            {
                _id: showId,
                bookedSeats: { $nin: requestedSeatsStr },
                availableSeats: { $gte: seats.length },
            },
            {
                $push: { bookedSeats: { $each: requestedSeatsStr } },
                $inc: { availableSeats: -seats.length },
            },
            { new: true, runValidators: true }
        );

        if (!updatedShow) {
            return res.status(400).json({
                success: false,
                message: "Selected seats are no longer available. Please refresh and choose different seats.",
            });
        }

        seatReservationMade = true;
        reservedShowId = showId;
        reservedSeats = requestedSeatsStr;

        const bookingData = {
            user: req.user.userId,
            show: showId,
            seats: requestedSeatsStr,
            totalAmount,
            status: "confirmed",
        };

        const booking = new Booking(bookingData);
        const savedBooking = await booking.save();

        const populatedBooking = await Booking.findById(savedBooking._id).populate({
            path: "show",
            populate: [{ path: "movie" }, { path: "theater" }],
        });

        res.status(201).json({
            success: true,
            booking: populatedBooking,
            message: "Booking confirmed successfully",
        });
    } catch (error) {
        if (seatReservationMade && reservedShowId && reservedSeats.length > 0) {
            try {
                await Show.findByIdAndUpdate(reservedShowId, {
                    $pull: { bookedSeats: { $in: reservedSeats } },
                    $inc: { availableSeats: reservedSeats.length },
                });
            } catch (rollbackError) { }
        }

        res.status(500).json({
            success: false,
            message: "Booking failed. Please try again.",
            error: error.message,
        });
    }
};

// Wallet Payment
exports.walletPayment = async (req, res) => {
    try {
        const { showId, seats, totalAmount } = req.body;

        if (!showId || !seats || !totalAmount) {
            return res.status(400).json({ success: false, message: "Missing required booking information" });
        }

        const requestedSeatsStr = seats.map((seat) => String(seat));

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user.userId,
                walletBalance: { $gte: totalAmount },
            },
            { $inc: { walletBalance: -totalAmount } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
        }

        const updatedShow = await Show.findOneAndUpdate(
            {
                _id: showId,
                bookedSeats: { $nin: requestedSeatsStr },
                availableSeats: { $gte: seats.length },
            },
            {
                $push: { bookedSeats: { $each: requestedSeatsStr } },
                $inc: { availableSeats: -seats.length },
            },
            { new: true }
        );

        if (!updatedShow) {
            await User.findByIdAndUpdate(req.user.userId, {
                $inc: { walletBalance: totalAmount },
            });
            return res.status(400).json({ success: false, message: "Selected seats are no longer available." });
        }

        const booking = new Booking({
            user: req.user.userId,
            show: showId,
            seats: requestedSeatsStr,
            totalAmount,
            status: "confirmed",
            paymentMethod: "wallet",
        });

        const savedBooking = await booking.save();
        const populatedBooking = await Booking.findById(savedBooking._id).populate({
            path: "show",
            populate: [{ path: "movie" }, { path: "theater" }],
        });

        res.status(201).json({
            success: true,
            booking: populatedBooking,
            newWalletBalance: updatedUser.walletBalance,
            message: "Payment successful using MovieTix Wallet",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Wallet payment failed.",
            error: error.message,
        });
    }
};

// Split Payment
exports.splitPayment = async (req, res) => {
    try {
        const { showId, seats, totalAmount, walletAmount, externalPayment, paymentMethod } = req.body;
        const requestedSeatsStr = seats.map((seat) => String(seat));

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: req.user.userId,
                walletBalance: { $gte: walletAmount },
            },
            { $inc: { walletBalance: -walletAmount } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "Insufficient wallet balance for split payment" });
        }

        const updatedShow = await Show.findOneAndUpdate(
            {
                _id: showId,
                bookedSeats: { $nin: requestedSeatsStr },
                availableSeats: { $gte: seats.length },
            },
            {
                $push: { bookedSeats: { $each: requestedSeatsStr } },
                $inc: { availableSeats: -seats.length },
            },
            { new: true }
        );

        if (!updatedShow) {
            await User.findByIdAndUpdate(req.user.userId, { $inc: { walletBalance: walletAmount } });
            return res.status(400).json({ success: false, message: "Selected seats are no longer available." });
        }

        const booking = new Booking({
            user: req.user.userId,
            show: showId,
            seats: requestedSeatsStr,
            totalAmount,
            status: "confirmed",
            paymentMethod: `Wallet (₹${walletAmount}) + ${paymentMethod} (₹${externalPayment})`,
        });

        const savedBooking = await booking.save();
        const populatedBooking = await Booking.findById(savedBooking._id).populate({
            path: "show",
            populate: [{ path: "movie" }, { path: "theater" }],
        });

        res.status(201).json({
            success: true,
            booking: populatedBooking,
            newWalletBalance: updatedUser.walletBalance,
            walletUsed: walletAmount,
            externalPayment: externalPayment,
            message: "Split payment successful",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Split payment failed.", error: error.message });
    }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.userId })
            .populate({
                path: "show",
                populate: [{ path: "movie" }, { path: "theater" }],
            })
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("show");

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only cancel your own bookings" });
        }
        if (booking.status === "cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled" });
        }

        const now = new Date();
        const showDateTime = new Date(booking.show.date);
        const [hours, minutes] = booking.show.time.split(":");
        showDateTime.setHours(parseInt(hours), parseInt(minutes));

        if (showDateTime <= now) {
            return res.status(400).json({ message: "Cannot cancel booking for a show that has already started" });
        }

        const show = await Show.findById(booking.show._id);
        if (show) {
            show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
            show.availableSeats += booking.seats.length;
            await show.save();
        }

        booking.status = "cancelled";
        await booking.save();

        setTimeout(async () => {
            try {
                await User.findByIdAndUpdate(req.user.userId, { $inc: { walletBalance: booking.totalAmount } });
            } catch (error) {
                console.error("Error processing wallet refund:", error);
            }
        }, Math.floor(Math.random() * 3000) + 5000);

        res.json({
            message: "Booking cancelled successfully. Refund will be credited to your wallet in 5-7 seconds.",
            booking: booking,
            refundAmount: booking.totalAmount,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel booking", error: error.message });
    }
};

// ADMIN: Get All Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate({
                path: "show",
                populate: [{ path: "movie", select: "title poster" }, { path: "theater", select: "name location" }],
            })
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all bookings", error: error.message });
    }
};
