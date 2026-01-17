// backend/middleware/authAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authAdmin = async (req, res, next) => {
    try {
        // Assume req.user was set by your standard auth middleware
        const user = await User.findById(req.user.userId);

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin resources only." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = authAdmin;