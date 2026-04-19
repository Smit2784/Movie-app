const User = require("../models/User");
const Movie = require("../models/Movie");
const Theater = require("../models/Theater");
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({ name, email, password, phone });
        await user.save();

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;
        const updateData = { name };

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long",
                });
            }

            const { oldPassword } = req.body;
            if (!oldPassword) {
                return res
                    .status(400)
                    .json({ message: "Please provide your current password" });
            }

            const user = await User.findById(req.user.userId);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ message: "Invalid current password" });
            }

            user.name = name;
            user.password = password; // pre-save hook should hash this
            await user.save();

            return res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                message: "Profile updated successfully",
            });
        }

        // If only name is being updated
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, select: "-password" },
        );

        res.json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
            message: "Profile updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Update failed",
            error: error.message,
        });
    }
};

exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "walletBalance",
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ walletBalance: user.walletBalance });
    } catch (error) {
        res.status(500).json({ message: "Error fetching wallet balance" });
    }
};

// Add Money to Wallet
const WalletTransaction = require("../models/WalletTransaction");

exports.addMoney = async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        const numAmount = Number(amount);

        // Validation
        if (!numAmount || numAmount < 100) {
            return res.status(400).json({
                success: false,
                message: "Minimum amount to add is ₹100",
            });
        }
        if (numAmount > 10000) {
            return res.status(400).json({
                success: false,
                message: "Maximum amount per transaction is ₹10,000",
            });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check wallet cap
        if (user.walletBalance + numAmount > 50000) {
            return res.status(400).json({
                success: false,
                message: `Wallet balance cannot exceed ₹50,000. You can add up to ₹${50000 - user.walletBalance}`,
            });
        }

        // Update balance
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { $inc: { walletBalance: numAmount } },
            { new: true },
        );

        // Create transaction record
        await WalletTransaction.create({
            user: req.user.userId,
            type: "credit",
            amount: numAmount,
            category: "add_money",
            description: `Added ₹${numAmount} via ${paymentMethod || "card"}`,
            balanceAfter: updatedUser.walletBalance,
            status: "success",
            reference: `ADD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        });

        res.json({
            success: true,
            walletBalance: updatedUser.walletBalance,
            message: `₹${numAmount} added to wallet successfully`,
        });
    } catch (error) {
        console.error("Add money error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add money to wallet",
        });
    }
};

// Withdraw Money from Wallet
exports.withdrawMoney = async (req, res) => {
    try {
        const { amount, upiId } = req.body;
        const numAmount = Number(amount);

        // Validation
        if (!numAmount || numAmount < 200) {
            return res.status(400).json({
                success: false,
                message: "Minimum withdrawal amount is ₹200",
            });
        }

        if (!upiId || !upiId.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid UPI ID",
            });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.walletBalance < numAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }

        // Update balance
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { $inc: { walletBalance: -numAmount } },
            { new: true },
        );

        // Create transaction record
        await WalletTransaction.create({
            user: req.user.userId,
            type: "debit",
            amount: numAmount,
            category: "withdrawal",
            description: `Withdrawn ₹${numAmount} to UPI ${upiId}`,
            balanceAfter: updatedUser.walletBalance,
            status: "success",
            reference: `WDR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        });

        res.json({
            success: true,
            walletBalance: updatedUser.walletBalance,
            message: `₹${numAmount} withdrawn successfully. It will be credited to your UPI within 24 hours.`,
        });
    } catch (error) {
        console.error("Withdraw money error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to withdraw money",
        });
    }
};

// Get Wallet Transaction History
exports.getTransactionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 15, category } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = { user: req.user.userId };
        if (category && category !== "all") {
            filter.category = category;
        }

        const [transactions, total] = await Promise.all([
            WalletTransaction.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            WalletTransaction.countDocuments(filter),
        ]);

        res.json({
            success: true,
            transactions,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                total,
            },
        });
    } catch (error) {
        console.error("Transaction history error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch transaction history",
        });
    }
};

// Get Wallet Summary
exports.getWalletSummary = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "walletBalance",
        );
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const [addedResult, spentResult, withdrawnResult, refundResult] =
            await Promise.all([
                WalletTransaction.aggregate([
                    {
                        $match: {
                            user: user._id,
                            category: "add_money",
                            status: "success",
                        },
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]),
                WalletTransaction.aggregate([
                    {
                        $match: {
                            user: user._id,
                            category: "booking_payment",
                            status: "success",
                        },
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]),
                WalletTransaction.aggregate([
                    {
                        $match: {
                            user: user._id,
                            category: "withdrawal",
                            status: "success",
                        },
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]),
                WalletTransaction.aggregate([
                    {
                        $match: {
                            user: user._id,
                            category: "refund",
                            status: "success",
                        },
                    },
                    { $group: { _id: null, total: { $sum: "$amount" } } },
                ]),
            ]);

        res.json({
            success: true,
            summary: {
                balance: user.walletBalance,
                totalAdded: addedResult[0]?.total || 0,
                totalSpent: spentResult[0]?.total || 0,
                totalWithdrawn: withdrawnResult[0]?.total || 0,
                totalRefunded: refundResult[0]?.total || 0,
            },
        });
    } catch (error) {
        console.error("Wallet summary error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallet summary",
        });
    }
};

const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 10 minutes expiration
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = otpExpires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"MovieTix Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request - MovieTix",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                    <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">MovieTix</h1>
                    </div>
                    <div style="padding: 30px; background-color: #ffffff;">
                        <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                            Hello ${user.name},
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                            We received a request to reset your password for your MovieTix account. Please use the following One-Time Password (OTP) to proceed:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; padding: 15px 30px; background-color: #f3f4f6; color: #4f46e5; font-size: 32px; font-weight: bold; border-radius: 8px; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                            This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                        </p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">
                            If you did not request a password reset, you can safely ignore this email.
                        </p>
                        <br>
                        <p style="color: #777777; font-size: 14px; margin-bottom: 0;">
                            Best regards,<br>
                            The MovieTix Team
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Error sending OTP email" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res
                .status(400)
                .json({ message: "Please provide all details" });
        }

        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.password = newPassword; // this will trigger pre-save hook
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
};

// ADMIN
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
        });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin", "vendor"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true },
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            user,
            message: "User role updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user role",
        });
    }
};

exports.getAdminStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (user.role === "vendor") {
            const userId = req.user.userId;

            // Vendor Stats
            const theaters = await Theater.find({ vendorId: userId });
            const theaterIds = theaters.map((t) => t._id);

            const shows = await Show.find({ theater: { $in: theaterIds } });
            const showIds = shows.map((s) => s._id);

            const theaterCount = theaters.length;
            const showCount = shows.length;

            const bookings = await Booking.find({
                show: { $in: showIds.length > 0 ? showIds : [] },
            });
            const bookingCount = bookings.length;

            return res.status(200).json({
                success: true,
                stats: {
                    theaters: theaterCount,
                    shows: showCount,
                    bookings: bookingCount,
                },
            });
        } else {
            // Admin Stats
            const [movieCount, theaterCount, userCount, bookingCount] =
                await Promise.all([
                    Movie.countDocuments(),
                    Theater.countDocuments(),
                    User.countDocuments(),
                    Booking.countDocuments(),
                ]);

            res.status(200).json({
                success: true,
                stats: {
                    movies: movieCount,
                    theaters: theaterCount,
                    users: userCount,
                    bookings: bookingCount,
                },
            });
        }
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({
            success: false,
            message: "Could not fetch data from Atlas",
        });
    }
};
