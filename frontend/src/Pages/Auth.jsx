import React, { useState } from "react";
import {
    User,
    Mail,
    Lock,
    Phone,
    ArrowRight,
    KeyRound,
} from "lucide-react";
import { useAuth } from "../Contexts/AuthProvider";
import {
    validateName,
    validateEmail,
    validatePassword,
    validatePhone,
} from "../utils/validation";
import logo from "../logo.png";

export const AuthComponent = ({ setCurrentPage }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        otp: "",
        newPassword: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login, register, forgotPassword, resetPassword } = useAuth();

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
        setSuccessMessage("");
        setFieldErrors({});

        if (isForgotPassword) {
            if (!otpSent) {
                const emailError = validateEmail(formData.email);
                if (emailError) {
                    setFieldErrors({ email: emailError });
                    return;
                }
                setLoading(true);
                try {
                    const result = await forgotPassword(formData.email);
                    if (
                        result.message === "OTP sent to your email" ||
                        result.success
                    ) {
                        setOtpSent(true);
                        setSuccessMessage(
                            "OTP sent successfully. Please check your email.",
                        );
                    } else {
                        setError(result.message || "Failed to send OTP");
                    }
                } catch (err) {
                    setError("An error occurred while sending OTP.");
                } finally {
                    setLoading(false);
                }
            } else {
                const errors = {};
                if (!formData.otp || formData.otp.trim().length !== 6) {
                    errors.otp = "Please enter a valid 6-digit OTP";
                }
                const passwordError = validatePassword(formData.newPassword);
                if (passwordError) {
                    errors.newPassword = passwordError;
                }
                if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    return;
                }
                setLoading(true);
                try {
                    const result = await resetPassword({
                        email: formData.email,
                        otp: formData.otp.trim(),
                        newPassword: formData.newPassword,
                    });
                    if (
                        result.message === "Password updated successfully" ||
                        result.success
                    ) {
                        setIsForgotPassword(false);
                        setOtpSent(false);
                        setFormData({
                            ...formData,
                            password: "",
                            otp: "",
                            newPassword: "",
                        });
                        setSuccessMessage(
                            "Password reset successful. Please sign in.",
                        );
                    } else {
                        setError(result.message || "Failed to reset password");
                    }
                } catch (err) {
                    setError("An error occurred while resetting password.");
                } finally {
                    setLoading(false);
                }
            }
            return;
        }

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
        <div className="min-h-screen bg-linear-to-br from-purple-500 via-blue-500 to-indigo-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse animation-delay-4000"></div>
            </div>

            {/* Main Card Container */}
            <div className="max-w-5xl w-full bg-white/95 backdrop-blur-sm rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/20">
                {/* Left Side - Branding (45% width on desktop) */}
                <div className="md:w-[45%] bg-linear-to-br from-indigo-600/90 to-blue-700/90 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative circles inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-3">
                            {/* <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                                <Film className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-wider drop-shadow-md">
                                MovieTix
                            </span> */}
                            <img
                                src={logo}
                                alt="MovieTix Logo"
                                className="h-44 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <h2 className="text-4xl font-extrabold mb-6 leading-tight drop-shadow-md">
                            {isForgotPassword
                                ? "Reset Password"
                                : isLogin
                                  ? "Welcome Back!"
                                  : "Join the Experience"}
                        </h2>
                        <p className="text-indigo-100 text-base leading-relaxed font-light opacity-90">
                            {isForgotPassword
                                ? "Enter your email to receive a one-time password to reset your account password securely."
                                : isLogin
                                  ? "Sign in to access your bookings, tailored recommendations, and exclusive offers."
                                  : "Create an account to start your cinema journey. Get access to express booking and more."}
                        </p>
                    </div>

                    {/* <div className="relative z-10 mt-12 md:mt-0">
                        <div className="bg-linear-to-r from-white/10 to-indigo-600/10 rounded-2xl p-5 backdrop-blur-md border border-white/10 shadow-inner">
                            <div className="flex text-yellow-300 mb-2 text-sm">
                                ★★★★★
                            </div>
                            <p className="text-sm text-white/90 italic mb-3">
                                "The visuals are stunning and the booking
                                process is so smooth!"
                            </p>
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold shadow-md">
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
                            {isForgotPassword
                                ? "Account Recovery"
                                : isLogin
                                  ? "Sign In"
                                  : "Create Account"}
                        </h3>
                        <p className="text-gray-500 mt-2 text-sm">
                            {isForgotPassword
                                ? "We'll help you securely get back into your account."
                                : isLogin
                                  ? "Welcome back! Please enter your details."
                                  : "Enter your details to get started."}
                        </p>
                    </div>

                    {/* Custom Round Toggle */}
                    {!isForgotPassword && (
                        <div className="flex justify-center mb-10">
                            <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative shadow-inner">
                                {/* Slider Background */}
                                <div
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out ${isLogin ? "left-1.5" : "left-[calc(50%+3px)]"}`}
                                ></div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(true);
                                        setFieldErrors({});
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${isLogin ? "text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    Sign In
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(false);
                                        setFieldErrors({});
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${!isLogin ? "text-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && !isForgotPassword && (
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
                                    disabled={isForgotPassword && otpSent}
                                    className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.email ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium ${isForgotPassword && otpSent ? "opacity-60 cursor-not-allowed" : ""}`}
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

                        {isForgotPassword && otpSent && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                        6-Digit OTP
                                    </label>
                                    <div className="relative group">
                                        <KeyRound className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="otp"
                                            type="text"
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.otp ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium tracking-widest`}
                                            placeholder="123456"
                                            maxLength={6}
                                            value={formData.otp}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {fieldErrors.otp && (
                                        <p className="text-red-500 text-xs ml-1">
                                            {fieldErrors.otp}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 ml-1 uppercase tracking-wider">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            name="newPassword"
                                            type="password"
                                            className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${fieldErrors.newPassword ? "border-red-500" : "border-gray-200"} rounded-xl focus:bg-white focus:ring-[3px] focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-sm font-medium`}
                                            placeholder="••••••••"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {fieldErrors.newPassword && (
                                        <p className="text-red-500 text-xs ml-1">
                                            {fieldErrors.newPassword}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {!isForgotPassword && (
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
                        )}

                        {error && (
                            <div className="text-red-500 text-xs text-center bg-red-50 p-2.5 rounded-xl border border-red-100 font-medium animate-shake">
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="text-green-600 text-xs text-center bg-green-50 p-2.5 rounded-xl border border-green-100 font-medium">
                                {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>
                                        {isForgotPassword
                                            ? otpSent
                                                ? "Verify & Reset Password"
                                                : "Send Reset OTP"
                                            : isLogin
                                              ? "Sign In"
                                              : "Get Started Now"}
                                    </span>
                                    <ArrowRight className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                          {isLogin && !isForgotPassword && (
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError("");
                                        setSuccessMessage("");
                                        setFieldErrors({});
                                    }}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div> 
                        )}

                        {isForgotPassword && (
                            <div className="flex justify-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(false);
                                        setOtpSent(false);
                                        setError("");
                                        setSuccessMessage("");
                                        setFieldErrors({});
                                    }}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <a
                                href="/terms-of-service"
                                className="underline decoration-gray-300 hover:text-indigo-600 hover:decoration-indigo-600 transition-all"
                            >
                                Terms of Service
                            </a>{" "}
                            &{" "}
                            <a
                                href="/privacy-policy"
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
