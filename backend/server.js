const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Initialize app
const app = express();

// Essential Middleware - MUST BE FIRST
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ticketbooking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Import Models
const Movie = require("./models/Movie");
const Theater = require("./models/Theater");
const Show = require("./models/Show");
const User = require("./models/User");
const Booking = require("./models/Booking");
const UpcomingMovie = require("./models/UpcomingMovie"); 
const GiftCard = require("./models/GiftCard"); 

// JWT Secret
const JWT_SECRET = "1f3245d266afccd2aa0a441f41f39f6e3a50a1d7332cdc96bda7720c65e93849";

// Add this helper function after JWT_SECRET
const generateGiftCardCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES
app.post("/api/auth/register", async (req, res) => {
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
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) { 
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
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
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) { 
    res.status(500).json({ message: "Login failed" });
  }
});

//theaters

// Add Theater API Endpoint
app.post("/api/theaters", authenticateToken, async (req, res) => {
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
});

// MOVIE ROUTES
app.get("/api/movies", async (req, res) => {
  try {
    const { categories, search } = req.query;
    
    let query = {};
    
    // Handle multiple category filtering with current string format
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
      
      if (categoryArray.length > 0) {
        // Build regex query for each category
        const categoryConditions = categoryArray.map(category => ({
          genre: { $regex: category.trim(), $options: 'i' }
        }));
        
        // Use $and to ensure ALL selected categories are present
        query.$and = categoryConditions;
      }
    }
    
    // Add search filter
    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
      
      if (query.$and) {
        query.$and.push(searchCondition);
      } else {
        query = searchCondition;
      }
    }
     
    
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching movies" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching movie" });
  }
});

// SHOW ROUTES
// REPLACE YOUR /api/shows ROUTE WITH THIS CORRECTED VERSION
app.get("/api/shows", async (req, res) => {
  try {
    const { movieId, date } = req.query; 

    let query = {};

    if (movieId) {
      query.movie = movieId;
    }

    if (date) {
      // CORRECTED: Simple date range without timezone confusion
      const searchDate = new Date(date + "T00:00:00.000Z"); // Treat input as UTC
      const endDate = new Date(date + "T23:59:59.999Z");
 
      query.date = {
        $gte: searchDate,
        $lte: endDate,
      };
    }
 

    const shows = await Show.find(query)
      .populate("movie")
      .populate("theater")
      .sort({ time: 1 }); 

    res.json(shows);
  } catch (error) { 
    res.status(500).json({
      message: "Error fetching shows",
      error: error.message,
    });
  }
});

app.get("/api/shows/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate("theater");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching show" });
  }
});

//BOOKING ROUTES
app.post("/api/bookings", authenticateToken, async (req, res) => {
  let seatReservationMade = false;
  let reservedShowId = null;
  let reservedSeats = [];

  try {
    const { showId, seats, totalAmount } = req.body;
 

    // Convert seats to strings for consistency
    const requestedSeatsStr = seats.map((seat) => String(seat));

    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: requestedSeatsStr }, // None of the seats should be booked
        availableSeats: { $gte: seats.length }, // Must have enough available seats
      },
      {
        $push: { bookedSeats: { $each: requestedSeatsStr } },
        $inc: { availableSeats: -seats.length },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if seat reservation was successful
    if (!updatedShow) {
      // Check why it failed by examining the current show state
      const currentShow = await Show.findById(showId);
      if (currentShow) { 

        const conflictingSeats = requestedSeatsStr.filter((seat) =>
          currentShow.bookedSeats.includes(seat)
        );

        if (conflictingSeats.length > 0) {
        }
      }

      return res.status(400).json({
        success: false,
        message:
          "Selected seats are no longer available. Please refresh and choose different seats.",
      });
    }

    // Mark that we successfully reserved seats (for rollback if needed)
    seatReservationMade = true;
    reservedShowId = showId;
    reservedSeats = requestedSeatsStr;

    const bookingData = {
      user: req.user.userId,
      show: showId,
      seats: requestedSeatsStr,
      totalAmount,
      status: "confirmed",
    };

    const booking = new Booking(bookingData);
    const savedBooking = await booking.save();

    const populatedBooking = await Booking.findById(savedBooking._id).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    if (!populatedBooking) {
      throw new Error("Failed to retrieve created booking");
    }

    // Success response
    res.status(201).json({
      success: true,
      booking: populatedBooking,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    if (seatReservationMade && reservedShowId && reservedSeats.length > 0) {
      try {
        await Show.findByIdAndUpdate(reservedShowId, {
          $pull: { bookedSeats: { $in: reservedSeats } },
          $inc: { availableSeats: reservedSeats.length },
        });
 
      } catch (rollbackError) {}
    }

    // Return error response
    res.status(500).json({
      success: false,
      message: "Booking failed. Please try again.",
      error: error.message,
    });
  }
});

// 1. GET upcoming movies
app.get("/api/upcoming-movies", async (req, res) => {
  try {
    const { categories, search } = req.query;
    
    let query = {};
    
    // Handle category filtering
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
      
      if (categoryArray.length > 0) {
        const categoryConditions = categoryArray.map(category => ({
          genre: { $regex: category.trim(), $options: 'i' }
        }));
        query.$and = categoryConditions;
      }
    }
    
    // Add search filter
    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { director: { $regex: search, $options: 'i' } }
        ]
      };
      
      if (query.$and) {
        query.$and.push(searchCondition);
      } else {
        query = searchCondition;
      }
    }
     
    
    // Fetch from upcomingmovies collection, sorted by release date
    const upcomingMovies = await UpcomingMovie.find(query).sort({ releaseDate: 1 });
     
    
    res.json(upcomingMovies);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching upcoming movies" });
  }
});

