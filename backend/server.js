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
    console.error("Register error:", error);
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
    console.error("Login error:", error);
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
    
    console.log('🔍 Movie query:', JSON.stringify(query, null, 2));
    
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
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
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Error fetching movie" });
  }
});

// SHOW ROUTES
// REPLACE YOUR /api/shows ROUTE WITH THIS CORRECTED VERSION
app.get("/api/shows", async (req, res) => {
  try {
    const { movieId, date } = req.query;
    console.log("🔍 Fetching shows for:", { movieId, date });

    let query = {};

    if (movieId) {
      query.movie = movieId;
    }

    if (date) {
      // CORRECTED: Simple date range without timezone confusion
      const searchDate = new Date(date + "T00:00:00.000Z"); // Treat input as UTC
      const endDate = new Date(date + "T23:59:59.999Z");

      console.log("📅 Searching date range:", {
        from: searchDate.toISOString(),
        to: endDate.toISOString(),
      });

      query.date = {
        $gte: searchDate,
        $lte: endDate,
      };
    }

    console.log("🔎 Final query:", JSON.stringify(query, null, 2));

    const shows = await Show.find(query)
      .populate("movie")
      .populate("theater")
      .sort({ time: 1 });

    console.log(`📊 Found ${shows.length} shows`);

    res.json(shows);
  } catch (error) {
    console.error("❌ Error fetching shows:", error);
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
    console.error("Error fetching show:", error);
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

    console.log("🎫 Starting atomic booking process:", {
      showId,
      seats,
      totalAmount,
    });

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
        console.log("📊 Current show state:");
        console.log("- Available seats:", currentShow.availableSeats);
        console.log("- Booked seats:", currentShow.bookedSeats);
        console.log("- Requested seats:", requestedSeatsStr);

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

        console.log("✅ Seat reservation rolled back successfully");
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
    
    console.log('🔍 Upcoming movies query:', JSON.stringify(query, null, 2));
    
    // Fetch from upcomingmovies collection, sorted by release date
    const upcomingMovies = await UpcomingMovie.find(query).sort({ releaseDate: 1 });
    
    console.log(`📊 Found ${upcomingMovies.length} upcoming movies`);
    
    res.json(upcomingMovies);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    res.status(500).json({ message: "Error fetching upcoming movies" });
  }
});

