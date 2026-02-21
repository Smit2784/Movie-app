const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authAdmin = require("../middleware/authAdmin");
const authAdminOrVendor = require("../middleware/authAdminOrVendor");

// Public
router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.loginUser);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

// User Protected
router.put("/users/profile", authenticateToken, authController.updateProfile);
router.get("/user/wallet", authenticateToken, authController.getWalletBalance);

// Admin Protected
router.get(
    "/admin/users",
    authenticateToken,
    authAdmin,
    authController.getAllUsers,
);
router.put(
    "/admin/users/:id/role",
    authenticateToken,
    authAdmin,
    authController.updateUserRole,
);
router.get(
    "/admin/stats",
    authenticateToken,
    authAdminOrVendor,
    authController.getAdminStats,
);

module.exports = router;
