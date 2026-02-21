import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 text-white p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center border border-white/20">
                <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-600 animate-pulse">
                    404
                </h1>
                <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
                <p className="text-gray-300 mb-8">
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="group relative px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                    <span className="relative z-10">Go Back Home</span>
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse delay-700"></div>
        </div>
    );
};

export default NotFound;
