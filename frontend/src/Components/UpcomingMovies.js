import React, { useState, useEffect } from "react";
import { Calendar, Film } from "lucide-react";
import { SearchAndCategoryFilter } from "../App";
import { api } from "../App";

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