// 2. Seed upcoming movies
app.get("/api/seed-upcoming-movies", async (req, res) => {
  try {
    console.log("🚀 Starting upcoming movies seed...");
    
    // Check if upcoming movies already exist
    const existingUpcoming = await UpcomingMovie.countDocuments();
    console.log(`📅 Existing upcoming movies: ${existingUpcoming}`);
    
    if (existingUpcoming > 0) {
      return res.json({
        success: true,
        message: `${existingUpcoming} upcoming movies already exist in database`,
        moviesCount: existingUpcoming,
        skipReason: "already_exists"
      });
    }

    const upcomingMoviesData = [
      {
        title: "Avengers: Secret Wars",
        genre: "Action/Sci-Fi",
        description: "The ultimate Marvel showdown arrives with mind-bending multiverse battles that will reshape the MCU forever.",
        director: "Russo Brothers",
        releaseDate: new Date("2025-05-02T00:00:00.000Z"),
        duration: 180,
        rating: 8.5,
        language: "English",
        poster: "https://via.placeholder.com/300x450/6366f1/ffffff?text=Avengers+Secret+Wars",
        price: 350,
        cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "The Batman Part II",
        genre: "Action/Crime",
        description: "The Dark Knight returns to face new threats in Gotham City as Batman's legend continues to grow.",
        director: "Matt Reeves",
        releaseDate: new Date("2025-10-03T00:00:00.000Z"),
        duration: 155,
        rating: 8.8,
        language: "English",
        poster: "https://via.placeholder.com/300x450/333333/ffffff?text=The+Batman+II",
        price: 320,
        cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Pushpa 3: The Rampage",
        genre: "Action/Drama",
        description: "Allu Arjun returns as Pushpa Raj in the most explosive and action-packed chapter of the saga.",
        director: "Sukumar",
        releaseDate: new Date("2025-12-17T00:00:00.000Z"),
        duration: 165,
        rating: 8.2,
        language: "Telugu",
        poster: "https://via.placeholder.com/300x450/FF6B35/ffffff?text=Pushpa+3",
        price: 280,
        cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Spider-Man 4",
        genre: "Action/Adventure",
        description: "Tom Holland swings back as Spider-Man in an all-new adventure that will change everything.",
        director: "Jon Watts",
        releaseDate: new Date("2025-07-15T00:00:00.000Z"),
        duration: 140,
        rating: 8.7,
        language: "English",
        poster: "https://via.placeholder.com/300x450/DC143C/ffffff?text=Spider-Man+4",
        price: 340,
        cast: ["Tom Holland", "Zendaya", "Jacob Batalon"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "KGF Chapter 3",
        genre: "Action/Drama",
        description: "The legacy of Rocky Bhai continues in the most anticipated conclusion to the KGF saga.",
        director: "Prashanth Neel",
        releaseDate: new Date("2025-09-22T00:00:00.000Z"),
        duration: 175,
        rating: 8.4,
        language: "Kannada",
        poster: "https://via.placeholder.com/300x450/DAA520/ffffff?text=KGF+Chapter+3",
        price: 290,
        cast: ["Yash", "Srinidhi Shetty", "Ramya Krishnan"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Deadpool 3",
        genre: "Action/Comedy",
        description: "The Merc with a Mouth returns with his irreverent humor and fourth-wall-breaking antics.",
        director: "Shawn Levy",
        releaseDate: new Date("2025-11-08T00:00:00.000Z"),
        duration: 125,
        rating: 8.6,
        language: "English",
        poster: "https://via.placeholder.com/300x450/8B0000/ffffff?text=Deadpool+3",
        price: 330,
        cast: ["Ryan Reynolds", "Hugh Jackman", "Morena Baccarin"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "RRR 2",
        genre: "Action/Drama",
        description: "SS Rajamouli returns with another epic tale of friendship, valor, and spectacular action sequences.",
        director: "SS Rajamouli",
        releaseDate: new Date("2026-03-25T00:00:00.000Z"),
        duration: 190,
        rating: 8.9,
        language: "Telugu",
        poster: "https://via.placeholder.com/300x450/4B0082/ffffff?text=RRR+2",
        price: 310,
        cast: ["Ram Charan", "Jr. NTR", "Alia Bhatt"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Brahmastra Part Two: Dev",
        genre: "Fantasy/Adventure",
        description: "The Astraverse expands with new powers, ancient mysteries, and epic battles between light and darkness.",
        director: "Ayan Mukerji",
        releaseDate: new Date("2026-02-14T00:00:00.000Z"),
        duration: 170,
        rating: 7.9,
        language: "Hindi",
        poster: "https://via.placeholder.com/300x450/FF4500/ffffff?text=Brahmastra+2",
        price: 300,
        cast: ["Ranbir Kapoor", "Alia Bhatt", "Amitabh Bachchan"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log(`📝 Attempting to insert ${upcomingMoviesData.length} upcoming movies...`);

    // Insert into upcomingmovies collection
    const insertedMovies = await UpcomingMovie.insertMany(upcomingMoviesData, {
      ordered: false
    });
    
    console.log(`✅ Successfully inserted ${insertedMovies.length} upcoming movies`);

    res.json({
      success: true,
      message: `Successfully added ${insertedMovies.length} upcoming movies to database`,
      moviesCount: insertedMovies.length,
      insertedIds: insertedMovies.map(m => m._id),
      totalUpcomingMovies: await UpcomingMovie.countDocuments()
    });

  } catch (error) {
    console.error("❌ Error seeding upcoming movies:", error);
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
    console.error("Error fetching upcoming movie:", error);
    res.status(500).json({ message: "Error fetching upcoming movie" });
  }
});



// Replace your existing DELETE /api/bookings/:id route with this enhanced version
app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(`Attempting to cancel booking: ${bookingId}`);

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

    console.log(`Booking ${bookingId} cancelled successfully`);

    // ✨ NEW: Process wallet refund with delay
    setTimeout(async () => {
      try {
        // Credit refund amount to user's wallet
        await User.findByIdAndUpdate(req.user.userId, {
          $inc: { walletBalance: booking.totalAmount },
        });

        console.log(
          `💰 Refunded ₹${booking.totalAmount} to user wallet after delay`
        );
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
    console.error("Error cancelling booking:", error);
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
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// SEED ROUTE - FIXED PATH
app.post("/api/seed", async (req, res) => {
  try {
    console.log("🚀 Starting database seed with 1-year shows...");

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Show.deleteMany({});
    console.log("✅ Existing data cleared");

    // Insert movies
    const movieData = [
      {
        title: "Kalki 2898-AD",
        description:
          "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
        genre: "Sci-Fi/Action",
        duration: 181,
        rating: 8.5,
        poster:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-06-27"),
        language: "Hindi",
        director: "Nag Ashwin",
        cast: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone"],
        price: 300,
      },
      {
        title: "Stree 2",
        description:
          "The sequel to the hit horror-comedy, where the spooky mystery of Chanderi continues.",
        genre: "Horror/Comedy",
        duration: 155,
        rating: 8.2,
        poster:
          "https://images.unsplash.com/photo-1520637836862-4d197d17c15a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-08-15"),
        language: "Hindi",
        director: "Amar Kaushik",
        cast: ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi"],
        price: 280,
      },
      {
        title: "Singham Again",
        description:
          "Bajirao Singham returns to take on a new threat against the nation.",
        genre: "Action",
        duration: 150,
        rating: 7.5,
        poster:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-11-01"),
        language: "Hindi",
        director: "Rohit Shetty",
        cast: ["Ajay Devgn", "Akshay Kumar", "Ranveer Singh"],
        price: 250,
      },
      {
        title: "Bhool Bhulaiyaa 3",
        description:
          "The third installment in the horror-comedy franchise, featuring a new ghostly tale.",
        genre: "Horror/Comedy",
        duration: 160,
        rating: 7.8,
        poster:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-11-01"),
        language: "Hindi",
        director: "Anees Bazmee",
        cast: ["Kartik Aaryan", "Vidya Balan", "Triptii Dimri"],
        price: 310,
      },
      {
        title: "Pushpa 2",
        description:
          "Pushpa Raj returns in this highly anticipated sequel to the blockbuster action drama.",
        genre: "Action/Drama",
        duration: 175,
        rating: 8.3,
        poster:
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-12-05"),
        language: "Hindi",
        director: "Sukumar",
        cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
        price: 320,
      },
    ];

    const movies = await Movie.insertMany(movieData);
    console.log(`✅ ${movies.length} movies inserted`);

    // Insert theaters
    const theaterData = [
      {
        name: "PVR Rahul Raj Mall",
        location: "Piplod, Surat",
        capacity: 200,
        facilities: ["3D", "IMAX", "Dolby Atmos"],
      },
      {
        name: "INOX VR Mall",
        location: "Dumas Road, Surat",
        capacity: 180,
        facilities: ["3D", "Recliner", "Food Court"],
      },
      {
        name: "Cinepolis Imperial Square",
        location: "Adajan, Surat",
        capacity: 150,
        facilities: ["3D", "Premium Seating"],
      },
      {
        name: "Moviemax Citylight",
        location: "Citylight, Surat",
        capacity: 170,
        facilities: ["4DX", "Premium Seating"],
      },
    ];

    const theaters = await Theater.insertMany(theaterData);
    console.log(`✅ ${theaters.length} theaters inserted`);

    const shows = [];
    const times = ["10:00", "13:30", "17:00", "20:30"];

    console.log("🎭 Creating shows for 1 year (365 days)...");
    console.log("⏳ This might take 10-15 seconds - please wait...");

    console.log(`🎬 Inserting ${shows.length} shows into database...`);
    const insertedShows = await Show.insertMany(shows);
    console.log(`✅ ${insertedShows.length} shows created successfully!`);

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 364);

    res.json({
      success: true,
      message: "🎉 Database seeded successfully with 1 FULL YEAR of shows!",
      stats: {
        movies: movies.length,
        theaters: theaters.length,
        shows: insertedShows.length,
        coverage: `Shows available from ${new Date().toDateString()} to ${endDate.toDateString()}`,
        duration: "365 days of shows created",
        note: "Your project will work perfectly for any demo date within the next year!",
      },
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({
      success: false,
      message: "Error seeding database",
      error: error.message,
    });
  }
});

app.get("/api/create-15day-400shows", async (req, res) => {
  try {
    const movies = await Movie.find();
    const theaters = await Theater.find();
    
    if (movies.length === 0 || theaters.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Need movies and theaters first" 
      });
    }

    const showTimes = ["10:00", "13:30", "16:00", "19:30", "22:00"];
    const daysToCreate = 365;
    const expectedShowsPerDay = movies.length * theaters.length * showTimes.length;
    const expectedTotal = expectedShowsPerDay * daysToCreate;
    
    console.log(`🎯 Creating ${expectedShowsPerDay} shows per day for ${daysToCreate} days`);
    console.log(`📊 Target total: ${expectedTotal} shows`);
    
    const startDate = new Date();
    let totalInserted = 0;
    
    for (let day = 0; day < daysToCreate; day++) {
      const showDate = new Date(startDate);
      showDate.setDate(showDate.getDate() + day);
      const dateString = showDate.toISOString().split('T')[0];
      
      const dailyShows = [];
      
      // For each movie (ensures all 16 movies get shows)
      movies.forEach((movie) => {
        // For each theater (ensures all 5 theaters)
        theaters.forEach((theater) => {
          // For each time slot (ensures all 5 times)
          showTimes.forEach((showTime) => {
            dailyShows.push({
              movie: movie._id,
              theater: theater._id,
              date: dateString,
              time: showTime,
              price: movie.price || 280,
              availableSeats: theater.capacity || 200,
              bookedSeats: [],
              totalSeats: theater.capacity || 200,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          });
        });
      });
      
      // Insert daily shows
      if (dailyShows.length > 0) {
        await Show.insertMany(dailyShows);
        totalInserted += dailyShows.length;
        
        console.log(`📅 Day ${day + 1}/${daysToCreate}: Created ${dailyShows.length} shows (Total: ${totalInserted})`);
      }
    }

    console.log(`🎉 Complete! Created ${totalInserted} shows over ${daysToCreate} days`);

    res.json({
      success: true,
      message: `Created ${totalInserted} shows for 15 days with 400 shows per day`,
      showsCreated: totalInserted,
      expectedTotal: expectedTotal,
      showsPerDay: expectedShowsPerDay,
      daysScheduled: daysToCreate,
      moviesUsed: movies.length,
      theatersUsed: theaters.length,
      showTimesPerDay: showTimes.length,
      coverage: "Complete: Every movie in every theater at every time slot every day"
    });

  } catch (error) {
    console.error("❌ Error creating 15-day shows:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create shows",
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ message: "Internal server error" });
});

// GIFT CARD ROUTES - Add this entire section

// Purchase Gift Card
app.post("/api/gift-cards/purchase", authenticateToken, async (req, res) => {
  try {
    console.log("🎁 Gift card purchase request received:", req.body);
    
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
    
    console.log("✅ Gift card created successfully:", code);

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
    console.error("❌ Error purchasing gift card:", error);
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
    console.error("Error redeeming gift card:", error);
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
    console.error("Error fetching gift card history:", error);
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
    console.error("Error checking gift card:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check gift card"
    });
  }
});

// Redeem Gift Card Route (add this to server.js)
app.post("/api/gift-cards/redeem", authenticateToken, async (req, res) => {
  try {
    console.log("🎁 Gift card redeem request received:", req.body);
    
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

    console.log("✅ Gift card redeemed successfully:", code);

    res.json({
      success: true,
      amount: giftCard.amount,
      message: `₹${giftCard.amount} added to your wallet successfully!`
    });

  } catch (error) {
    console.error("❌ Error redeeming gift card:", error);
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

// ADD THIS ROUTE TO YOUR server.js FILE
app.post("/api/create-custom-shows", async (req, res) => {
  try {
    console.log("🎬 Creating shows for your specific movies and theaters...");

    // Your exact movie and theater IDs
    const movieIds = [
      "688e652bbd7250c287c47bb7", // Maharaja
      "688e652bbd7250c287c47bb8", // Manjummel Boys
      "688e652bbd7250c287c47bb9", // Aavesham
      "688e652bbd7250c287c47bba", // Laapataa Ladies
    ];

    const theaterData = [
      { id: "688a52f8392dc0bac215ccc9", capacity: 200 }, // PVR Rahul Raj Mall
      { id: "688a52f8392dc0bac215ccca", capacity: 180 }, // INOX VR Mall
      { id: "688a52f8392dc0bac215cccb", capacity: 150 }, // Cinepolis Imperial Square
    ];

    const moviePrices = {
      "688e652bbd7250c287c47bb7": 280, // Maharaja
      "688e652bbd7250c287c47bb8": 250, // Manjummel Boys
      "688e652bbd7250c287c47bb9": 270, // Aavesham
      "688e652bbd7250c287c47bba": 240, // Laapataa Ladies
    };

    const showTimes = ["10:00", "13:30", "17:00", "20:30"];

    // Clear existing shows to avoid duplicates
    await Show.deleteMany({});
    console.log("✅ Cleared existing shows");

    const shows = [];

    // Create shows for next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const showDate = new Date("2025-08-03");
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(0, 0, 0, 0);

      movieIds.forEach((movieId) => {
        theaterData.forEach((theater) => {
          showTimes.forEach((time) => {
            shows.push({
              movie: movieId,
              theater: theater.id,
              date: new Date(showDate),
              time: time,
              availableSeats: theater.capacity,
              bookedSeats: [],
              price: moviePrices[movieId],
            });
          });
        });
      });
    }

    await Show.insertMany(shows);
    console.log(`✅ Created ${shows.length} shows successfully!`);

    // Verify today's shows
    const todayShows = await Show.find({
      date: {
        $gte: new Date("2025-08-03T00:00:00.000Z"),
        $lt: new Date("2025-08-04T00:00:00.000Z"),
      },
    })
      .populate("movie", "title")
      .populate("theater", "name");

    res.json({
      success: true,
      message: `Created ${shows.length} shows for 7 days`,
      stats: {
        totalShows: shows.length,
        moviesIncluded: movieIds.length,
        theatersIncluded: theaterData.length,
        daysCreated: 7,
        showTimesPerDay: showTimes.length,
      },
      todayShows: todayShows.map((show) => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        availableSeats: show.availableSeats,
        price: show.price,
      })),
    });
  } catch (error) {
    console.error("❌ Error creating shows:", error);
    res.status(500).json({
      message: "Error creating shows",
      error: error.message,
    });
  }
});

// ADD THIS ROUTE TO UPDATE YOUR EXISTING SHOWS TO CURRENT DATES
app.post("/api/fix-show-dates-now", async (req, res) => {
  try {
    console.log("🔧 Updating all show dates to current dates...");

    // Get all shows and update their dates to start from today
    const allShows = await Show.find();

    if (allShows.length === 0) {
      return res.json({ message: "No shows found to update" });
    }

    console.log(`Found ${allShows.length} shows to update`);

    // Group shows by their original date to maintain the pattern
    const showsByOriginalDate = {};
    allShows.forEach((show) => {
      const dateKey = show.date.toDateString();
      if (!showsByOriginalDate[dateKey]) {
        showsByOriginalDate[dateKey] = [];
      }
      showsByOriginalDate[dateKey].push(show);
    });

    // Update each group of shows to consecutive days starting from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const originalDates = Object.keys(showsByOriginalDate);
    let updatedCount = 0;

    for (let i = 0; i < originalDates.length; i++) {
      const showsForDate = showsByOriginalDate[originalDates[i]];
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i); // Add i days from today

      // Update all shows for this date
      for (let show of showsForDate) {
        show.date = new Date(newDate);
        await show.save();
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} shows to current dates`);

    // Verify the update by checking today's shows
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaysShows = await Show.find({
      date: { $gte: todayStart, $lte: todayEnd },
    })
      .populate("movie", "title")
      .populate("theater", "name");

    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} shows to current dates`,
      todaysShowsCount: todaysShows.length,
      sampleTodaysShows: todaysShows.slice(0, 3).map((show) => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        date: show.date.toDateString(),
      })),
    });
  } catch (error) {
    console.error("❌ Error updating show dates:", error);
    res.status(500).json({
      message: "Error updating show dates",
      error: error.message,
    });
  }
});

app.post("/api/update-show-dates", async (req, res) => {
  try {
    console.log("🔧 Updating all existing shows to current dates...");

    // Get all shows
    const allShows = await Show.find();

    if (allShows.length === 0) {
      return res.json({ message: "No shows found to update" });
    }

    console.log(`Found ${allShows.length} shows to update`);

    // Update all shows to start from today (August 3, 2025)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let updatedCount = 0;

    // Update each show to today's date
    for (let show of allShows) {
      show.date = new Date(today);
      await show.save();
      updatedCount++;
    }

    console.log(`✅ Updated ${updatedCount} shows to today's date`);

    // Verify the update
    const todaysShows = await Show.find({
      date: {
        $gte: new Date(today),
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("movie", "title")
      .populate("theater", "name");

    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} shows to current date`,
      todaysShowsCount: todaysShows.length,
      sampleTodaysShows: todaysShows.slice(0, 3).map((show) => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        date: show.date.toDateString(),
      })),
    });
  } catch (error) {
    console.error("❌ Error updating show dates:", error);
    res.status(500).json({
      message: "Error updating show dates",
      error: error.message,
    });
  }
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
    console.error("Error fetching wallet balance:", error);
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

      console.log("💰 Wallet payment request received:", {
        showId,
        seats,
        totalAmount,
      });

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

    console.log("🔄 Processing split payment:", {
      showId,
      seats,
      walletAmount,
      externalPayment,
    });

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
    console.error("Cleanup error:", error);
    res.status(500).json({ message: "Cleanup failed" });
  }
});
