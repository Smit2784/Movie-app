import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Film,
} from "lucide-react";

export const ManageShows = ({ onBack }) => {
    const [shows, setShows] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);

    const [newShow, setNewShow] = useState({
        movieId: "",
        theaterId: "",
        date: "",
        time: "",
        price: "",
    });

    useEffect(() => {
        fetchShows();
        fetchMovies();
        fetchTheaters();
    }, []);

    const fetchShows = async () => {
        try {
            // Fetching all shows (could filter by date in future)
            const res = await fetch(
                "http://localhost:5000/api/shows?date=" +
                    new Date().toISOString().split("T")[0],
            ); // Initial fetch for today, can improve
            // Actually /api/shows filters by date. We might need a generic "get all shows" for admin or just loop through dates?
            // For now let's just use the public API but maybe we need an admin one to see ALL shows regardless of date.
            // Let's use the public one without date to get everything? server.js logic implies filters are optional.
            const resAll = await fetch("http://localhost:5000/api/shows");
            const data = await resAll.json();
            setShows(data);
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    };

    const fetchMovies = async () => {
        const res = await fetch("http://localhost:5000/api/movies");
        setMovies(await res.json());
    };

    const fetchTheaters = async () => {
        const res = await fetch("http://localhost:5000/api/theaters");
        const data = await res.json();
        setTheaters(data.theater || []);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/admin/shows", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newShow),
        });

        const data = await res.json();
        if (data.success) {
            alert("Show scheduled successfully!");
            fetchShows();
            setNewShow({
                movieId: "",
                theaterId: "",
                date: "",
                time: "",
                price: "",
            });
        } else {
            alert("Failed: " + data.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this show?"))
            return;

        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/admin/shows/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            fetchShows();
        } else {
            alert("Failed to delete show");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 mb-6 text-blue-600 font-medium hover:underline"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Show Form */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                        <Plus size={20} className="text-blue-500" /> Schedule
                        New Show
                    </h2>

                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Movie
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newShow.movieId}
                                onChange={(e) =>
                                    setNewShow({
                                        ...newShow,
                                        movieId: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">-- Choose Movie --</option>
                                {movies.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Theater
                            </label>
                            <select
                                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newShow.theaterId}
                                onChange={(e) =>
                                    setNewShow({
                                        ...newShow,
                                        theaterId: e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="">-- Choose Theater --</option>
                                {theaters.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name} ({t.location})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newShow.date}
                                    onChange={(e) =>
                                        setNewShow({
                                            ...newShow,
                                            date: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newShow.time}
                                    onChange={(e) =>
                                        setNewShow({
                                            ...newShow,
                                            time: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ticket Price (₹)
                            </label>
                            <input
                                type="number"
                                placeholder="250"
                                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newShow.price}
                                onChange={(e) =>
                                    setNewShow({
                                        ...newShow,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            Schedule Show
                        </button>
                    </form>
                </div>

                {/* Shows List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-[600px]">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">
                        Scheduled Shows
                    </h2>

                    <div className="flex-1 overflow-y-auto pr-2">
                        {shows.length === 0 ? (
                            <p className="text-center text-gray-400 mt-10">
                                No shows scheduled yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {shows.map((show) => (
                                    <div
                                        key={show._id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition group"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {/* Optimized helper to safely get movie poster if population worked, else fallback */}
                                                {show.movie &&
                                                    show.movie.poster && (
                                                        <img
                                                            src={
                                                                show.movie
                                                                    .poster
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {show.movie
                                                        ? show.movie.title
                                                        : "Unknown Movie"}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />{" "}
                                                        {show.theater
                                                            ? show.theater.name
                                                            : "Unknown Theater"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />{" "}
                                                        {new Date(
                                                            show.date,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />{" "}
                                                        {show.time}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                                                    ₹{show.price} per ticket
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDelete(show._id)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                                            title="Cancel Show"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
