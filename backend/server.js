require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");

// Initialize app
const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", movieRoutes);
app.use("/api", theaterRoutes);
app.use("/api", showRoutes);
app.use("/api", bookingRoutes);
app.use("/api", giftCardRoutes); // Routes already have /gift-cards prefix inside
app.use("/api", ratingRoutes);
app.use("/api", suggestionRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