// 2. Seed upcoming movies
app.get("/api/seed-upcoming-movies", async (req, res) => {
  try { 
    
    // Check if upcoming movies already exist
    const existingUpcoming = await UpcomingMovie.countDocuments(); 
    
    if (existingUpcoming > 0) {
      return res.json({
        success: true,
        message: `${existingUpcoming} upcoming movies already exist in database`,
        moviesCount: existingUpcoming,
        skipReason: "already_exists"
      });
    }

 

    // Insert into upcomingmovies collection
    const insertedMovies = await UpcomingMovie.insertMany(upcomingMoviesData, {
      ordered: false
    });
     

    res.json({
      success: true,
      message: `Successfully added ${insertedMovies.length} upcoming movies to database`,
      moviesCount: insertedMovies.length,
      insertedIds: insertedMovies.map(m => m._id),
      totalUpcomingMovies: await UpcomingMovie.countDocuments()
    });

  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to seed upcoming movies",
      error: error.message,
      errorName: error.name
    });
  }
});

// 3. Get single upcoming movie by ID
app.get("/api/upcoming-movies/:id", async (req, res) => {
  try {
    const movie = await UpcomingMovie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Upcoming movie not found" });
    }
    res.json(movie);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching upcoming movie" });
  }
});



app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id; 

    // Find the booking first
    const booking = await Booking.findById(bookingId).populate("show");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Check if the show has already started
    const now = new Date();
    const showDateTime = new Date(booking.show.date);
    const [hours, minutes] = booking.show.time.split(":");
    showDateTime.setHours(parseInt(hours), parseInt(minutes));

    if (showDateTime <= now) {
      return res.status(400).json({
        message: "Cannot cancel booking for a show that has already started",
      });
    }

    // Update the show to release the seats
    const show = await Show.findById(booking.show._id);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      show.availableSeats += booking.seats.length;
      await show.save();
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    await booking.save();
 

    // ✨ NEW: Process wallet refund with delay
    setTimeout(async () => {
      try {
        // Credit refund amount to user's wallet
        await User.findByIdAndUpdate(req.user.userId, {
          $inc: { walletBalance: booking.totalAmount },
        });
 
      } catch (error) {
        console.error("Error processing wallet refund:", error);
      }
    }, Math.floor(Math.random() * 3000) + 5000); // Random delay between 5-7 seconds

    res.json({
      message:
        "Booking cancelled successfully. Refund will be credited to your wallet in 5-7 seconds.",
      booking: booking,
      refundAmount: booking.totalAmount,
    });
  } catch (error) { 
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
});

