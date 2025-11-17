import React, {
  useState,
  useEffect,
} from "react";
import { api  } from "../App";
import { SearchAndCategoryFilter } from "./UpcomingMovies";
import { Film } from "lucide-react";
import { Star , Clock } from "lucide-react";

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

export default Home;