import React, { useEffect, useState, useRef } from "react";
import { User, LogOut, ChevronDown, LayoutDashboard, Ticket } from "lucide-react";
import logo from "../logo.png";
import { useAuth } from "../Contexts/AuthProvider";

export const Header = ({ currentPage, setCurrentPage }) => {
  const { user, logout, token, walletBalance, refreshWalletBalance } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && token) {
        refreshWalletBalance();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [user, token, refreshWalletBalance]);

  return (
    <header className="bg-gradient-to-r sticky top-0 z-50 from-purple-900 via-purple-800 to-indigo-900 text-white shadow-2xl">
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
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${currentPage === "home"
                ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                : "hover:scale-105"
                }`}
            >
              Movies
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${currentPage === "about"
                ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                : "hover:scale-105"
                }`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${currentPage === "contact"
                ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                : "hover:scale-105"
                }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setCurrentPage("upcoming-movies")}
              className={`relative px-3 py-2 font-semibold transition-all duration-300 hover:text-purple-300 ${currentPage === "upcoming-movies"
                ? "text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-300"
                : "hover:scale-105"
                }`}
            >
              Upcoming Movies
            </button>
            {/* My Bookings removed from here */}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Wallet Display - Kept visible for easy access */}
                <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-300">💰</span>
                    <span className="text-white font-semibold">
                      ₹{walletBalance}
                    </span>
                  </div>
                </div>

                {/* Profile Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none"
                  >
                    <div className="relative">
                      <User className="h-6 w-6 text-purple-300" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-semibold text-white">
                        {user.name}
                      </div>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Content */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 text-gray-800 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold truncate" title={user.email}>{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentPage("profile");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <User size={16} className="mr-3 text-purple-500" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage("bookings");
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <Ticket size={16} className="mr-3 text-purple-500" />
                          My Bookings
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentPage("admin-dashboard");
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                          >
                            <LayoutDashboard size={16} className="mr-3 text-blue-500" />
                            Admin Panel
                          </button>
                        )}
                      </div>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
            {/* Admin Panel button is now inside the dropdown */}
          </div>
        </div>
      </div>
    </header>
  );
};
