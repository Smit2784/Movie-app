const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// Public
router.get("/shows", showController.getShows);
router.get("/shows/:id", showController.getShowById);

// Debug Routes
router.get("/debug/show/:id/seats", showController.checkSeats);

// Admin
router.post("/admin/shows", authenticateToken, authAdmin, showController.createShow);
router.delete("/admin/shows/:id", authenticateToken, authAdmin, showController.deleteShow);
router.post("/cleanup-seats", authenticateToken, authAdmin, showController.cleanupSeats);

module.exports = router;
