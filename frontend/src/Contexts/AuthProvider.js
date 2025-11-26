import React, { useState, useEffect, createContext, useContext } from "react";


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

export default AuthProvider;