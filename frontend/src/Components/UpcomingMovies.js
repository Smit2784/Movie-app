import React, { useState, useEffect , useRef } from "react";
import { Calendar, Film , Search } from "lucide-react";
import { api } from "../App";

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

const UpcomingMovieCard = ({ movie, onSelect, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get status color for upcoming movies
  const getStatusColor = (status) => {
    switch (status) {
      case "Coming Soon":
        return "bg-green-500";
      case "In Production":
        return "bg-blue-500";
      case "Pre-Production":
        return "bg-yellow-500";
      case "Announced":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // Format release date countdown
  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Released";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 30) return `${diffDays} days to go`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months to go`;
    return `${Math.ceil(diffDays / 365)} years to go`;
  };

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
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450/6366f1/ffffff?text=Coming+Soon";
            setImageLoaded(true);
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

        {/* Coming Soon Button instead of Book Now */}
        <div className="absolute bottom-6 left-6 right-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
          <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm">
            Notify Me 🔔
          </button>
        </div>

        {/* Status Badge */}
        <div
          className={`absolute top-4 left-4 ${getStatusColor(
            movie.status
          )} text-white px-3 py-1 rounded-full text-sm font-bold`}
        >
          {movie.status}
        </div>

        {/* Rating Badge
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
          ⭐ {movie.rating}
        </div> */}

        {/* Countdown Badge */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {formatReleaseDate(movie.releaseDate)}
        </div>
      </div>

      <div className="p-8">
        <h3 className="font-black text-xl mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {movie.title}
        </h3>

        {/* <div className="flex items-center justify-between mb-6">
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
        </div> */}

        <div className="flex items-center justify-center mb-6">
          <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-bold px-4 py-2 rounded-full border border-purple-200">
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
          <div className="flex items-center justify-between text-gray-600">
            <span className="font-medium">Release:</span>
            <span className="font-bold text-purple-600">
              {new Date(movie.releaseDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          {/* <div className="flex items-center justify-between text-gray-600">
            <span className="font-medium">Price:</span>
            <span className="font-bold text-green-600">₹{movie.price}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// Complete UpcomingMovies Component with Your Enhanced Card Style
export const UpcomingMovies = ({ onMovieSelect, onGoHome }) => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // ✅ UPDATED: Fetch upcoming movies from the new API
  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍 Fetching upcoming movies from API...");

        // Build categories array for API call
        const categories =
          selectedCategory !== "All" ? [selectedCategory] : null;

        // ✅ Call the new upcoming movies API
        const data = await api.getUpcomingMovies(categories, searchTerm);

        console.log("📊 Received upcoming movies:", data);
        console.log(
          "📊 Data type:",
          typeof data,
          "Is array:",
          Array.isArray(data)
        );

        // Ensure data is an array
        if (Array.isArray(data)) {
          setUpcomingMovies(data);
        } else {
          console.warn("⚠️ API returned non-array data:", data);
          setUpcomingMovies([]);
        }
      } catch (error) {
        console.error("❌ Error fetching upcoming movies:", error);
        setError("Failed to load upcoming movies. Please try again.");
        setUpcomingMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [selectedCategory, searchTerm]); // Re-fetch when filters change

  // ✅ UPDATED: Seed upcoming movies function
  const seedUpcomingMovies = async () => {
    try {
      setLoading(true);
      console.log("🌱 Starting seed process...");

      const result = await api.seedUpcomingMovies();
      console.log("🎉 Seed result:", result);

      if (result.success) {
        if (result.skipReason === "already_exists") {
          alert(
            `${result.moviesCount} upcoming movies already exist in the database!`
          );
        } else {
          alert(
            `Successfully added ${result.moviesCount} upcoming movies to the database!`
          );
        }

        // ✅ Refresh the movies list after seeding
        const data = await api.getUpcomingMovies();
        setUpcomingMovies(Array.isArray(data) ? data : []);
      } else {
        console.error("Seed failed:", result);
        alert(
          `Error: ${result.message}\nDetails: ${
            result.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("❌ Seed error:", error);
      alert(
        `Error seeding upcoming movies:\n${error.message}\n\nCheck the browser console for more details.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Get status from release date
  const getMovieStatus = (releaseDate) => {
    const now = new Date();
    const release = new Date(releaseDate);
    const diffDays = Math.ceil((release - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Released";
    if (diffDays <= 30) return "Coming Soon";
    if (diffDays <= 90) return "In Production";
    if (diffDays <= 365) return "Post-Production";
    return "Announced";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-b-blue-600 rounded-full animate-spin mx-auto mt-2 ml-2 animate-reverse"></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Loading Upcoming Movies
          </h3>
          <p className="text-gray-500 animate-pulse">
            Fetching from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={onGoHome}
              className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>

            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-white drop-shadow-2xl">Upcoming</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 drop-shadow-2xl">
                Blockbusters
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-16 text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Get ready for the most anticipated movies coming to theaters. From
              superhero epics to heartwarming dramas - the future of cinema
              awaits.
            </p>

            <div className="mb-8">
              <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-6">
                🎭 Coming Soon to MovieTix
              </span>
            </div>

            {/* Search and Filter */}
            <SearchAndCategoryFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-pink-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {upcomingMovies.length}+
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  Upcoming Movies
                </div>
                <div className="text-gray-400 text-sm mt-2">From database</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  More Coming
                </div>
                <div className="text-gray-400 text-sm mt-2">This year</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="text-5xl font-black text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-gray-200 font-medium text-lg">
                  Early Access
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Book in advance
                </div>
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
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
              <span className="text-purple-600 font-semibold uppercase tracking-wide text-sm">
                Coming Soon
              </span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-800 mb-4 leading-tight">
              Future{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Cinema
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Be the first to experience the most awaited movies of the year
            </p>

            {/* Results Summary */}
            {upcomingMovies.length > 0 && (
              <div className="mt-6">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-purple-600">
                    {upcomingMovies.length}
                  </span>{" "}
                  upcoming movies
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

          {/* Seed Button - Show if no movies */}
          {upcomingMovies.length === 0 && !error && (
            <div className="flex-shrink-0">
              <button
                onClick={seedUpcomingMovies}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <span>Add Upcoming Movies</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-24">
            <div className="max-w-lg mx-auto">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="h-16 w-16 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">
                Error Loading Movies
              </h3>
              <p className="text-lg text-gray-500 mb-10">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid or Empty State */}
        {!error && upcomingMovies.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-lg mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-16 w-16 text-purple-400" />
                </div>
                <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-purple-200 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">
                No Upcoming Movies Found
              </h3>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                {searchTerm || selectedCategory !== "All"
                  ? "Try adjusting your search terms or browse all categories"
                  : "No upcoming movies in the database yet. Add some to get started!"}
              </p>
              <button
                onClick={seedUpcomingMovies}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Add Upcoming Movies 🎬
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {upcomingMovies.map((movie, index) => (
              <UpcomingMovieCard
                key={movie._id}
                movie={{
                  ...movie,
                  status: getMovieStatus(movie.releaseDate), // Add dynamic status
                }}
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
