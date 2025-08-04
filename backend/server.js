const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize app
const app = express();

// Essential Middleware - MUST BE FIRST
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ticketbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Import Models
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Show = require('./models/Show');
const User = require('./models/User');
const Booking = require('./models/Booking');

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password, phone });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// MOVIE ROUTES
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Error fetching movie' });
  }
});

// SHOW ROUTES
// REPLACE YOUR /api/shows ROUTE WITH THIS CORRECTED VERSION
app.get('/api/shows', async (req, res) => {
  try {
    const { movieId, date } = req.query;
    console.log('🔍 Fetching shows for:', { movieId, date });
    
    let query = {};
    
    if (movieId) {
      query.movie = movieId;
    }
    
    if (date) {
      // CORRECTED: Simple date range without timezone confusion
      const searchDate = new Date(date + 'T00:00:00.000Z'); // Treat input as UTC
      const endDate = new Date(date + 'T23:59:59.999Z');
      
      console.log('📅 Searching date range:', { 
        from: searchDate.toISOString(), 
        to: endDate.toISOString() 
      });
      
      query.date = { 
        $gte: searchDate, 
        $lte: endDate 
      };
    }
    
    console.log('🔎 Final query:', JSON.stringify(query, null, 2));
    
    const shows = await Show.find(query)
      .populate('movie')
      .populate('theater')
      .sort({ time: 1 });
    
    console.log(`📊 Found ${shows.length} shows`);
    
    res.json(shows);
    
  } catch (error) {
    console.error('❌ Error fetching shows:', error);
    res.status(500).json({ 
      message: 'Error fetching shows', 
      error: error.message 
    });
  }
});



app.get('/api/shows/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    res.json(show);
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Error fetching show' });
  }
});

// BOOKING ROUTES
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;
    
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check if seats are available
    const unavailableSeats = seats.filter(seat => show.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }

    // Update show with booked seats
    show.bookedSeats.push(...seats);
    show.availableSeats -= seats.length;
    await show.save();

    // Create booking
    const booking = new Booking({
      user: req.user.userId,
      show: showId,
      seats,
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: [
          { path: 'movie' },
          { path: 'theater' }
        ]
      });

    res.status(201).json({ booking: populatedBooking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// Replace your existing DELETE /api/bookings/:id route with this enhanced version
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(`Attempting to cancel booking: ${bookingId}`);
    
    // Find the booking first
    const booking = await Booking.findById(bookingId).populate('show');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Check if the show has already started
    const now = new Date();
    const showDateTime = new Date(booking.show.date);
    const [hours, minutes] = booking.show.time.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    if (showDateTime <= now) {
      return res.status(400).json({ message: 'Cannot cancel booking for a show that has already started' });
    }
    
    // Update the show to release the seats
    const show = await Show.findById(booking.show._id);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
      show.availableSeats += booking.seats.length;
      await show.save();
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    console.log(`Booking ${bookingId} cancelled successfully`);
    
    // ✨ NEW: Process wallet refund with delay
    setTimeout(async () => {
      try {
        // Credit refund amount to user's wallet
        await User.findByIdAndUpdate(
          req.user.userId,
          { $inc: { walletBalance: booking.totalAmount } }
        );
        
        console.log(`💰 Refunded ₹${booking.totalAmount} to user wallet after delay`);
      } catch (error) {
        console.error('Error processing wallet refund:', error);
      }
    }, Math.floor(Math.random() * 3000) + 5000); // Random delay between 5-7 seconds
    
    res.json({ 
      message: 'Booking cancelled successfully. Refund will be credited to your wallet in 5-7 seconds.',
      booking: booking,
      refundAmount: booking.totalAmount
    });
    
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ 
      message: 'Failed to cancel booking', 
      error: error.message 
    });
  }
});



