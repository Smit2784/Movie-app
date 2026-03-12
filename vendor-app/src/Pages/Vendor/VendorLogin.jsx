import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthProvider.jsx";
import { Store, LogIn, Eye, EyeOff } from "lucide-react";

const VendorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login({ email, password });
        setLoading(false);
        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message || "Login failed. Check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                            <Store size={32} className="text-emerald-400" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-white text-center mb-1">
                        Vendor Portal
                    </h1>
                    <p className="text-slate-400 text-sm text-center mb-8">
                        Sign in to manage your theaters & shows
                    </p>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="vendor@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <LogIn size={18} />
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-xs text-slate-600">
                        Vendor access only · MovieTix © 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
