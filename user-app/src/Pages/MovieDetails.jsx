import React, { useState, useEffect } from "react";
import { Calendar, Star, User } from "lucide-react";
import { useAuth, api, API_BASE_URL } from "../Contexts/AuthProvider";
import { useParams } from "react-router-dom";

const MovieDetails = ({ movie: propMovie, onBack, onBookNow }) => {
    const { id } = useParams();
    const [movie, setMovie] = useState(propMovie || null);
    const [shows, setShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [loading, setLoading] = useState(!!propMovie);
    const [fetchingMovie, setFetchingMovie] = useState(!propMovie);
    const { user, token } = useAuth();

    // Rating state
    const [averageRating, setAverageRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);

    useEffect(() => {
        const getMovie = async () => {
            if (id) {
                try {
                    setFetchingMovie(true);
                    const data = await api.getMovie(id);
                    setMovie(data);
                } catch (error) {
                    console.error("Failed to fetch movie:", error);
                    if (propMovie) setMovie(propMovie);
                } finally {
                    setFetchingMovie(false);
                }
            } else if (propMovie) {
                setMovie(propMovie);
                setFetchingMovie(false);
            } else {
                setFetchingMovie(false);
            }
        };
        getMovie();
    }, [id]);

    const isUpcoming = movie ? new Date(movie.releaseDate) > new Date() : false;

    useEffect(() => {
        if (movie && !isUpcoming) {
            fetchShows();
            fetchRatings();
        } else {
            setLoading(false);
        }
    }, [movie, selectedDate, isUpcoming]);

    const fetchRatings = async () => {
        if (!movie) return;
        try {
            // Fetch average rating
            const avgRes = await fetch(`${API_BASE_URL}/movies/${movie._id}/ratings`);
            const avgData = await avgRes.json();
            setAverageRating(avgData.averageRating || 0);
            setRatingCount(avgData.ratingCount || 0);

            // Fetch user's own rating if logged in
            if (token) {
                const userRes = await fetch(`${API_BASE_URL}/movies/${movie._id}/ratings/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await userRes.json();
                setUserRating(userData.userRating);
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    const handleRatingSubmit = async (score) => {
        if (!token) return;
        setRatingLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/movies/${movie._id}/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ score }),
            });
            const data = await res.json();
            if (data.success) {
                setUserRating(score);
                setAverageRating(data.averageRating);
                setRatingCount(data.ratingCount);
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setRatingLoading(false);
        }
    };

    const fetchShows = async () => {
        if (!movie) return;
        setLoading(true);
        try {
            const data = await api.getShows(movie._id, selectedDate);
            setShows(data);
        } catch (error) {
            console.error("Error fetching shows:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowSelect = (show) => {
        if (!user) {
            alert("Please log in to book tickets.");
            onBookNow(show, false);
        } else {
            onBookNow(show, true);
        }
    };
    // New UI component for the "Notify Me" form
    const NotifyMeForm = ({ movie }) => {
        const [email, setEmail] = useState("");
        const [submitted, setSubmitted] = useState(false);

        const handleSubmit = (e) => {
            e.preventDefault();
            // In a real application, you would send this email to your backend.
            // For now, we just simulate the submission and show a success message.
            console.log(
                `Notification request for ${movie.title} at email: ${email}`,
            );
            setSubmitted(true);
        };

        if (submitted) {
            return (
                <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="h-12 w-12 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        You're on the list!
                    </h3>
                    <p className="text-gray-600 text-lg">
                        We'll notify you at <strong>{email}</strong> when
                        tickets become available.
                    </p>
                </div>
            );
        }

        return (
            <div className="text-center">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                        className="h-12 w-12 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    Coming Soon!
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    This movie releases on{" "}
                    <strong>
                        {new Date(movie.releaseDate).toLocaleDateString(
                            "en-US",
                            {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            },
                        )}
                    </strong>
                    .
                    <br />
                    Enter your email to be notified when tickets go on sale.
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="grow px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-300 text-lg"
                        placeholder="Enter your email address"
                    />
                    <button
                        type="submit"
                        className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                    >
                        Notify Me
                    </button>
                </form>
            </div>
        );
    };

    if (fetchingMovie) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading Movie Details...
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Movie not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50">
            <div className="bg-linear-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-8">
                <div className="container mx-auto px-6">
                    <button
                        onClick={onBack}
                        className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 mb-6"
                    >
                        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/20 transition-all duration-300">
                            <svg
                                className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold">
                            Back to Movies
                        </span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400">
                                {movie.title}
                            </span>
                        </h1>
                        <div className="flex items-center justify-center space-x-6 text-lg">
                            {!isUpcoming && (
                                <div className="flex items-center space-x-2">
                                    <Star className="h-6 w-6 text-yellow-400 fill-current" />
                                    <span className="font-bold">
                                        {averageRating}/10
                                    </span>
                                    {ratingCount > 0 && (
                                        <span className="text-white/60 text-sm">
                                            ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
                                        </span>
                                    )}
                                </div>
                            )}
                            <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                            <span>{movie.duration} minutes</span>
                            <span className="w-2 h-2 bg-white/50 rounded-full"></span>
                            <span>{movie.genre}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
                    <div className="lg:flex">
                        <div className="lg:w-2/5 relative">
                            <div className="relative group overflow-hidden">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-96 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>

                                {/* YouTube Trailer Overlay */}
                                {movie.trailerUrl && (
                                    <a
                                        href={movie.trailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/60 transition-all duration-500 cursor-pointer"
                                        title="Watch Trailer"
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500 ease-out flex flex-col items-center gap-3">
                                            {/* YouTube Play Button */}
                                            <div className="relative">
                                                <div className="w-20 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/50 group-hover:animate-pulse">
                                                    <svg className="w-10 h-10 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z"/>
                                                    </svg>
                                                </div>
                                                {/* Ripple effect */}
                                                <div className="absolute inset-0 w-20 h-20 bg-red-600/30 rounded-2xl animate-ping" style={{animationDuration: '2s'}}></div>
                                            </div>
                                            <span className="text-white font-bold text-sm tracking-wider uppercase bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                                ▶ Watch Trailer
                                            </span>
                                        </div>
                                    </a>
                                )}

                                {!isUpcoming && (
                                    <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-white/20">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                            <span className="font-bold text-lg">
                                                {averageRating}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {!isUpcoming && (
                                    <div className="absolute bottom-6 left-6 bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl">
                                        <div className="text-center">
                                            <div className="text-sm font-medium opacity-90">
                                                Starting from
                                            </div>
                                            <div className="text-2xl font-black">
                                                ₹{movie.price}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:w-3/5 p-8 lg:p-12">
                            <div className="space-y-8">
                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-linear-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full font-semibold border border-purple-200">
                                        {movie.genre}
                                    </span>
                                    <span className="bg-linear-to-r from-green-100 to-teal-100 text-green-700 px-4 py-2 rounded-full font-semibold border border-green-200">
                                        {movie.language}
                                    </span>
                                    <span className="bg-linear-to-r from-yellow-100 to-orange-100 text-yellow-700 px-4 py-2 rounded-full font-semibold border border-yellow-200">
                                        {movie.duration} min
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                        Synopsis
                                    </h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {movie.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                                        <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                                            Director
                                        </h4>
                                        <p className="text-gray-700 font-semibold">
                                            {movie.director}
                                        </p>
                                    </div>

                                    <div className="bg-linear-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                                        <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                                            Release Date
                                        </h4>
                                        <p className="text-gray-700 font-semibold">
                                            {new Date(
                                                movie.releaseDate,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
                                        <User className="h-6 w-6 mr-3 text-purple-600" />
                                        Cast
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {movie.cast.map((actor, index) => (
                                            <span
                                                key={index}
                                                className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:border-purple-300 hover:text-purple-700 transition-colors duration-300"
                                            >
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* User Rating Section */}
                                {!isUpcoming && (
                                    <div className="bg-linear-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center text-xl">
                                            <Star className="h-6 w-6 mr-3 text-amber-500" />
                                            Rate this Movie
                                        </h4>
                                        {user ? (
                                            <div>
                                                <div className="flex items-center gap-1 mb-3">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                                        <button
                                                            key={star}
                                                            disabled={ratingLoading}
                                                            onClick={() => handleRatingSubmit(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="transition-all duration-150 transform hover:scale-125 disabled:opacity-50 focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`h-7 w-7 transition-colors duration-150 ${
                                                                    (hoverRating || userRating || 0) >= star
                                                                        ? 'text-amber-400 fill-current'
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                {userRating ? (
                                                    <p className="text-sm text-amber-700 font-semibold">
                                                        You rated this movie {userRating}/10 ⭐
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Click a star to rate
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                <a href="/auth" className="text-purple-600 font-semibold hover:underline">Log in</a> to rate this movie
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* === CONDITIONAL RENDERING LOGIC (NO CHANGES HERE) === */}
                <div className="bg-white rounded-3xl shadow-xl p-12">
                    {isUpcoming ? (
                        // If the movie is upcoming, show the "Notify Me" form
                        <NotifyMeForm movie={movie} />
                    ) : // Otherwise, show the existing showtimes logic
                    loading ? (
                        <div className="text-center">
                            <div className="relative mb-8">
                                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">
                                Loading Shows...
                            </h3>
                            <p className="text-gray-500">
                                Finding the best showtimes for you
                            </p>
                        </div>
                    ) : shows.length > 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden -m-12">
                            <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h3 className="text-3xl font-bold mb-2">
                                            Book Your Show
                                        </h3>
                                        <p className="text-purple-100">
                                            Select your preferred date and
                                            showtime
                                        </p>
                                    </div>
                                    <div className="mt-6 lg:mt-0">
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={(e) =>
                                                    setSelectedDate(
                                                        e.target.value,
                                                    )
                                                }
                                                className="pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <ShowTimes
                                    shows={shows}
                                    onShowSelect={handleShowSelect}
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                                    No Shows Available
                                </h3>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    Sorry, there are no shows available for the
                                    selected date. Please try a different date.
                                </p>
                                <button
                                    onClick={() =>
                                        setSelectedDate(
                                            new Date()
                                                .toISOString()
                                                .split("T")[0],
                                        )
                                    }
                                    className="mt-6 bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                >
                                    Try Today's Shows
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ShowTimes = ({ shows, onShowSelect, selectedDate, onDateChange }) => {
    const showsByTheater = shows.reduce((acc, show) => {
        const theaterName = show.theater.name;
        if (!acc[theaterName]) {
            acc[theaterName] = [];
        }
        acc[theaterName].push(show);
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header with Date Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        Select Showtime
                    </h3>
                    <p className="text-gray-600">
                        Choose your preferred show time
                    </p>
                </div>
            </div>

            {/* Theater Groups */}
            {Object.entries(showsByTheater).map(
                ([theaterName, theaterShows]) => (
                    <div key={theaterName} className="mb-8 last:mb-0">
                        <div className="flex items-center mb-4 pb-2 border-b-2 border-purple-100">
                            <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                                <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">
                                {theaterName}
                            </h4>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {theaterShows.map((show) => {
                                const isSoldOut = show.availableSeats === 0;
                                const isLowSeats =
                                    show.availableSeats > 0 &&
                                    show.availableSeats <= 10;

                                return (
                                    <button
                                        key={show._id}
                                        disabled={isSoldOut}
                                        onClick={() => onShowSelect(show)}
                                        className={`relative group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                            isSoldOut
                                                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                                : "bg-white border-purple-200 hover:border-purple-400 hover:shadow-lg active:scale-95"
                                        }`}
                                    >
                                        <div className="text-center">
                                            <div
                                                className={`text-lg font-bold mb-1 ${
                                                    isSoldOut
                                                        ? "text-gray-400"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {show.time}
                                            </div>
                                            <div
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    isSoldOut
                                                        ? "bg-gray-200 text-gray-500"
                                                        : isLowSeats
                                                          ? "bg-orange-100 text-orange-700"
                                                          : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {isSoldOut
                                                    ? "Sold Out"
                                                    : `${show.availableSeats} seats`}
                                            </div>
                                        </div>

                                        {!isSoldOut && (
                                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ),
            )}
        </div>
    );
};
 
export default MovieDetails;
