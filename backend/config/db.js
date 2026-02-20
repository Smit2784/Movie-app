const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB connected`);
    } catch (error) {
        console.error(`❌ MongoDB error: ${error.message}`);
        // In development, we might not want to exit the process if we want to debug other things,
        // but for a server it's generally better to exit if DB connection fails.
        process.exit(1);
    }
};

module.exports = connectDB;
