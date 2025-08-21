import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { Search, Clock, Star, Film } from "lucide-react";

import { AuthComponent } from "./Components/AuthComponent.js";
import { Header } from "./Components/Header.js";
import { AboutUs } from "./Components/AboutUs.js";
import { ContactUs } from "./Components/ContactUs.js";
import { MyBookings } from "./Components/MyBookings.js";
import { MovieDetails,BookingPage } from "./Components/MovieDetails.js";
import { PaymentPage } from "./Components/PaymentPage.js";
import { FAQ } from "./Components/FAQ.js";
import { BookingGuide } from "./Components/Bookingguide.js";
import { UpcomingMovies } from "./Components/UpcomingMovies.js";
import { PaymentSuccess } from "./Components/PaymentSuccess.js";
import { Footer } from "./Components/Footer.js";

// Context for authentication
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API Base URL
export const API_BASE_URL = "http://localhost:5000/api";

// API Functions
export const api = {
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

  getUpcomingMovies: async (categories, search) => {
    try {
      const params = new URLSearchParams();
      if (categories && categories.length > 0) {
        params.append("categories", categories.join(","));
      }
      if (search) {
        params.append("search", search);
      }

      console.log(
        "🔍 Fetching upcoming movies with params:",
        params.toString()
      );
      const response = await fetch(`${API_BASE_URL}/upcoming-movies?${params}`);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch upcoming movies`
        );
      }

      const result = await response.json();
      console.log("📊 Upcoming movies received:", result.length);
      return result;
    } catch (error) {
      console.error("❌ Get upcoming movies error:", error);
      throw error;
    }
  },

  // Seed upcoming movies
  seedUpcomingMovies: async () => {
    try {
      console.log("🌱 Calling upcoming movies seed API...");
      const response = await fetch(`${API_BASE_URL}/seed-upcoming-movies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🔍 Response status:", response.status);
      const result = await response.json();
      console.log("📋 Seed API Response:", result);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${result.message || result.error}`
        );
      }

      return result;
    } catch (error) {
      console.error("❌ Seed API Error:", error);
      throw error;
    }
  },

  // Get single upcoming movie
  getUpcomingMovie: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upcoming-movies/${id}`);
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Failed to fetch upcoming movie`
        );
      }
      return response.json();
    } catch (error) {
      console.error("❌ Get upcoming movie error:", error);
      throw error;
    }
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

  getTheaters: async () => {
    const response = await fetch(`${API_BASE_URL}/theaters`);
    return response.json();
  },

  // Bookings
  createBooking: async (bookingData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return result;
    } catch (error) {
      throw error;
    }
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
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${API_BASE_URL}/bookings/wallet-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
        signal: controller.signal, // Add timeout signal
      });

      clearTimeout(timeoutId); // Clear timeout if request completes

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Wallet payment failed");
      }
      return result;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Payment request timed out. Please try again.");
      }
      throw error;
    }
  },

  splitPayment: async (bookingData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/split-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Split payment failed");
      }
      return result;
    } catch (error) {
      throw error;
    }
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
  const [walletBalance, setWalletBalance] = useState(0);

  const refreshWalletBalance = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      try {
        const data = await api.getWalletBalance(currentToken);
        if (data.walletBalance !== undefined) {
          setWalletBalance(data.walletBalance);
        }
      } catch (error) {
        console.error("Could not refresh wallet balance:", error);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      refreshWalletBalance();
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
        await refreshWalletBalance();
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
        setWalletBalance(0);
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
    setWalletBalance(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        walletBalance,
        refreshWalletBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//Movie Card Component
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
      </div>
    </div>
  );
};

// Category Dropdown Component
const EnhancedCategoryDropdown = ({ selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    {
      value: "All",
      label: "All Categories",
      icon: "🎬",
      color: "from-gray-500 to-gray-600",
    },
    {
      value: "Action",
      label: "Action",
      icon: "💥",
      color: "from-red-500 to-orange-500",
    },
    {
      value: "Comedy",
      label: "Comedy",
      icon: "😂",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "Drama",
      label: "Drama",
      icon: "🎭",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "Horror",
      label: "Horror",
      icon: "👻",
      color: "from-gray-800 to-black",
    },
    {
      value: "Romance",
      label: "Romance",
      icon: "💕",
      color: "from-pink-500 to-red-500",
    },
    {
      value: "Western",
      label: "Western",
      icon: "🤠",
      color: "from-amber-600 to-orange-700",
    },
    {
      value: "Thriller",
      label: "Thriller",
      icon: "🔪",
      color: "from-gray-700 to-red-800",
    },
    {
      value: "Adventure",
      label: "Adventure",
      icon: "🗺️",
      color: "from-green-500 to-teal-500",
    },
    {
      value: "Animation",
      label: "Animation",
      icon: "🎨",
      color: "from-blue-500 to-purple-500",
    },
    {
      value: "Sci-Fi",
      label: "Sci-Fi",
      icon: "🚀",
      color: "from-cyan-500 to-blue-500",
    },
    {
      value: "Fantasy",
      label: "Fantasy",
      icon: "🧙‍♂️",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get selected category details
  const selectedCategoryData =
    categories.find((cat) => cat.value === selectedCategory) || categories[0];

  const handleCategorySelect = (category) => {
    onCategoryChange(category.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-72 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-6 py-4 flex items-center justify-between hover:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30"
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 bg-gradient-to-r ${selectedCategoryData.color} rounded-full flex items-center justify-center text-white shadow-lg`}
            >
              <span className="text-sm">{selectedCategoryData.icon}</span>
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold text-gray-900">
                {selectedCategoryData.label}
              </div>
              <div className="text-xs text-gray-500">
                {selectedCategory === "All"
                  ? "Browse all genres"
                  : "Movie category"}
              </div>
            </div>
          </div>

          <div
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Enhanced Dropdown Menu (Without Search) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Category Options */}
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2">
                {categories.map((category, index) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-50 group ${
                      selectedCategory === category.value
                        ? "bg-green-50 border-2 border-green-200"
                        : ""
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="text-lg">{category.icon}</span>
                    </div>

                    <div className="flex-1 text-left">
                      <div
                        className={`font-semibold ${
                          selectedCategory === category.value
                            ? "text-green-700"
                            : "text-gray-900"
                        }`}
                      >
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.value === "All"
                          ? "Show all movies"
                          : `${category.label} movies`}
                      </div>
                    </div>

                    {selectedCategory === category.value && (
                      <div className="text-green-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer with stats */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{categories.length} categories available</span>
                <span className="flex items-center space-x-1">
                  <span>Press</span>
                  <kbd className="px-2 py-1 bg-white rounded border text-xs">
                    ESC
                  </kbd>
                  <span>to close</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SearchAndCategoryFilter Component
export const SearchAndCategoryFilter = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      {/* Search and Category Container */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
        {/* Search Bar */}
        <div className="relative group flex-1 max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-2 border border-white/20 shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0 ml-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for movies, genres, directors..."
                className="flex-1 px-6 py-4 bg-transparent text-gray-900 text-lg placeholder-gray-500 border-none outline-none font-medium"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 mr-2">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Category Dropdown */}
        <div className="flex-shrink-0">
          <EnhancedCategoryDropdown
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== "All" || searchTerm) && (
        <div className="flex items-center justify-center space-x-3 mt-6">
          <span className="text-gray-300 text-sm">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-500/30">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-2 hover:text-blue-100 transition-colors duration-200"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== "All" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200 border border-green-500/30">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange("All")}
                className="ml-2 hover:text-green-100 transition-colors duration-200"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Complete Home Component
const Home = ({ onMovieSelect }) => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  // Enhanced filtering logic
  const filteredMovies = movies.filter((movie) => {
    // Filter by search term
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      selectedCategory === "All" ||
      movie.genre.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

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

            {/* Search and Category Filter Component */}
            <SearchAndCategoryFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

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

            {/* Results Summary */}
            {filteredMovies.length > 0 && (
              <div className="mt-6">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-purple-600">
                    {filteredMovies.length}
                  </span>{" "}
                  movies
                  {selectedCategory !== "All" && (
                    <span>
                      {" "}
                      in{" "}
                      <span className="font-semibold">{selectedCategory}</span>
                    </span>
                  )}
                  {searchTerm && (
                    <span>
                      {" "}
                      matching "
                      <span className="font-semibold">{searchTerm}</span>"
                    </span>
                  )}
                </p>
              </div>
            )}
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

              {(searchTerm || selectedCategory !== "All") && (
                <div className="space-x-4">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Show All Categories
                  </button>
                </div>
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
    setBookingData(paymentResult.booking);
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
      case "booking-guide":
        return <BookingGuide />;
      case "faq":
        return <FAQ />;
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
      case "upcoming-movies":
        return (
          <UpcomingMovies
            onMovieSelect={handleMovieSelect}
            onGoHome={() => setCurrentPage("home")}
          />
        );
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