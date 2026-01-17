const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");

// Public
router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);

// User Protected
router.put("/users/profile", authenticateToken, authController.updateProfile);
router.get("/user/wallet", authenticateToken, authController.getWalletBalance);

// Admin Protected
router.get("/admin/users", authenticateToken, authAdmin, authController.getAllUsers);
router.get("/admin/stats", authenticateToken, authAdmin, authController.getAdminStats);

module.exports = router;
