import React, {
  useState
} from "react";
import { User, Film } from "lucide-react";
import { useAuth } from "../App";

export const AuthComponent = ({ setCurrentPage }) => {
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