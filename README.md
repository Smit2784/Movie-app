# 🎬 MovieTix - Movie Ticket Booking Platform

A full-stack movie ticket booking web application built with React and Node.js that allows users to browse movies, book tickets, manage bookings, and purchase gift cards.

## 🌟 Features

### User Features

- **🎫 Movie Browsing & Booking**
    - Browse current and upcoming movies
    - Filter movies by categories (Action, Comedy, Drama, Horror, Sci-Fi, etc.)
    - Search movies by title or description
    - View detailed movie information (cast, director, rating, duration)
    - Select showtimes and dates

- **💺 Seat Selection**
    - Interactive seat layout with real-time availability
    - Visual seat status indicators (Available, Selected, Booked)
    - Multiple seat selection
    - Dynamic pricing calculation

- **💳 Payment Options**
    - MovieTix Wallet integration
    - Split payment (Wallet + External payment methods)
    - Credit/Debit Card payments
    - UPI payments
    - Net Banking

- **👤 User Account Management**
    - Secure authentication (JWT-based)
    - User registration and login
    - **Profile Management**: Update personal details
    - View booking history
    - Cancel bookings with automatic refunds to wallet
    - Wallet balance management

- **🎁 Gift Card System**
    - Purchase gift cards for friends/family
    - Redeem gift cards to wallet
    - View gift card history
    - Custom messages with gift cards

- **📱 Additional Features**
    - Responsive design for mobile and desktop
    - Upcoming movies section
    - About Us, Contact, FAQ pages
    - Booking guide for first-time users
    - PDF ticket generation

### Admin Features

- **� Admin Dashboard**: overview of business metrics
- **🎬 Movie Management**: Add, update, and remove movies
- **🎭 Theater Management**: Manage theater locations and screens
- **📅 Show Management**: Schedule shows and manage cinema timings

## �🛠️ Tech Stack

### Frontend

- **React** 19.1.1 - UI library
- **TailwindCSS** 3.4.4 - Styling
- **Lucide React** - Icons
- **jsPDF** - PDF ticket generation
- **React Router** - Navigation
- **Context API** - State Management

### Backend

- **Node.js** with **Express** 5.1.0
- **MongoDB** with **Mongoose** 8.17.0
- **JWT** (jsonwebtoken 9.0.2) - Authentication
- **bcryptjs** 3.0.2 - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Smit2784/Movie-app.git
cd Movie-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Add your environment variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ticketbooking
# JWT_SECRET=your_secret_key

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will run on `http://localhost:3000`

## 📁 Project Structure

```
Movie-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── giftCardController.js
│   │   ├── movieController.js
│   │   ├── showController.js
│   │   └── theaterController.js
│   ├── middleware/
│   │   ├── authAdmin.js
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── GiftCard.js
│   │   ├── Movie.js
│   │   ├── Show.js
│   │   ├── Theater.js
│   │   ├── UpcomingMovie.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── giftCardRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   └── theaterRoutes.js
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── Contexts/
    │   │   └── AuthProvider.js
    │   ├── Layouts/
    │   │   ├── Footer.js
    │   │   └── Header.js
    │   ├── Pages/
    │   │   ├── Admin/
    │   │   │   ├── AddMovie.js
    │   │   │   ├── AdminDashboard.js
    │   │   │   ├── ManageMovies.js
    │   │   │   ├── ManageShows.js
    │   │   │   ├── ManageTheaters.js
    │   │   │   └── ManageUsers.js
    │   │   ├── AboutUs.js
    │   │   ├── Auth.js
    │   │   ├── BookingGuide.js
    │   │   ├── BookingPage.js
    │   │   ├── ContactUs.js
    │   │   ├── FAQ.js
    │   │   ├── GiftCards.js
    │   │   ├── Home.js
    │   │   ├── MovieDetails.js
    │   │   ├── MyBookings.js
    │   │   ├── Payment.js
    │   │   ├── PaymentSuccess.js
    │   │   ├── SeatSelection.js
    │   │   ├── UpcomingMovies.js
    │   │   └── UpdateProfile.js
    │   ├── App.css
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Movies

- `GET /api/movies` - Get all movies (with filters & search)
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/upcoming-movies` - Get upcoming movies
- `GET /api/upcoming-movies/:id` - Get upcoming movie by ID
- `GET /api/seed-upcoming-movies` - Seed upcoming movies data

### Shows

- `GET /api/shows` - Get shows (filter by movieId, date)
- `GET /api/shows/:id` - Get show by ID

### Bookings

- `GET /api/bookings` - Get user bookings (authenticated)
- `POST /api/bookings` - Create new booking (authenticated)
- `POST /api/bookings/wallet-payment` - Book with wallet (authenticated)
- `POST /api/bookings/split-payment` - Split payment booking (authenticated)
- `DELETE /api/bookings/:id` - Cancel booking (authenticated)

### Gift Cards

- `POST /api/gift-cards/purchase` - Purchase gift card (authenticated)
- `POST /api/gift-cards/redeem` - Redeem gift card (authenticated)
- `GET /api/gift-cards/history` - Get gift card history (authenticated)
- `GET /api/gift-cards/check/:code` - Check gift card status

### User Wallet

- `GET /api/user/wallet` - Get wallet balance (authenticated)

### Theaters

- `POST /api/theaters` - Create theater (authenticated)

## 💾 Database Models

### User

- Name, Email, Password (hashed)
- Phone number
- Wallet balance
- Timestamps

### Movie

- Title, Description, Genre
- Director, Cast, Rating
- Duration, Release date
- Poster URL, Trailer URL

### Theater

- Name, Location
- Capacity, Screens
- Facilities

### Show

- Movie reference
- Theater reference
- Date, Time
- Available seats, Booked seats
- Price

### Booking

- User reference
- Show reference
- Seats (array)
- Total amount
- Status (confirmed/cancelled)
- Payment method

### GiftCard

- Code (unique 8-character)
- Amount
- Purchaser, Recipient details
- Status (active/redeemed)
- Messages

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketbooking
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 📱 Key Features Implementation

### Authentication Flow

- JWT-based authentication
- Tokens stored in localStorage
- Protected routes with authentication middleware
- Password encryption using bcryptjs

### Booking System

- Atomic seat reservation to prevent double booking
- Real-time seat availability checking
- Automatic rollback on booking failure
- Multiple payment methods support

### Wallet System

- Auto-refund to wallet on booking cancellation
- Delayed refund processing (5-7 seconds)
- Gift card redemption to wallet
- Split payment capabilities

## 🎨 UI Components

- **Header** - Navigation with user authentication status
- **Footer** - Site links and information
- **Home** - Movie listings with filters
- **MovieDetails** - Detailed movie information and show selection
- **SeatSelection** - Interactive seat map
- **PaymentPage** - Multiple payment options
- **MyBookings** - Booking history with cancel option
- **GiftCards** - Purchase and redeem gift cards
- **Admin Dashboard** - Management portal for administrators

## 🚧 Future Enhancements

- [ ] Email notifications for bookings
- [ ] Movie recommendations based on preferences
- [ ] Rating and review system
- [ ] Social media integration
- [ ] Advanced search and filters
- [ ] Multi-language support
- [ ] Loyalty points program

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Smit Dudhat**

- GitHub: [@Smit2784](https://github.com/Smit2784)

## 🙏 Acknowledgments

- MongoDB for database
- React team for the amazing library
- TailwindCSS for styling utilities
- All open-source contributors
