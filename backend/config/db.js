const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is not defined in environment variables",
            );
        }
        await mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log("✅ MongoDB Connected"))
            .catch((err) => console.log("Mongo Error:", err)); 
    } catch (error) {
        console.error(`❌ MongoDB error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
