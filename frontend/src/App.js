import React, { useState, useEffect, createContext, useContext } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  User,
  LogOut,
  Film,
  Ticket,
} from "lucide-react";
import logo from "./generated-image.png";

// Context for authentication
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// API Functions
const api = {
  // Auth
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Movies
  getMovies: async () => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    return response.json();
  },

  getMovie: async (id) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    return response.json();
  },

  // Shows
  getShows: async (movieId, date) => {
    const params = new URLSearchParams();
    if (movieId) params.append("movieId", movieId);
    if (date) params.append("date", date);

    const response = await fetch(`${API_BASE_URL}/shows?${params}`);
    return response.json();
  },

  getShow: async (id) => {
    const response = await fetch(`${API_BASE_URL}/shows/${id}`);
    return response.json();
  },

  // Bookings
  createBooking: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getBookings: async (token) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  cancelBooking: async (bookingId, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  getWalletBalance: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

    walletPayment: async (bookingData, token) => {
    const response = await fetch(`${API_BASE_URL}/bookings/wallet-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  // Seed data (for development)
  seedData: async () => {
    const response = await fetch(`${API_BASE_URL}/seed`, {
      method: "POST",
    });
    return response.json();
  },
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Header Component
const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout, token } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance when component mounts or token changes
  useEffect(() => {
    if (user && token) {
      fetchWalletBalance();
    }
  }, [user, token]);

  const fetchWalletBalance = async () => {
    try {
      const data = await api.getWalletBalance(token);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300" onClick={() => setCurrentPage('home')}>
            <img src={logo} alt="MovieTix Logo" className="h-12 w-15 object-contain" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              MovieTix
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === 'home' 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300' 
                  : 'hover:scale-105'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === 'about' 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300' 
                  : 'hover:scale-105'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === 'contact' 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300' 
                  : 'hover:scale-105'
              }`}
            >
              Contact Us
            </button>
            {user && (
              <button
                onClick={() => setCurrentPage('bookings')}
                className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                  currentPage === 'bookings' 
                    ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300' 
                    : 'hover:scale-105'
                }`}
              >
                My Bookings
              </button>
            )}
          </nav>

          {/* User Account Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Account Icon & User Info */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="relative">
                    <User className="h-6 w-6 text-purple-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-white">{user.name}</div>
                    {/* <div className="text-xs text-purple-300">Online</div> */}
                  </div>
                </div>

                {/* Wallet Balance Display */}
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300">💰</span>
                    <span className="text-white font-semibold">₹{walletBalance}</span>
                  </div>
                </div>

                {/* Enhanced Logout Button */}
                <button
                  onClick={logout}
                  className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  title="Logout"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </div>
                </button>
              </div>
            ) : (
              /* Enhanced Login Button */
              <button
                onClick={() => setCurrentPage('auth')}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>LogIn</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


// Enhanced Auth Component
const AuthComponent = ({ setCurrentPage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = isLogin
        ? await login({ email: formData.email, password: formData.password })
        : await register(formData);

      if (result.success) {
        setCurrentPage("home");
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20">
              <Film className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-2">
            {isLogin ? "Welcome Back!" : "Join MovieTix"}
          </h2>
          <p className="text-xl text-gray-300 font-light">
            {isLogin
              ? "Sign in to continue your movie journey"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Form Toggle */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
                    isLogin
                      ? "bg-white text-purple-700 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 text-center rounded-xl font-semibold transition-all duration-300 ${
                    !isLogin
                      ? "bg-white text-purple-700 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                {!isLogin && (
                  <>
                    <div className="relative group">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
                        📱
                      </div>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                <div className="relative group">
                  <div className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
                    ✉️
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
                    🔒
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="relative">
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-2xl text-center font-medium">
                    <span className="inline-block mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Please wait...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Create Account"}</span>
                      <div className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </div>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seat Selection Component
// Enhanced Seat Selection Component with Tailwind CSS
const SeatSelection = ({ show, onSeatSelect, selectedSeats }) => {
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 15;
    const seats = [];

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          id: seatId,
          row,
          number: i,
          isBooked: show.bookedSeats.includes(seatId),
          isSelected: selectedSeats.includes(seatId),
        });
      }
    });

    return seats;
  };

  const seats = generateSeats();

  const getSeatColor = (seat) => {
    if (seat.isBooked)
      return "bg-red-500 hover:bg-red-600 cursor-not-allowed text-white border-red-600";
    if (seat.isSelected)
      return "bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-lg transform scale-105";
    return "bg-gray-200 hover:bg-blue-400 hover:text-white cursor-pointer border-gray-300 hover:border-blue-500 hover:shadow-md";
  };

  // Group seats by rows for better layout
  const seatsByRow = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-gray-800 mb-2">
          Select Your Seats
        </h2>
        <p className="text-gray-600 text-lg">
          Choose your preferred seats for the best movie experience
        </p>
      </div>

      {/* Screen Indicator */}
      <div className="relative mb-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-t-3xl shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest">
              SCREEN
            </span>
          </div>
          <div className="h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-b-lg opacity-50"></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 font-medium">
            All eyes on the screen
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mb-10 space-x-8 bg-gray-50 py-4 px-8 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-gray-200 border border-gray-300 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-green-500 border border-green-600 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Selected</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-red-500 border border-red-600 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Booked</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="space-y-3 max-w-5xl mx-auto">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center justify-center space-x-2">
            {/* Row Label */}
            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 text-lg mr-4">
              {row}
            </div>

            {/* Seats in this row */}
            <div className="flex space-x-2">
              {rowSeats.map((seat) => (
                <button
                  key={seat.id}
                  disabled={seat.isBooked}
                  onClick={() => !seat.isBooked && onSeatSelect(seat.id)}
                  className={`
                    w-9 h-9 rounded-lg border-2 text-xs font-bold 
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-4 focus:ring-purple-300
                    ${getSeatColor(seat)}
                    ${seat.isSelected ? "animate-pulse" : ""}
                  `}
                  title={`Seat ${seat.id} - ${
                    seat.isBooked
                      ? "Booked"
                      : seat.isSelected
                      ? "Selected"
                      : "Available"
                  }`}
                >
                  {seat.number}
                </button>
              ))}
            </div>

            {/* Row Label (Right Side) */}
            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 text-lg ml-4">
              {row}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Numbers Guide */}
      <div className="flex justify-between max-w-5xl mx-auto mt-6 px-12">
        <span className="text-xs font-medium text-gray-500">1</span>
        <span className="text-xs font-medium text-gray-500">8</span>
        <span className="text-xs font-medium text-gray-500">15</span>
      </div>

      {/* Selection Summary */}
      <div className="mt-10 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-600">
                {selectedSeats.length}
              </div>
              <div className="text-sm text-gray-600">Seats Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                ₹{show.price}
              </div>
              <div className="text-sm text-gray-600">Per Seat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">
                ₹{selectedSeats.length * show.price}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected Seats:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Click on available seats to select • Maximum 10 seats per booking
        </p>
      </div>
    </div>
  );
};

// Show Times Component
const ShowTimes = ({ shows, onShowSelect, selectedDate, onDateChange }) => {
  const showsByTheater = shows.reduce((acc, show) => {
    const theaterName = show.theater.name;
    if (!acc[theaterName]) {
      acc[theaterName] = [];
    }
    acc[theaterName].push(show);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Select Show Time</h3>
        {/* <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
          min={new Date().toISOString().split('T')[0]}
        /> */}
      </div>

      {Object.entries(showsByTheater).map(([theaterName, theaterShows]) => (
        <div key={theaterName} className="mb-6">
          <h4 className="font-semibold text-lg mb-3">{theaterName}</h4>
          <div className="flex flex-wrap gap-3">
            {theaterShows.map((show) => (
              <button
                key={show._id}
                onClick={() => onShowSelect(show)}
                className="border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <div className="text-center">
                  <div className="font-semibold">{show.time}</div>
                  <div className="text-xs text-gray-600">
                    {show.availableSeats} seats
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Booking Summary Component
const BookingSummary = ({ show, selectedSeats, onConfirmBooking, loading }) => {
  const totalAmount = selectedSeats.length * show.price;

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span>Movie:</span>
          <span className="font-semibold">{show.movie.title}</span>
        </div>
        <div className="flex justify-between">
          <span>Theater:</span>
          <span>{show.theater.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Date & Time:</span>
          <span>
            {new Date(show.date).toLocaleDateString()} {show.time}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Seats:</span>
          <span className="font-semibold">{selectedSeats.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span>Tickets:</span>
          <span>
            {selectedSeats.length} × ₹{show.price}
          </span>
        </div>
        <hr />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <button
        onClick={() =>
          onConfirmBooking({
            showId: show._id,
            seats: selectedSeats,
            totalAmount,
          })
        }
        disabled={loading || selectedSeats.length === 0}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>
  );
};

// Enhanced Movie Details Component
const MovieDetails = ({ movie, onBack, onBookNow }) => {
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchShows();
  }, [movie._id, selectedDate]);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const data = await api.getShows(movie._id, selectedDate);
      setShows(data);
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (show) => {
    if (!user) {
      alert("Please log in to book tickets.");
      onBookNow(show, false);
    } else {
      onBookNow(show, true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={onBack}
            className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/20 transition-all duration-300">
              <svg
                className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">Back to Movies</span>
          </button>

          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                {movie.title}
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="font-bold">{movie.rating}/10</span>
              </div>
              <span className="w-2 h-2 bg-white/50 rounded-full"></span>
              <span>{movie.duration} minutes</span>
              <span className="w-2 h-2 bg-white/50 rounded-full"></span>
              <span>{movie.genre}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="lg:flex">
            <div className="lg:w-2/5 relative">
              <div className="relative group overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-96 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-lg">{movie.rating}</span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-sm font-medium opacity-90">
                      Starting from
                    </div>
                    <div className="text-2xl font-black">₹{movie.price}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/5 p-8 lg:p-12">
              <div className="space-y-8">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full font-semibold border border-purple-200">
                    {movie.genre}
                  </span>
                  <span className="bg-gradient-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full font-semibold border border-green-200">
                    {movie.language}
                  </span>
                  <span className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-4 py-2 rounded-full font-semibold border border-yellow-200">
                    {movie.duration} min
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Synopsis
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      Director
                    </h4>
                    <p className="text-gray-700 font-semibold">
                      {movie.director}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      Release Date
                    </h4>
                    <p className="text-gray-700 font-semibold">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
                    <User className="h-6 w-6 mr-3 text-purple-600" />
                    Cast
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {movie.cast.map((actor, index) => (
                      <span
                        key={index}
                        className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:border-purple-300 hover:text-purple-700 transition-colors duration-300"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Loading Shows...
              </h3>
              <p className="text-gray-500">
                Finding the best showtimes for you
              </p>
            </div>
          </div>
        ) : shows.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">Book Your Show</h3>
                  <p className="text-purple-100">
                    Select your preferred date and showtime
                  </p>
                </div>
                <div className="mt-6 lg:mt-0">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <ShowTimes
                shows={shows}
                onShowSelect={handleShowSelect}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                No Shows Available
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Sorry, there are no shows available for the selected date.
                Please try a different date.
              </p>
              <button
                onClick={() =>
                  setSelectedDate(new Date().toISOString().split("T")[0])
                }
                className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Try Today's Shows
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Booking Page Component
const BookingPage = ({ show, onBack, onBookingComplete }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else if (prev.length < 10) {
        return [...prev, seatId];
      }
      return prev;
    });
  };

  const handleConfirmBooking = async (bookingData) => {
    if (!token) {
      alert("Please login to book tickets");
      return;
    }

    setLoading(true);
    try {
      const response = await api.createBooking(bookingData, token);
      if (response.booking) {
        onBookingComplete(response.booking);
      } else {
        alert(response.message || "Booking failed");
      }
    } catch (error) {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={onBack}
          className="mb-6 text-purple-600 hover:text-purple-800 flex items-center space-x-2"
        >
          <span>← Back to Movie Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SeatSelection
              show={show}
              onSeatSelect={handleSeatSelect}
              selectedSeats={selectedSeats}
            />
          </div>
          <div>
            <BookingSummary
              show={show}
              selectedSeats={selectedSeats}
              onConfirmBooking={handleConfirmBooking}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// My Bookings Component
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingIds, setCancellingIds] = useState(new Set());
  const [walletBalance, setWalletBalance] = useState(0);
  const [refundNotifications, setRefundNotifications] = useState(new Map());
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchWalletBalance();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings(token);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const data = await api.getWalletBalance(token);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleCancelBooking = async (bookingId, movieTitle, totalAmount) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your booking for "${movieTitle}"?\n\nRefund amount ₹${totalAmount} will be credited to your wallet in 5-7 seconds.`
    );

    if (!confirmCancel) {
      return;
    }

    setCancellingIds((prev) => new Set(prev).add(bookingId));

    try {
      const response = await api.cancelBooking(bookingId, token);

      if (response.message) {
        // Update booking status locally
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );

        // Show refund notification
        setRefundNotifications((prev) =>
          new Map(prev).set(bookingId, {
            amount: totalAmount,
            timestamp: Date.now(),
          })
        );

        // Simulate wallet update after delay
        setTimeout(() => {
          setWalletBalance((prev) => prev + totalAmount);

          // Remove notification after wallet is updated
          setTimeout(() => {
            setRefundNotifications((prev) => {
              const newMap = new Map(prev);
              newMap.delete(bookingId);
              return newMap;
            });
          }, 3000);
        }, Math.floor(Math.random() * 3000) + 5000); // 5-7 seconds

        alert(
          "Booking cancelled successfully! Refund will be credited to your wallet shortly."
        );
      } else {
        alert(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Loading your bookings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              My Bookings
            </span>
          </h1>
          <p className="text-lg text-gray-300 text-center">
            Manage your movie bookings and view booking history
          </p>
        </div>
        {/* <div className="flex justify-center mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                💰
              </div>
              <div>
                <div className="text-sm text-gray-300">Wallet Balance</div>
                <div className="text-xl font-bold text-white">
                  ₹{walletBalance}
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Refund Notifications */}
        {refundNotifications.size > 0 && (
          <div className="mb-6">
            {Array.from(refundNotifications.entries()).map(
              ([bookingId, notification]) => (
                <div
                  key={bookingId}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <div className="font-semibold text-blue-800">
                        Processing Refund
                      </div>
                      <div className="text-blue-600">
                        ₹{notification.amount} will be credited to your wallet
                        shortly...
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-8">
              You haven't made any movie bookings yet. Start exploring our
              latest movies!
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => {
              const isCancelling = cancellingIds.has(booking._id);
              const isCancelled = booking.status === "cancelled";
              const showDate = new Date(booking.show.date);
              const showTime = booking.show.time;
              const [hours, minutes] = showTime.split(":");
              const showDateTime = new Date(showDate);
              showDateTime.setHours(parseInt(hours), parseInt(minutes));
              const hasShowStarted = showDateTime <= new Date();

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                    isCancelled ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-8">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-bold text-xl text-gray-800">
                        {booking.show.movie.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          isCancelled
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isCancelled ? "Cancelled" : "Confirmed"}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-purple-600" />
                        <span className="font-medium">
                          {booking.show.theater.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span>
                          {showDate.toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-green-600" />
                        <span>{booking.show.time}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-orange-600" />
                        <span className="font-semibold">
                          {booking.seats.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="border-t border-gray-100 pt-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Seats:</span>
                        <span className="font-semibold text-gray-800">
                          {booking.seats.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Total Amount:
                        </span>
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                          ₹{booking.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Booking ID:
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {booking._id.slice(-8)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {/* Cancel Button */}
                      {!isCancelled && !hasShowStarted && (
                        <button
                          onClick={() =>
                            handleCancelBooking(
                              booking._id,
                              booking.show.movie.title,
                              booking.totalAmount
                            )
                          }
                          disabled={isCancelling}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isCancelling ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Cancelling...</span>
                            </div>
                          ) : (
                            "Cancel Booking"
                          )}
                        </button>
                      )}

                      {/* View Ticket Button */}
                      <button
                        onClick={() => window.print()}
                        className={`${
                          !isCancelled && !hasShowStarted ? "flex-1" : "w-full"
                        } bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                      >
                        {isCancelled ? "View Cancelled Ticket" : "View Ticket"}
                      </button>
                    </div>

                    {/* Cancellation Info */}
                    {isCancelled && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 text-sm font-medium">
                          ⚠️ This booking has been cancelled. Refund will be
                          processed within 5-7 working days.
                        </p>
                      </div>
                    )}

                    {/* Show Started Info */}
                    {!isCancelled && hasShowStarted && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-gray-600 text-sm">
                          ℹ️ Show has started. Cancellation is no longer
                          available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Movie Card Component
const EnhancedMovieCard = ({ movie, onSelect, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      onClick={() => onSelect(movie)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-80 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-center">
              <Film className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-bounce" />
              <div className="w-20 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? "block" : "hidden"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        <div className="absolute bottom-6 left-6 right-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            Book Now →
          </button>
        </div>

        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
          ⭐ {movie.rating}
        </div>
      </div>

      <div className="p-8">
        <h3 className="font-black text-xl mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-yellow-700">
                {movie.rating}/10
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{movie.duration}m</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-6">
          <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full border border-purple-200">
            {movie.genre}
          </span>
          {/* <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            ₹{movie.price}
          </span> */}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-gray-600">
            <span className="font-medium">Director:</span>
            <span className="font-bold text-gray-800">{movie.director}</span>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <span className="font-medium">Language:</span>
            <span className="font-bold text-gray-800">{movie.language}</span>
          </div>
        </div>

        {/* <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Available Now
            </span>
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Enhanced Home Component
const Home = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await api.getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      await api.seedData();
      alert("Database seeded successfully!");
      fetchMovies();
    } catch (error) {
      alert("Error seeding database");
    }
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-b-blue-600 rounded-full animate-spin mx-auto mt-2 ml-2 animate-reverse"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Loading Movies
          </h3>
          <p className="text-gray-500 animate-pulse">
            Please wait while we fetch the latest movies...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24 lg:py-20">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-white drop-shadow-2xl">
                Book Your
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-2xl">
                Movie Tickets
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-16 text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Experience cinematic magic with premium seats, cutting-edge sound,
              and seamless booking. Your perfect movie night starts here.
            </p>

            <div className="mb-8">
              <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
                🎬 Your Ultimate Movie Experience
              </span>
            </div>

            {/* Premium Search Bar */}
            <div className="max-w-3xl mx-auto relative mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 ml-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for movies, genres, directors, or actors..."
                      className="flex-1 px-6 py-4 bg-transparent text-gray-900 text-lg placeholder-gray-500 border-none outline-none font-medium"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 mr-2">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-yellow-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {movies.length}+
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  Latest Movies
                </div>
                <div className="text-gray-400 text-sm mt-2">Updated daily</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  7+
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  Premium Theaters
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Nationwide coverage
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  5M+
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  Happy Customers
                </div>
                <div className="text-gray-400 text-sm mt-2">5-star rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              <span className="text-purple-600 font-semibold uppercase tracking-wide text-sm">
                Now Playing
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-800 mb-4 leading-tight">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Blockbusters
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover the most anticipated movies of the season, from
              action-packed adventures to heartwarming stories
            </p>
          </div>

          {movies.length === 0 && (
            <div className="flex-shrink-0">
              <button
                onClick={seedDatabase}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <span>Load Sample Data</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              </button>
            </div>
          )}
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-lg mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Film className="h-16 w-16 text-purple-400" />
                </div>
                <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-purple-200 rounded-full animate-ping"></div>
              </div>

              <h3 className="text-3xl font-bold text-gray-700 mb-4">
                {movies.length === 0
                  ? "No Movies Available Yet"
                  : "No Movies Match Your Search"}
              </h3>

              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                {movies.length === 0
                  ? "Get started by loading some sample movies to explore our amazing booking experience."
                  : "Try adjusting your search terms or browse all available movies."}
              </p>

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Clear Search & Show All Movies
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMovies.map((movie, index) => (
              <EnhancedMovieCard
                key={movie._id}
                movie={movie}
                onSelect={onMovieSelect}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Us Component
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert(
        "Thank you for contacting us! We'll get back to you within 24 hours."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Contact Us
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're here to help! Reach out to us for any questions, feedback, or
            support regarding your movie booking experience.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Send us a Message
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as
                possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300"
                >
                  <option value="">Select a subject</option>
                  <option value="booking-support">Booking Support</option>
                  <option value="technical-issue">Technical Issue</option>
                  <option value="payment-inquiry">Payment Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Our Office</h4>
                    <p className="text-gray-600">
                      123 Movie Street
                      <br />
                      Entertainment District
                      <br />
                      Surat, Gujarat 395007
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <div className="h-6 w-6 text-blue-600 flex items-center justify-center font-bold">
                      📧
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Email Us</h4>
                    <p className="text-gray-600">
                      support@movietix.com
                      <br />
                      bookings@movietix.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <div className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">
                      📞
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Call Us</h4>
                    <p className="text-gray-600">
                      +91 98765 43210
                      <br />
                      +91 98765 43211
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">
                Quick Response Guarantee
              </h3>
              <p className="text-purple-100">
                We typically respond to all inquiries within{" "}
                <strong>24 hours</strong>. For urgent matters, call our helpline
                for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Us Component
const AboutUs = () => {
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      image:
        "https://www.mckinsey.com/~/media/mckinsey/business%20functions/strategy%20and%20corporate%20finance/our%20insights/voices%20of%20ceo%20excellence%20mercks%20ken%20frazier/ken-frazier-50-50.jpg?cq=50&mw=1180&car=1:1&cpy=Center",
      description:
        "Passionate about revolutionizing the movie experience with 10+ years in entertainment industry.",
    },
    {
      name: "Priyansh Sharma",
      role: "CTO",
      image: "https://newsroom.paypal-corp.com/image/SriniVenkatesan_3x2.png",
      description:
        "Tech enthusiast leading our digital transformation with expertise in web and mobile technologies.",
    },
    {
      name: "Amit Patel",
      role: "Head of Operations",
      image:
        "https://travelmail.in/wp-content/uploads/2024/07/Santoshkumar-Hiremath-as-CX-Leader-and-Head-of-Operations.jpg",
      description:
        "Ensuring seamless operations across all theaters with focus on customer satisfaction.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "MovieTix was born with a vision to simplify movie bookings",
    },
    {
      year: "2021",
      title: "1M+ Users",
      description: "Reached our first million happy customers",
    },
    {
      year: "2022",
      title: "50+ Cities",
      description: "Expanded to major cities across India",
    },
    {
      year: "2023",
      title: "100+ Theaters",
      description: "Partnered with premium theater chains",
    },
    {
      year: "2024",
      title: "Innovation",
      description: "Launched advanced seat selection and booking features",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              About MovieTix
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to make movie-going magical. From finding the
            perfect show to booking the best seats, we're here to enhance your
            cinematic journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4"></div>
              <span className="text-purple-600 font-semibold uppercase tracking-wide text-sm">
                Our Story
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
              Where Cinema Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Innovation
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Founded in 2020, MovieTix started with a simple belief: booking
              movie tickets shouldn't be complicated. What began as a small
              startup has grown into India's most loved movie booking platform,
              serving millions of movie enthusiasts across the country.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've revolutionized the way people discover, book, and enjoy
              movies by combining cutting-edge technology with a deep
              understanding of what movie lovers truly want.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-400 to-blue-500 rounded-3xl p-8 text-white">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-4xl font-black mb-2">5M+</div>
                  <div className="text-purple-100">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">100+</div>
                  <div className="text-purple-100">Theater Partners</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">50+</div>
                  <div className="text-purple-100">Cities Covered</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-2">10M+</div>
                  <div className="text-purple-100">Tickets Booked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind MovieTix's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>
                  <div className="text-purple-600 font-semibold mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Page Component
const PaymentPage = ({ booking, onBack, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    upiId: '',
    wallet: 'paytm'
  });
  const [errors, setErrors] = useState({});
  const { token } = useAuth();

  // Fetch wallet balance on component mount
  useEffect(() => {
    if (token) {
      fetchWalletBalance();
    }
  }, [token]);

  const fetchWalletBalance = async () => {
    try {
      const data = await api.getWalletBalance(token);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      if (!formData.cardName || formData.cardName.length < 3) {
        newErrors.cardName = 'Please enter the cardholder name';
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiry = 'Please enter expiry date';
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId || !formData.upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    } else if (paymentMethod === 'wallet-external') {
      // No validation needed for external wallet
    } else if (paymentMethod === 'movietix-wallet') {
      if (walletBalance < booking.totalAmount) {
        newErrors.wallet = `Insufficient balance. Available: ₹${walletBalance}, Required: ₹${booking.totalAmount}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      let paymentResult;
      
      if (paymentMethod === 'movietix-wallet') {
        // Pay using MovieTix Wallet
        const response = await api.walletPayment({
          showId: booking.show._id,
          seats: booking.seats,
          totalAmount: booking.totalAmount
        }, token);
        
        if (response.booking) {
          paymentResult = {
            success: true,
            transactionId: `WALLET${Date.now()}`,
            paymentMethod: 'MovieTix Wallet',
            amount: booking.totalAmount,
            newWalletBalance: response.newWalletBalance
          };
        } else {
          throw new Error(response.message || 'Wallet payment failed');
        }
      } else {
        // Simulate other payment methods
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        paymentResult = {
          success: true,
          transactionId: `TXN${Date.now()}`,
          paymentMethod: paymentMethod,
          amount: booking.totalAmount
        };
      }

      onPaymentComplete(paymentResult);
    } catch (error) {
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return year.toString().slice(-2);
  });

  const canPayWithWallet = walletBalance >= booking.totalAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={onBack}
            className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/20 transition-all duration-300">
              <svg className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Back to Booking</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                Secure Payment
              </span>
            </h1>
            <p className="text-lg text-gray-300">Complete your booking with our secure payment gateway</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Choose Payment Method</h2>

              {/* Payment Method Tabs */}
              <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-2xl">
                <button
                  onClick={() => setPaymentMethod('movietix-wallet')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    paymentMethod === 'movietix-wallet'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  💰 MovieTix Wallet
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    paymentMethod === 'card'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    paymentMethod === 'upi'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📱 UPI
                </button>
                <button
                  onClick={() => setPaymentMethod('wallet-external')}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    paymentMethod === 'wallet-external'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  💰 Other Wallets
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {/* MovieTix Wallet Payment */}
                {paymentMethod === 'movietix-wallet' && (
                  <div className="space-y-6">
                    <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">💰</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Pay with MovieTix Wallet</h3>
                      
                      <div className="bg-white rounded-xl p-4 mx-8 mb-6 shadow-sm border">
                        <div className="text-sm text-gray-600 mb-2">Available Balance</div>
                        <div className="text-3xl font-black text-green-600">₹{walletBalance}</div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 mx-8 shadow-sm border">
                        <div className="text-sm text-gray-600 mb-2">Amount to Pay</div>
                        <div className="text-2xl font-bold text-gray-800">₹{booking.totalAmount}</div>
                      </div>
                      
                      {!canPayWithWallet && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mx-8 mt-4">
                          <p className="text-red-700 font-medium">
                            ⚠️ Insufficient wallet balance. You need ₹{booking.totalAmount - walletBalance} more.
                          </p>
                        </div>
                      )}
                      
                      {canPayWithWallet && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mx-8 mt-4">
                          <p className="text-green-700 font-medium">
                            ✅ Your wallet balance is sufficient for this payment!
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.wallet && <p className="text-red-500 text-sm text-center">{errors.wallet}</p>}
                  </div>
                )}

                {/* Card Payment Form - Your existing card form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-6">
                    {/* Your existing card payment form */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange({
                          target: {
                            name: 'cardNumber',
                            value: formatCardNumber(e.target.value)
                          }
                        })}
                        maxLength="19"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                          errors.cardNumber ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    {/* Add rest of your card form fields here */}
                  </div>
                )}

                {/* UPI Payment Form - Your existing UPI form */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">📱</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Pay with UPI</h3>
                      <p className="text-gray-600">Enter your UPI ID to complete the payment</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID *</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                          errors.upiId ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                        }`}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
                    </div>
                  </div>
                )}

                {/* External Wallets - Updated to remove Amazon Pay */}
                {paymentMethod === 'wallet-external' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">💰</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Wallet</h3>
                      <p className="text-gray-600">Select your preferred digital wallet</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'paytm', name: 'Paytm', icon: '💜' },
                        { id: 'phonepe', name: 'PhonePe', icon: '💙' },
                        { id: 'googlepay', name: 'Google Pay', icon: '💚' }
                        // Removed Amazon Pay from here
                      ].map(wallet => (
                        <label key={wallet.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="wallet"
                            value={wallet.id}
                            checked={formData.wallet === wallet.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`border-2 rounded-xl p-4 text-center transition-all duration-300 ${
                            formData.wallet === wallet.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <div className="text-3xl mb-2">{wallet.icon}</div>
                            <div className="font-semibold text-gray-800">{wallet.name}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing || (paymentMethod === 'movietix-wallet' && !canPayWithWallet)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : paymentMethod === 'movietix-wallet' ? (
                    `Pay ₹${booking.totalAmount} from Wallet`
                  ) : (
                    `Pay ₹${booking.totalAmount}`
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-semibold">100% Secure Payment</span>
                </div>
                <p className="text-green-600 text-sm mt-1">Your payment information is protected with bank-level security</p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie:</span>
                  <span className="font-semibold text-gray-800">{booking.show.movie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theater:</span>
                  <span className="text-gray-800">{booking.show.theater.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="text-gray-800">
                    {new Date(booking.show.date).toLocaleDateString()} {booking.show.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-semibold text-gray-800">{booking.seats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="text-gray-800">{booking.seats.length} × ₹{booking.show.price}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Your Wallet Balance</div>
                  <div className="text-3xl font-black">₹{walletBalance}</div>
                </div>
                <div className="text-4xl">💰</div>
              </div>
              {canPayWithWallet && (
                <div className="mt-4 bg-white/20 rounded-xl p-3">
                  <p className="text-sm font-medium">✅ You can pay for this booking using your wallet!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Payment Success Component
const PaymentSuccess = ({ paymentResult, booking, onGoHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">Your booking has been confirmed</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-semibold">
                {paymentResult.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Movie:</span>
              <span className="font-semibold">{booking.show.movie.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Seats:</span>
              <span className="font-semibold">{booking.seats.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-green-600">
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Download Ticket
          </button>
          <button
            onClick={onGoHome}
            className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
          >
            Book Another Movie
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component - Add this to your App.js file
const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white mt-auto">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} className="h-12 w-auto" alt="logo" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                MovieTix
              </h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Your ultimate destination for seamless movie ticket booking.
              Experience cinema like never before with premium seats and
              cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              {/* <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-xl">📱</span>
              </div> */}
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-xl">📧</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-xl">🌐</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Trending Movies
                </button>
              </li>
              <li>
                {/* <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Theater Locations
                </button> */}
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Offers & Deals
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Gift Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-purple-300">Support</h4>
            <ul className="space-y-3">
              {/* <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Help Center
                </button>
              </li> */}
              <li>
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  Booking Guide
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors duration-300 text-left">
                  FAQs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl font-black text-yellow-400 mb-2">5M+</div>
            <div className="text-gray-300 text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-green-400 mb-2">7+</div>
            <div className="text-gray-300 text-sm">Premium Theaters</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">50+</div>
            <div className="text-gray-300 text-sm">Cities Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-purple-400 mb-2">10M+</div>
            <div className="text-gray-300 text-sm">Tickets Booked</div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-300">
              © 2025 <span className="font-bold text-white">MovieTix</span>. All
              rights reserved.
            </p>
            {/* <p className="text-sm text-gray-400 mt-1">
              Designed with ❤️ for movie lovers
            </p> */}
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <button className="text-gray-300 hover:text-white transition-colors duration-300">
              Privacy Policy
            </button>
            <button className="text-gray-300 hover:text-white transition-colors duration-300">
              Terms of Service
            </button>
            <button className="text-gray-300 hover:text-white transition-colors duration-300">
              Cookie Policy
            </button>
            <button className="text-gray-300 hover:text-white transition-colors duration-300">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [authRedirect, setAuthRedirect] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && authRedirect) {
      setSelectedShow(authRedirect.show);
      setCurrentPage("booking");
      setAuthRedirect(null);
    }
  }, [user, authRedirect]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage("movie-details");
  };

  const handleShowSelect = (show, proceed) => {
    if (proceed) {
      setSelectedShow(show);
      setCurrentPage("booking");
    } else {
      setAuthRedirect({ show: show });
      setCurrentPage("auth");
    }
  };

  const handleBookingComplete = (booking) => {
    setBookingData(booking);
    setCurrentPage("payment");
  };

  const handlePaymentComplete = (paymentResult) => {
    setPaymentResult(paymentResult);
    setCurrentPage("payment-success");
  };

  const renderPage = () => {
    if (
      !user &&
      (currentPage === "bookings" ||
        currentPage === "booking" ||
        currentPage === "payment")
    ) {
      return <AuthComponent setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case "auth":
        return <AuthComponent setCurrentPage={setCurrentPage} />;
      case "about":
        return <AboutUs />;
      case "contact":
        return <ContactUs />;
      case "movie-details":
        return (
          <MovieDetails
            movie={selectedMovie}
            onBack={() => setCurrentPage("home")}
            onBookNow={handleShowSelect}
          />
        );
      case "booking":
        return (
          <BookingPage
            show={selectedShow}
            onBack={() => setCurrentPage("movie-details")}
            onBookingComplete={handleBookingComplete}
          />
        );
      case "payment":
        return (
          <PaymentPage
            booking={bookingData}
            onBack={() => setCurrentPage("booking")}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      case "payment-success":
        return (
          <PaymentSuccess
            paymentResult={paymentResult}
            booking={bookingData}
            onGoHome={() => {
              setCurrentPage("home");
              setBookingData(null);
              setPaymentResult(null);
            }}
          />
        );
      case "bookings":
        return <MyBookings />;
      default:
        return <Home onMovieSelect={handleMovieSelect} />;
    }
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Main component with AuthProvider
const MovieTicketBookingApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default MovieTicketBookingApp;
