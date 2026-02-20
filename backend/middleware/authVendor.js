const User = require("../models/User");

const authVendor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (user.role !== "vendor") {
            return res
                .status(403)
                .json({ message: "Access denied. Vendor resources only." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = authVendor;
