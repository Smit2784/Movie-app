const User = require("../models/User");
const Movie = require("../models/Movie");
const Theater = require("../models/Theater");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
    "1f3245d266afccd2aa0a441f41f39f6e3a50a1d7332cdc96bda7720c65e93849";

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
                return res
                    .status(400)
                    .json({
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

exports.getAdminStats = async (req, res) => {
    try {
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
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({
            success: false,
            message: "Could not fetch data from Atlas",
        });
    }
};
