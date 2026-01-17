const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// User Booking Operations
router.post("/bookings", authenticateToken, bookingController.createBooking);
router.get("/bookings", authenticateToken, bookingController.getUserBookings);
router.delete("/bookings/:id", authenticateToken, bookingController.cancelBooking);

// Payment Routes
router.post("/bookings/wallet-payment", authenticateToken, bookingController.walletPayment);
router.post("/bookings/split-payment", authenticateToken, bookingController.splitPayment);

// Admin
router.get("/admin/bookings", authenticateToken, authAdmin, bookingController.getAllBookings);

module.exports = router;
