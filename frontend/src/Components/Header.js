import React, {
  useEffect
} from "react";
import {
  User,
  LogOut
} from "lucide-react";
import logo from "../logo.png";
import { useAuth } from "../App";

export const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout, token, walletBalance, refreshWalletBalance } =
    useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && token) {
        refreshWalletBalance();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user, token, refreshWalletBalance]);

  return (
    <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            onClick={() => setCurrentPage("home")}
          >
            <img
              src={logo}
              alt="MovieTix Logo"
              className="h-12 w-15 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              MovieTix
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setCurrentPage("home")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === "home"
                  ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                  : "hover:scale-105"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === "about"
                  ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                  : "hover:scale-105"
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === "contact"
                  ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                  : "hover:scale-105"
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setCurrentPage("upcoming-movies")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                currentPage === "upcoming-movies"
                  ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                  : "hover:scale-105"
              }`}
            >
              Upcoming Movies
            </button>
            {user && (
              <button
                onClick={() => setCurrentPage("bookings")}
                className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${
                  currentPage === "bookings"
                    ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                    : "hover:scale-105"
                }`}
              >
                My Bookings
              </button>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="relative">
                    <User className="h-6 w-6 text-purple-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-white">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300">💰</span>
                    <span className="text-white font-semibold">
                      ₹{walletBalance}
                    </span>
                  </div>
                </div>
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
              <button
                onClick={() => setCurrentPage("auth")}
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