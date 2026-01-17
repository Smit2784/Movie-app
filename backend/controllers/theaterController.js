const Theater = require("../models/Theater");

// Get all theaters
exports.getTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find().sort({ name: 1 });
        res.json({
            success: true,
            theater: theaters // Keeping key 'theater' to match frontend expectation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch theaters"
        });
    }
};

// ADMIN: Create Theater
exports.createTheater = async (req, res) => {
    try {
        const { name, location, capacity, screens, facilities } = req.body;

        const theater = new Theater({
            name,
            location,
            capacity,
            screens: screens || 1,
            facilities: facilities || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await theater.save();

        res.status(201).json({
            success: true,
            theater,
            message: "Theater created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create theater",
            error: error.message,
        });
    }
};

// ADMIN: Update Theater
exports.updateTheater = async (req, res) => {
    try {
        const updatedTheater = await Theater.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ success: true, theater: updatedTheater });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

// ADMIN: Delete Theater
exports.deleteTheater = async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Theater deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};
