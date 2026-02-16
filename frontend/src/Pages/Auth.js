import React, { useState } from "react";
import { User, Film, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "../Contexts/AuthProvider";
import {
    validateName,
    validateEmail,
    validatePassword,
    validatePhone,
} from "../utils/validation";

export const AuthComponent = ({ setCurrentPage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Validate Email
        const emailError = validateEmail(formData.email);
        if (emailError) {
            errors.email = emailError;
            isValid = false;
        }

        // Validate Password
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            errors.password = passwordError;
            isValid = false;
        }

        if (!isLogin) {
            // Validate Name
            const nameError = validateName(formData.name);
            if (nameError) {
                errors.name = nameError;
                isValid = false;
            }

            // Validate Phone
            const phoneError = validatePhone(formData.phone);
            if (phoneError) {
                errors.phone = phoneError;
                isValid = false;
            }
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = isLogin
                ? await login({
                      email: formData.email,
                      password: formData.password,
                  })
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
        // Clear error for the field being edited
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: null,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Main Card Container */}
            <div className="max-w-5xl w-full bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
                {/* Left Side - Branding (45% width on desktop) */}
                <div className="md:w-[45%] bg-gradient-to-br from-indigo-600/90 to-blue-700/90 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative circles inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-10">
                            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <Film className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-wider drop-shadow-md">
                                MovieTix
                            </span>
                        </div>

                        <h2 className="text-4xl font-extrabold mb-6 leading-tight drop-shadow-md">
                            {isLogin ? "Welcome Back!" : "Join the Experience"}
                        </h2>
                        <p className="text-indigo-100 text-base leading-relaxed font-light opacity-90">
                            {isLogin
                                ? "Sign in to access your bookings, tailored recommendations, and exclusive offers."
                                : "Create an account to start your cinema journey. Get access to express booking and more."}
                        </p>
                    </div>

                    {/* <div className="relative z-10 mt-12 md:mt-0">
                        <div className="bg-gradient-to-r from-white/10 to-indigo-600/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 shadow-inner">
                            <div className="flex text-yellow-300 mb-2 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-sm text-white/90 italic mb-3">
                                "The visuals are stunning and the booking
                                process is so smooth!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold shadow-md">
                                    AS
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-semibold">
                                        Alex Smith
                                    </p>
                                    <p className="text-[10px] text-indigo-200 uppercase tracking-wide">
                                        Verified Fan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Right Side - Form (55% width on desktop) */}
                <div className="md:w-[55%] p-8 md:p-12 bg-white">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {isLogin ? "Sign In" : "Create Account"}
                        </h3>
                        <p className="text-gray-500 mt-2 text-sm">
                            {isLogin
                                ? "Welcome back! Please enter your details."
                                : "Enter your details to get started."}
                        </p>
                    </div>

                    {/* Custom Round Toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative shadow-inner">
                            {/* Slider Background */}
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isLogin ? "left-1.5" : "left-[calc(50%+3px)]"}`}
                            ></div>

                            <button
                                onClick={() => {
                                    setIsLogin(true);
                                    setFieldErrors({});
                                    setError("");
                                }}
                                className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${isLogin ? "text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => {
                                    setIsLogin(false);
                                    setFieldErrors({});
                                    setError("");
                                }}
                                className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${!isLogin ? "text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="name"
                                            type="text"
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.name ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium`}
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {fieldErrors.name && (
                                        <p className="text-red-500 text-xs ml-1">
                                            {fieldErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                        Phone
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.phone ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium`}
                                            placeholder="1234567890"
                                            minLength={10}
                                            maxLength={10}
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {fieldErrors.phone && (
                                        <p className="text-red-500 text-xs ml-1">
                                            {fieldErrors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.email ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium`}
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-red-500 text-xs ml-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.password ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs ml-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-100 font-medium animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>
                                        {isLogin
                                            ? "Sign In"
                                            : "Get Started Now"}
                                    </span>
                                    <ArrowRight className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <a
                                href="#"
                                className="underline decoration-gray-300 hover:text-indigo-600 hover:decoration-indigo-600 transition-all"
                            >
                                Terms of Service
                            </a>{" "}
                            &{" "}
                            <a
                                href="#"
                                className="underline decoration-gray-300 hover:text-indigo-600 hover:decoration-indigo-600 transition-all"
                            >
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
