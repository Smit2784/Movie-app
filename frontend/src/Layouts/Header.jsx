import React, { useEffect, useState, useRef } from "react";
import {
    User,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    Ticket,
    Clapperboard,
    Info,
    PhoneCall,
    CalendarDays,
    Wallet,
} from "lucide-react";
import logo from "../logo.png";
import { useAuth } from "../Contexts/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
    const { user, logout, token, walletBalance, refreshWalletBalance } =
        useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Wallet Refresh Logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && token) {
                refreshWalletBalance();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, [user, token, refreshWalletBalance]);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: "Movies", path: "/", icon: <Clapperboard size={16} /> },
        { name: "About Us", path: "/about", icon: <Info size={16} /> },
        { name: "Contact", path: "/contact", icon: <PhoneCall size={16} /> },
        {
            name: "Upcoming",
            path: "/upcoming-movies",
            icon: <CalendarDays size={16} />,
        },
    ];

    return (
        <>
            <header className="sticky top-0 z-100 w-full transition-all duration-300">
                {/* Glassmorphism Background Layer */}
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between h-20">
                        {/* Brand / Logo */}
                        <Link
                            to="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                {/* <div className="absolute inset-0 bg-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div> */}
                                <img
                                    src={logo}
                                    alt="MovieTix Logo"
                                    className="h-15 w-auto relative z-10 transform group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            {/* <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-purple-200 to-purple-400">
                            MovieTix
                        </h1> */}
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                                        isActive(link.path)
                                            ? "bg-white/10 text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    <span
                                        className={
                                            isActive(link.path)
                                                ? "text-purple-400"
                                                : "text-slate-500"
                                        }
                                    >
                                        {link.icon}
                                    </span>
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Action Area */}
                        <div className="flex items-center space-x-3">
                            {user ? (
                                <>
                                    {/* Premium Wallet Display */}
                                    <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shadow-inner">
                                        <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
                                            <Wallet
                                                size={16}
                                                className="text-amber-400"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                                                Balance
                                            </span>
                                            <span className="text-white font-black text-sm">
                                                ₹{walletBalance}
                                            </span>
                                        </div>
                                    </div>

                                    {/* User Dropdown */}
                                    <div className="relative" ref={menuRef}>
                                        <button
                                            onClick={() =>
                                                setIsMenuOpen(!isMenuOpen)
                                            }
                                            className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all duration-300 ${
                                                isMenuOpen
                                                    ? "bg-purple-600 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className="w-9 h-9 bg-linear-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="hidden md:block text-left">
                                                <p className="text-xs font-black text-white leading-tight">
                                                    {user.name}
                                                </p>
                                                <p className="text-[10px] font-bold text-purple-300/70 uppercase tracking-tighter italic">
                                                    {user.role}
                                                </p>
                                            </div>
                                            <ChevronDown
                                                size={14}
                                                className={`text-white transition-transform duration-500 ${isMenuOpen ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isMenuOpen && (
                                            <div className="absolute right-0 mt-4 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 z-110 border border-white/10 animate-in fade-in slide-in-from-top-5 duration-300">
                                                <div className="px-6 py-4 border-b border-white/5 mb-2">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                                                        Authenticated as
                                                    </p>
                                                    <p className="text-sm font-bold text-white truncate">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="px-2 space-y-1">
                                                    <DropdownItem
                                                        to="/profile"
                                                        icon={
                                                            <User size={18} />
                                                        }
                                                        label="My Profile"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        isActive={isActive(
                                                            "/profile",
                                                        )}
                                                    />
                                                    <DropdownItem
                                                        to="/bookings"
                                                        icon={
                                                            <Ticket size={18} />
                                                        }
                                                        label="My Bookings"
                                                        onClick={() =>
                                                            setIsMenuOpen(false)
                                                        }
                                                        isActive={isActive(
                                                            "/bookings",
                                                        )}
                                                    />

                                                    {(user.role === "admin" ||
                                                        user.role ===
                                                            "vendor") && (
                                                        <DropdownItem
                                                            to={
                                                                user.role ===
                                                                "admin"
                                                                    ? "/admin/dashboard"
                                                                    : "/vendor/dashboard"
                                                            }
                                                            icon={
                                                                <LayoutDashboard
                                                                    size={18}
                                                                    className="text-blue-400"
                                                                />
                                                            }
                                                            label={
                                                                user.role ===
                                                                "admin"
                                                                    ? "Admin Control"
                                                                    : "Vendor Control"
                                                            }
                                                            onClick={() =>
                                                                setIsMenuOpen(
                                                                    false,
                                                                )
                                                            }
                                                            isActive={location.pathname.startsWith(
                                                                user.role ===
                                                                    "admin"
                                                                    ? "/admin"
                                                                    : "/vendor",
                                                            )}
                                                        />
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsMenuOpen(
                                                                false,
                                                            );
                                                            navigate("/");
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all"
                                                    >
                                                        <LogOut size={18} />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="relative group overflow-hidden bg-white text-slate-950 px-8 py-3 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        <User size={18} />
                                        Sign In
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-100 lg:hidden w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-around">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] transition-all duration-300 ${
                                isActive(link.path)
                                    ? "text-purple-400"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            <span
                                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                                    isActive(link.path)
                                        ? "bg-purple-500/20 text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                {link.icon}
                            </span>
                            <span className="text-[10px] font-bold tracking-wide text-center">
                                {link.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
};

// Helper component for Dropdown Items
const DropdownItem = ({ to, icon, label, onClick, isActive }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
            isActive
                ? "bg-purple-600/10 text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
    >
        {icon}
        {label}
    </Link>
);
