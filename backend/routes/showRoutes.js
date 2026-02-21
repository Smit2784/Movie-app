const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authVendor = require("../middleware/authVendor");

// Public
router.get("/shows", showController.getShows);
router.get("/shows/:id", showController.getShowById);

// Debug Routes
router.get("/debug/show/:id/seats", showController.checkSeats);

// Vendor
router.get(
    "/admin/shows",
    authenticateToken,
    authVendor,
    showController.getAdminShows,
);
router.post(
    "/admin/shows",
    authenticateToken,
    authVendor,
    showController.createShow,
);
router.delete(
    "/admin/shows/:id",
    authenticateToken,
    authVendor,
    showController.deleteShow,
);
router.post(
    "/cleanup-seats",
    authenticateToken,
    authVendor,
    showController.cleanupSeats,
);

module.exports = router;