app.get("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) { 
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


// Error handling middleware
app.use((error, req, res, next) => { 
  res.status(500).json({ message: "Internal server error" });
});

// Purchase Gift Card
app.post("/api/gift-cards/purchase", authenticateToken, async (req, res) => {
  try { 
    
    const { amount, recipientEmail, recipientName, senderName, message } = req.body;

    // Validate input
    if (!amount || !recipientEmail || !recipientName || !senderName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (amount < 100 || amount > 10000) {
      return res.status(400).json({
        success: false,
        message: "Gift card amount must be between ₹100 and ₹10,000"
      });
    }

    // Check user wallet balance
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Available: ₹${user.walletBalance}, Required: ₹${amount}`
      });
    }

    // Generate unique code
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateGiftCardCode();
      const existingCard = await GiftCard.findOne({ code });
      if (!existingCard) {
        isUnique = true;
      }
    }

    // Deduct amount from user wallet
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { walletBalance: -amount }
    });

    // Create gift card
    const giftCard = new GiftCard({
      code,
      amount,
      purchaser: req.user.userId,
      recipientEmail,
      recipientName,
      senderName,
      message: message || `Enjoy movies with MovieTix! From ${senderName}`
    });

    await giftCard.save();
     

    res.json({
      success: true,
      giftCard: {
        code: giftCard.code,
        amount: giftCard.amount,
        recipientName: giftCard.recipientName
      },
      message: "Gift card purchased successfully!"
    });

  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to purchase gift card",
      error: error.message
    });
  }
});

// Redeem Gift Card
app.post("/api/gift-cards/redeem", authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Gift card code is required"
      });
    }

    // Find gift card
    const giftCard = await GiftCard.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });

    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: "Invalid or already redeemed gift card code"
      });
    }

    // Update gift card status
    giftCard.status = 'redeemed';
    giftCard.redeemedBy = req.user.userId;
    giftCard.redeemedAt = new Date();
    await giftCard.save();

    // Add amount to user wallet
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { walletBalance: giftCard.amount }
    });

    res.json({
      success: true,
      amount: giftCard.amount,
      message: `₹${giftCard.amount} added to your wallet successfully!`
    });

  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to redeem gift card"
    });
  }
});

// Get Gift Card History
app.get("/api/gift-cards/history", authenticateToken, async (req, res) => {
  try {
    const giftCards = await GiftCard.find({
      $or: [
        { purchaser: req.user.userId },
        { redeemedBy: req.user.userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(giftCards);
  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to fetch gift card history"
    });
  }
});

// Check Gift Card Status (optional - for public checking)
app.get("/api/gift-cards/check/:code", async (req, res) => {
  try {
    const { code } = req.params;
    
    const giftCard = await GiftCard.findOne({ 
      code: code.toUpperCase() 
    }).select('amount status recipientName');

    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: "Gift card not found"
      });
    }

    res.json({
      success: true,
      amount: giftCard.amount,
      status: giftCard.status,
      recipientName: giftCard.recipientName
    });
  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to check gift card"
    });
  }
});

app.post("/api/gift-cards/redeem", authenticateToken, async (req, res) => {
  try { 
    
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Gift card code is required"
      });
    }

    // Find gift card
    const giftCard = await GiftCard.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });

    if (!giftCard) {
      return res.status(404).json({
        success: false,
        message: "Invalid or already redeemed gift card code"
      });
    }

    // Update gift card status
    giftCard.status = 'redeemed';
    giftCard.redeemedBy = req.user.userId;
    giftCard.redeemedAt = new Date();
    await giftCard.save();

    // Add amount to user wallet
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { walletBalance: giftCard.amount }
    });
 

    res.json({
      success: true,
      amount: giftCard.amount,
      message: `₹${giftCard.amount} added to your wallet successfully!`
    });

  } catch (error) { 
    res.status(500).json({
      success: false,
      message: "Failed to redeem gift card",
      error: error.message
    });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Add this new route to get user's wallet balance
app.get("/api/user/wallet", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("walletBalance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ walletBalance: user.walletBalance });
  } catch (error) { 
    res.status(500).json({ message: "Error fetching wallet balance" });
  }
});

// Add wallet payment route to server.js
app.post(
  "/api/bookings/wallet-payment",
  authenticateToken,
  async (req, res) => {
    try {
      const { showId, seats, totalAmount } = req.body;
 
      // CRITICAL: Validate all required fields
      if (!showId || !seats || !totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Missing required booking information",
        });
      }

      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
        });
      }

      const requestedSeatsStr = seats.map((seat) => String(seat));

      const updatedUser = await User.findOneAndUpdate(
        {
          _id: req.user.userId,
          walletBalance: { $gte: totalAmount },
        },
        {
          $inc: { walletBalance: -totalAmount },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }

      const updatedShow = await Show.findOneAndUpdate(
        {
          _id: showId,
          bookedSeats: { $nin: requestedSeatsStr },
          availableSeats: { $gte: seats.length },
        },
        {
          $push: { bookedSeats: { $each: requestedSeatsStr } },
          $inc: { availableSeats: -seats.length },
        },
        { new: true }
      );

      if (!updatedShow) {
        // Rollback wallet deduction
        await User.findByIdAndUpdate(req.user.userId, {
          $inc: { walletBalance: totalAmount },
        });

        return res.status(400).json({
          success: false,
          message:
            "Selected seats are no longer available. Please choose different seats.",
        });
      }

      const booking = new Booking({
        user: req.user.userId,
        show: showId,
        seats: requestedSeatsStr,
        totalAmount,
        status: "confirmed",
        paymentMethod: "wallet",
      });

      const savedBooking = await booking.save();

      const populatedBooking = await Booking.findById(
        savedBooking._id
      ).populate({
        path: "show",
        populate: [{ path: "movie" }, { path: "theater" }],
      });

      // CRITICAL: Send proper response
      res.status(201).json({
        success: true,
        booking: populatedBooking,
        newWalletBalance: updatedUser.walletBalance,
        message: "Payment successful using MovieTix Wallet",
      });
    } catch (error) {
      // CRITICAL: Always send a response, even on error
      res.status(500).json({
        success: false,
        message: "Wallet payment failed. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

// Add split payment route to server.js
app.post("/api/bookings/split-payment", authenticateToken, async (req, res) => {
  try {
    const {
      showId,
      seats,
      totalAmount,
      walletAmount,
      externalPayment,
      paymentMethod,
    } = req.body;
 

    const requestedSeatsStr = seats.map((seat) => String(seat));

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user.userId,
        walletBalance: { $gte: walletAmount }, // Ensure sufficient balance for wallet portion
      },
      {
        $inc: { walletBalance: -walletAmount }, // Deduct only the wallet portion
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Available: ₹${
          updatedUser?.walletBalance || 0
        }, Required: ₹${walletAmount}`,
      });
    }

    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: requestedSeatsStr },
        availableSeats: { $gte: seats.length },
      },
      {
        $push: { bookedSeats: { $each: requestedSeatsStr } },
        $inc: { availableSeats: -seats.length },
      },
      { new: true }
    );

    if (!updatedShow) {
      await User.findByIdAndUpdate(
        req.user.userId,
        { $inc: { walletBalance: walletAmount } } // Add wallet money back
      );

      return res.status(400).json({
        success: false,
        message:
          "Selected seats are no longer available. Please choose different seats.",
      });
    }

    // Step 3: Create booking
    const booking = new Booking({
      user: req.user.userId,
      show: showId,
      seats: requestedSeatsStr,
      totalAmount,
      status: "confirmed",
      paymentMethod: `Wallet (₹${walletAmount}) + ${paymentMethod} (₹${externalPayment})`,
    });

    const savedBooking = await booking.save();

    const populatedBooking = await Booking.findById(savedBooking._id).populate({
      path: "show",
      populate: [{ path: "movie" }, { path: "theater" }],
    });

    res.status(201).json({
      success: true,
      booking: populatedBooking,
      newWalletBalance: updatedUser.walletBalance, // Return updated balance
      walletUsed: walletAmount,
      externalPayment: externalPayment,
      message: "Split payment successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Split payment failed. Please try again.",
      error: error.message,
    });
  }
});

// Add this debug route to server.js to check seat availability
app.get("/api/debug/show/:id/seats", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({
      showId: show._id,
      bookedSeats: show.bookedSeats,
      bookedSeatsTypes: show.bookedSeats.map((seat) => typeof seat),
      availableSeats: show.availableSeats,
      totalSeats: show.bookedSeats.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route to clean up any duplicate or problematic bookings
app.post("/api/cleanup-seats", authenticateToken, async (req, res) => {
  try {
    const shows = await Show.find();
    let cleanedShows = 0;

    for (let show of shows) {
      const originalLength = show.bookedSeats.length;

      // Remove duplicates and convert to strings
      show.bookedSeats = [
        ...new Set(show.bookedSeats.map((seat) => String(seat))),
      ];

      if (originalLength !== show.bookedSeats.length) {
        await show.save();
        cleanedShows++;
      }
    }

    res.json({
      message: `Cleanup complete. Fixed ${cleanedShows} shows.`,
      totalShows: shows.length,
    });
  } catch (error) { 
    res.status(500).json({ message: "Cleanup failed" });
  }
});
