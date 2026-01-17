const express = require("express");
const router = express.Router();
const giftCardController = require("../controllers/giftCardController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Protected Routes
router.post("/gift-cards/purchase", authenticateToken, giftCardController.purchaseGiftCard);
router.post("/gift-cards/redeem", authenticateToken, giftCardController.redeemGiftCard);
router.get("/gift-cards/history", authenticateToken, giftCardController.getGiftCardHistory);

// Public Routes
router.get("/gift-cards/check/:code", giftCardController.checkGiftCard);

module.exports = router;
