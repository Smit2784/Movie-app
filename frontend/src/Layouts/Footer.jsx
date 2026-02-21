import React from "react";
import logo from "../logo.png";
import { Link } from "react-router-dom";
import {
    Mail,
    ChevronRight,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
} from "lucide-react";

export const Footer = () => {
    return (
        <footer className="relative bg-[#020617] text-white pt-24 pb-12 overflow-hidden mt-auto">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] z-0"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="p-2 group-hover:border-purple-500/50 transition-colors">
                                <img
                                    src={logo}
                                    className="h-36 w-auto transform group-hover:scale-110 transition-transform duration-500"
                                    alt="logo"
                                />
                            </div>
                            {/* <h3 className="text-3xl font-black tracking-tighter bg-linear-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                                MovieTix
                            </h3> */}
                        </Link>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-sm font-medium">
                            Redefining the cinematic experience. From the
                            biggest blockbusters to indie gems, book your
                            perfect seat in seconds.
                        </p>

                        {/* Contact Chip */}
                        <div className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md p-2 pr-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group cursor-pointer">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform">
                                <Mail size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                    Support Email
                                </p>
                                <p className="text-sm font-bold text-slate-200">
                                    bookings@movietix.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-2 md:pt-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8">
                            Quick Links
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink
                                to="/upcoming-movies"
                                label="Upcoming Movies"
                            />
                            <FooterLink to="/giftcards" label="Gift Cards" />
                            <FooterLink to="/" label="Latest Offers" />
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="md:col-span-2 md:pt-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8">
                            Support
                        </h4>
                        <ul className="space-y-4">
                            <FooterLink to="/contact" label="Contact Support" />
                            <FooterLink
                                to="/booking-guide"
                                label="Booking Guide"
                            />
                            <FooterLink to="/faq" label="FAQs" />
                        </ul>
                    </div>

                    {/* Social Feed */}
                    <div className="md:col-span-3 md:pt-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8">
                            Join Community
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                            <SocialIcon
                                href="https://www.facebook.com"
                                icon={<Facebook size={18} />}
                            />
                            <SocialIcon
                                href="https://twitter.com"
                                icon={<Twitter size={18} />}
                            />
                            <SocialIcon
                                href="https://www.instagram.com"
                                icon={<Instagram size={18} />}
                            />
                            <SocialIcon
                                href="https://www.youtube.com"
                                icon={<Youtube size={18} />}
                            />
                        </div>
                        <p className="mt-6 text-xs font-bold text-slate-500 leading-relaxed">
                            Follow us for exclusive early access to premieres
                            and special fan events.
                        </p>
                    </div>
                </div>

                {/* Stats Belt */}
                <div className="grid grid-cols-2 justify-center place-items-center md:grid-cols-4 gap-8 py-12 border-y border-white/5 mb-12 bg-white/2 rounded-4xl px-8 backdrop-blur-sm">
                    <StatItem
                        value="5M+"
                        label="Happy Customers"
                        color="text-amber-400"
                    />
                    <StatItem
                        value="7+"
                        label="Premium Theaters"
                        color="text-emerald-400"
                    />
                    <StatItem
                        value="50+"
                        label="Cities Covered"
                        color="text-blue-400"
                    />
                    <StatItem
                        value="10M+"
                        label="Tickets Booked"
                        color="text-purple-400"
                    />
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left order-2 md:order-1">
                        <p className="text-slate-500 text-sm font-bold">
                            © 2026{" "}
                            <span className="text-white font-black tracking-tight">
                                MOVIETIX
                            </span>
                            . All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 order-1 md:order-2">
                        <Link
                            to="/privacy-policy"
                            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms-of-service"
                            className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const FooterLink = ({ to, label }) => (
    <li>
        <Link
            to={to}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 font-bold text-sm"
        >
            <ChevronRight
                size={14}
                className="text-purple-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
            />
            <span>{label}</span>
        </Link>
    </li>
);

const SocialIcon = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg"
    >
        {icon}
    </a>
);

const StatItem = ({ value, label, color }) => (
    <div className="flex flex-col items-center justify-center text-center">
        <div className={`text-3xl font-black ${color} mb-1 tracking-tighter`}>
            {value}
        </div>
        <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
            {label}
        </div>
    </div>
);
