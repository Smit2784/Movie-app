import logo from "../logo.png";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={logo}
                                className="h-12 w-auto"
                                alt="logo"
                            />
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                MovieTix
                            </h3>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                            Your ultimate destination for seamless movie ticket
                            booking. Experience cinema like never before with
                            premium seats and cutting-edge technology.
                        </p>
                        <div className="flex space-x-4">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                                <span className="text-xl">📧</span>
                                <span className=""> bookings@movietix.com</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-purple-300">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/upcoming-movies"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    Upcoming Movies
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    to="/"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    Offers & Deals
                                </Link>
                            </li> */}
                            <li>
                                <Link
                                    to="/giftcards"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    Gift Cards
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-purple-300">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    Contact Support
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/booking-guide"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    Booking Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-300 hover:text-white transition-colors duration-300 text-left block"
                                >
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-white/20">
                    <div className="text-center">
                        <div className="text-3xl font-black text-yellow-400 mb-2">
                            5M+
                        </div>
                        <div className="text-gray-300 text-sm">
                            Happy Customers
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-green-400 mb-2">
                            7+
                        </div>
                        <div className="text-gray-300 text-sm">
                            Premium Theaters
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-blue-400 mb-2">
                            50+
                        </div>
                        <div className="text-gray-300 text-sm">
                            Cities Covered
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-black text-purple-400 mb-2">
                            10M+
                        </div>
                        <div className="text-gray-300 text-sm">
                            Tickets Booked
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/20">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-gray-300">
                            © 2025{" "}
                            <span className="font-bold text-white">
                                MovieTix
                            </span>
                            . All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
