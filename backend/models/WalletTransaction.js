const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: [
                "add_money",
                "withdrawal",
                "booking_payment",
                "refund",
                "gift_card",
                "cashback",
            ],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        balanceAfter: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "pending", "failed"],
            default: "success",
        },
        reference: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// Index for faster queries
walletTransactionSchema.index({ user: 1, createdAt: -1 });
walletTransactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
