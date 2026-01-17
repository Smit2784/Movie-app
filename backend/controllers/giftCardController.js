const GiftCard = require("../models/GiftCard");
const User = require("../models/User");

const generateGiftCardCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

exports.purchaseGiftCard = async (req, res) => {
    try {
        const { amount, recipientEmail, recipientName, senderName, message } = req.body;

        if (!amount || !recipientEmail || !recipientName || !senderName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (amount < 100 || amount > 10000) {
            return res.status(400).json({ success: false, message: "Gift card amount must be between ₹100 and ₹10,000" });
        }

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.walletBalance < amount) {
            return res.status(400).json({ success: false, message: `Insufficient wallet balance.` });
        }

        let code;
        let isUnique = false;
        while (!isUnique) {
            code = generateGiftCardCode();
            const existingCard = await GiftCard.findOne({ code });
            if (!existingCard) isUnique = true;
        }

        await User.findByIdAndUpdate(req.user.userId, { $inc: { walletBalance: -amount } });

        const giftCard = new GiftCard({
            code,
            amount,
            purchaser: req.user.userId,
            recipientEmail,
            recipientName,
            senderName,
            message: message || `Enjoy movies with MovieTix! From ${senderName}`,
        });

        await giftCard.save();

        res.json({
            success: true,
            giftCard: { code: giftCard.code, amount: giftCard.amount, recipientName: giftCard.recipientName },
            message: "Gift card purchased successfully!",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to purchase gift card", error: error.message });
    }
};

exports.redeemGiftCard = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ success: false, message: "Gift card code is required" });

        const giftCard = await GiftCard.findOne({ code: code.toUpperCase(), status: "active" });
        if (!giftCard) return res.status(404).json({ success: false, message: "Invalid or already redeemed gift card code" });

        giftCard.status = "redeemed";
        giftCard.redeemedBy = req.user.userId;
        giftCard.redeemedAt = new Date();
        await giftCard.save();

        await User.findByIdAndUpdate(req.user.userId, { $inc: { walletBalance: giftCard.amount } });

        res.json({
            success: true,
            amount: giftCard.amount,
            message: `₹${giftCard.amount} added to your wallet successfully!`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to redeem gift card" });
    }
};

exports.getGiftCardHistory = async (req, res) => {
    try {
        const giftCards = await GiftCard.find({
            $or: [{ purchaser: req.user.userId }, { redeemedBy: req.user.userId }],
        }).sort({ createdAt: -1 });
        res.json(giftCards);
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch gift card history" });
    }
};

exports.checkGiftCard = async (req, res) => {
    try {
        const { code } = req.params;
        const giftCard = await GiftCard.findOne({ code: code.toUpperCase() }).select("amount status recipientName");

        if (!giftCard) return res.status(404).json({ success: false, message: "Gift card not found" });

        res.json({
            success: true,
            amount: giftCard.amount,
            status: giftCard.status,
            recipientName: giftCard.recipientName,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to check gift card" });
    }
};
