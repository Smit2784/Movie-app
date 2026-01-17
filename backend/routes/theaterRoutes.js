const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theaterController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// Public
router.get("/theaters", theaterController.getTheaters);

// Admin
router.post("/theaters", authenticateToken, authAdmin, theaterController.createTheater); // Note: Original was /api/theaters (POST) but wrapped in authAdmin? Yes in line 186. Wait, line 186 in old server.js had authAdmin? Line 186 in old file: `app.post("/api/theaters", authenticateToken, async ...)` - WAIT. The USER removed authAdmin in Step 145! 
// Checking Step 145 diff: `-app.post("/api/admin/theaters", authenticateToken, authAdmin, async (req, res) => {` changed to `+app.post("/api/theaters", authenticateToken, async (req, res) => {`.
// So it seems the user wanted to relax it or just changed the route.
// However, in Step 168 (current state request), the user wants to distribute content.
// I should stick to what's in the latest server.js view (Step 173).
// In Step 173 line 186: `app.post("/api/theaters", authenticateToken, async (req, res) => {`.
// It does NOT have authAdmin.
// But wait, logically creating theaters should be admin?
// I will respect the current code state.

router.post("/theaters", authenticateToken, theaterController.createTheater);
router.put("/admin/theaters/:id", authenticateToken, authAdmin, theaterController.updateTheater);
router.delete("/admin/theaters/:id", authenticateToken, authAdmin, theaterController.deleteTheater);

module.exports = router;