app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie' },
          { path: 'theater' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// SEED ROUTE - FIXED PATH
// REPLACE YOUR ENTIRE SEED ROUTE WITH THIS CODE
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
        description: "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
        genre: "Sci-Fi/Action",
        duration: 181,
        rating: 8.5,
        poster: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-06-27"),
        language: "Hindi",
        director: "Nag Ashwin",
        cast: ["Prabhas", "Amitabh Bachchan", "Deepika Padukone"],
        price: 300,
      },
      {
        title: "Stree 2",
        description: "The sequel to the hit horror-comedy, where the spooky mystery of Chanderi continues.",
        genre: "Horror/Comedy",
        duration: 155,
        rating: 8.2,
        poster: "https://images.unsplash.com/photo-1520637836862-4d197d17c15a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-08-15"),
        language: "Hindi",
        director: "Amar Kaushik",
        cast: ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi"],
        price: 280
      },
      {
        title: "Singham Again",
        description: "Bajirao Singham returns to take on a new threat against the nation.",
        genre: "Action",
        duration: 150,
        rating: 7.5,
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-11-01"),
        language: "Hindi",
        director: "Rohit Shetty",
        cast: ["Ajay Devgn", "Akshay Kumar", "Ranveer Singh"],
        price: 250,
      },
      {
        title: "Bhool Bhulaiyaa 3",
        description: "The third installment in the horror-comedy franchise, featuring a new ghostly tale.",
        genre: "Horror/Comedy",
        duration: 160,
        rating: 7.8,
        poster: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-11-01"),
        language: "Hindi",
        director: "Anees Bazmee",
        cast: ["Kartik Aaryan", "Vidya Balan", "Triptii Dimri"],
        price: 310
      },
      {
        title: "Pushpa 2",
        description: "Pushpa Raj returns in this highly anticipated sequel to the blockbuster action drama.",
        genre: "Action/Drama",
        duration: 175,
        rating: 8.3,
        poster: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80",
        releaseDate: new Date("2024-12-05"),
        language: "Hindi",
        director: "Sukumar",
        cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
        price: 320
      }
    ];

    const movies = await Movie.insertMany(movieData);
    console.log(`✅ ${movies.length} movies inserted`);

    // Insert theaters
    const theaterData = [
      { 
        name: "PVR Rahul Raj Mall", 
        location: "Piplod, Surat", 
        capacity: 200,
        facilities: ["3D", "IMAX", "Dolby Atmos"]
      },
      { 
        name: "INOX VR Mall", 
        location: "Dumas Road, Surat", 
        capacity: 180,
        facilities: ["3D", "Recliner", "Food Court"]
      },
      {
        name: "Cinepolis Imperial Square",
        location: "Adajan, Surat",
        capacity: 150,
        facilities: ["3D", "Premium Seating"]
      },
      {
        name: "Moviemax Citylight",
        location: "Citylight, Surat",
        capacity: 170,
        facilities: ["4DX", "Premium Seating"]
      }
    ];

    const theaters = await Theater.insertMany(theaterData);
    console.log(`✅ ${theaters.length} theaters inserted`);

    // 🎯 CREATE SHOWS FOR 1 FULL YEAR - THIS IS THE KEY CHANGE
    const shows = [];
    const times = ["10:00", "13:30", "17:00", "20:30"];
    
    console.log("🎭 Creating shows for 1 year (365 days)...");
    console.log("⏳ This might take 10-15 seconds - please wait...");
    
    // Create shows for 365 days starting from today
    for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
      let showDate = new Date();
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(0, 0, 0, 0);
      
      // Create shows every day (full year coverage)
      movies.forEach((movie) => {
        theaters.forEach((theater) => {
          times.forEach((time) => {
            shows.push({
              movie: movie._id,
              theater: theater._id,
              date: new Date(showDate),
              time: time,
              availableSeats: theater.capacity,
              bookedSeats: [],
              price: movie.price,
            });
          });
        });
      });
      
      // Progress indicator every 30 days
      if (dayOffset % 30 === 0) {
        console.log(`📅 Created shows up to: ${showDate.toDateString()}`);
      }
    }

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
        note: "Your project will work perfectly for any demo date within the next year!"
      }
    });
    
  } catch (error) {
    console.error("❌ Seed error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error seeding database", 
      error: error.message 
    });
  }
});


// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error' });
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
      "688e652bbd7250c287c47bba"  // Laapataa Ladies
    ];
    
    const theaterData = [
      { id: "688a52f8392dc0bac215ccc9", capacity: 200 }, // PVR Rahul Raj Mall
      { id: "688a52f8392dc0bac215ccca", capacity: 180 }, // INOX VR Mall
      { id: "688a52f8392dc0bac215cccb", capacity: 150 }  // Cinepolis Imperial Square
    ];
    
    const moviePrices = {
      "688e652bbd7250c287c47bb7": 280, // Maharaja
      "688e652bbd7250c287c47bb8": 250, // Manjummel Boys
      "688e652bbd7250c287c47bb9": 270, // Aavesham
      "688e652bbd7250c287c47bba": 240  // Laapataa Ladies
    };
    
    const showTimes = ["10:00", "13:30", "17:00", "20:30"];
    
    // Clear existing shows to avoid duplicates
    await Show.deleteMany({});
    console.log("✅ Cleared existing shows");
    
    const shows = [];
    
    // Create shows for next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const showDate = new Date('2025-08-03');
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
              price: moviePrices[movieId]
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
        $gte: new Date('2025-08-03T00:00:00.000Z'),
        $lt: new Date('2025-08-04T00:00:00.000Z')
      }
    }).populate('movie', 'title').populate('theater', 'name');
    
    res.json({
      success: true,
      message: `Created ${shows.length} shows for 7 days`,
      stats: {
        totalShows: shows.length,
        moviesIncluded: movieIds.length,
        theatersIncluded: theaterData.length,
        daysCreated: 7,
        showTimesPerDay: showTimes.length
      },
      todayShows: todayShows.map(show => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        availableSeats: show.availableSeats,
        price: show.price
      }))
    });
    
  } catch (error) {
    console.error('❌ Error creating shows:', error);
    res.status(500).json({ 
      message: 'Error creating shows', 
      error: error.message 
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
    allShows.forEach(show => {
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
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('movie', 'title').populate('theater', 'name');
    
    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} shows to current dates`,
      todaysShowsCount: todaysShows.length,
      sampleTodaysShows: todaysShows.slice(0, 3).map(show => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        date: show.date.toDateString()
      }))
    });
    
  } catch (error) {
    console.error('❌ Error updating show dates:', error);
    res.status(500).json({ 
      message: 'Error updating show dates', 
      error: error.message 
    });
  }
});




// ADD THIS ROUTE TO UPDATE EXISTING SHOWS TO CURRENT DATES
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
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('movie', 'title').populate('theater', 'name');
    
    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} shows to current date`,
      todaysShowsCount: todaysShows.length,
      sampleTodaysShows: todaysShows.slice(0, 3).map(show => ({
        movie: show.movie?.title,
        theater: show.theater?.name,
        time: show.time,
        date: show.date.toDateString()
      }))
    });
    
  } catch (error) {
    console.error('❌ Error updating show dates:', error);
    res.status(500).json({ 
      message: 'Error updating show dates', 
      error: error.message 
    });
  }
});

// Add this new route to get user's wallet balance
app.get('/api/user/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('walletBalance');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ walletBalance: user.walletBalance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ message: 'Error fetching wallet balance' });
  }
});

// Add wallet payment route to server.js
app.post('/api/bookings/wallet-payment', authenticateToken, async (req, res) => {
  try {
    const { showId, seats, totalAmount } = req.body;
    
    // Find user and check wallet balance
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({ 
        message: `Insufficient wallet balance. Available: ₹${user.walletBalance}, Required: ₹${totalAmount}` 
      });
    }
    
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    
    // Check if seats are available
    const unavailableSeats = seats.filter(seat => show.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }
    
    // Deduct from wallet balance
    user.walletBalance -= totalAmount;
    await user.save();
    
    // Update show with booked seats
    show.bookedSeats.push(...seats);
    show.availableSeats -= seats.length;
    await show.save();
    
    // Create booking
    const booking = new Booking({
      user: req.user.userId,
      show: showId,
      seats,
      totalAmount,
      status: 'confirmed',
      paymentMethod: 'wallet'
    });
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: [
          { path: 'movie' },
          { path: 'theater' }
        ]
      });
    
    res.status(201).json({ 
      booking: populatedBooking,
      newWalletBalance: user.walletBalance,
      message: 'Payment successful using MovieTix Wallet'
    });
    
  } catch (error) {
    console.error('Wallet payment error:', error);
    res.status(500).json({ message: 'Wallet payment failed' });
  }
});

