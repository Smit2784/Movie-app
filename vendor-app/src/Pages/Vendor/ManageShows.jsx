import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Calendar,
    Clock,
    MapPin,
    Film,
    ChevronLeft,
    Tag,
    Activity,
    CalendarCheck,
} from "lucide-react";
import { validatePositiveNumber } from "../../utils/validation";
import { Pagination } from "../../Components/Pagination";

const ManageShows = ({ onBack }) => {
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
    const [errors, setErrors] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchShows();
        fetchMovies();
        fetchTheaters();
    }, []);

    const fetchShows = async () => {
        try {
            const token = localStorage.getItem("token");
            const resAll = await fetch(
                "http://localhost:5000/api/admin/shows",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await resAll.json();
            setShows(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    };

    const fetchMovies = async () => {
        const res = await fetch("http://localhost:5000/api/movies");
        setMovies(await res.json());
    };

    const fetchTheaters = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/theaters", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setTheaters(data.theater || []);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!newShow.movieId) newErrors.movieId = "Movie selection is required";
        if (!newShow.theaterId)
            newErrors.theaterId = "Theater selection is required";
        if (!newShow.date) newErrors.date = "Date is required";
        if (!newShow.time) newErrors.time = "Time is required";

        // Price is optional — if empty, backend defaults to movie base price
        if (newShow.price) {
            const priceError = validatePositiveNumber(newShow.price, "Price");
            if (priceError) {
                newErrors.price = priceError;
            } else {
                const selectedMovie = movies.find((m) => m._id === newShow.movieId);
                if (selectedMovie && Number(newShow.price) < selectedMovie.price) {
                    newErrors.price = `Price must be at least ₹${selectedMovie.price} (movie base price)`;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

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
            setErrors({});
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
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp { animation: slideInUp 0.5s ease-out forwards; }
            `}</style>

            {/* Top Navigation */}
            <nav className="mb-12 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm"
                >
                    <ChevronLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                            Scheduling Engine
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            v2.4.0 Running
                        </span>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Activity size={20} />
                    </div>
                </div>
            </nav>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Scheduling Form Section */}
                <div className="xl:col-span-4 animate-slideUp">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white sticky top-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                                    New Showtime
                                </h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    Register Slot
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Film size={12} /> Film Selection
                                </label>
                                <select
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.movieId ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer`}
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
                                {errors.movieId && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.movieId}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={12} /> Venue
                                </label>
                                <select
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.theaterId ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer`}
                                    value={newShow.theaterId}
                                    onChange={(e) =>
                                        setNewShow({
                                            ...newShow,
                                            theaterId: e.target.value,
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        -- Choose Theater --
                                    </option>
                                    {theaters.map((t) => (
                                        <option key={t._id} value={t._id}>
                                            {t.name} ({t.location})
                                        </option>
                                    ))}
                                </select>
                                {errors.theaterId && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.theaterId}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} /> Date
                                    </label>
                                    <input
                                        type="date"
                                        className={`w-full p-4 bg-slate-50 border-2 ${errors.date ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-600`}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        value={newShow.date}
                                        onChange={(e) =>
                                            setNewShow({
                                                ...newShow,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    {errors.date && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">
                                            {errors.date}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> Time
                                    </label>
                                    <input
                                        type="time"
                                        className={`w-full p-4 bg-slate-50 border-2 ${errors.time ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-600`}
                                        value={newShow.time}
                                        onChange={(e) =>
                                            setNewShow({
                                                ...newShow,
                                                time: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    {errors.time && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">
                                            {errors.time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="ml-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={12} /> Ticket Price (₹)
                                </label>
                                {(() => {
                                    const selectedMovie = movies.find((m) => m._id === newShow.movieId);
                                    const minPrice = selectedMovie ? selectedMovie.price : 0;
                                    return (
                                        <>
                                            <input
                                                type="number"
                                                placeholder={minPrice ? `Default: ₹${minPrice}` : "250"}
                                                min={minPrice || undefined}
                                                className={`w-full p-4 bg-slate-50 border-2 ${errors.price ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700`}
                                                value={newShow.price}
                                                onChange={(e) =>
                                                    setNewShow({
                                                        ...newShow,
                                                        price: e.target.value,
                                                    })
                                                }
                                            />
                                            {minPrice > 0 && (
                                                <p className="text-xs text-blue-500 font-semibold ml-2 mt-1">
                                                    {newShow.price ? `Min ₹${minPrice}` : `Will use base price: ₹${minPrice}`}
                                                </p>
                                            )}
                                        </>
                                    );
                                })()}
                                {errors.price && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-200 hover:scale-[1.02] hover:shadow-blue-300 active:scale-95 pt-6 mt-4"
                            >
                                Commit to Schedule
                            </button>
                        </form>
                    </div>
                </div>

                {/* Shows List Section */}
                <div
                    className="xl:col-span-8 animate-slideUp"
                    style={{ animationDelay: "150ms" }}
                >
                    <div className="flex items-end justify-between px-4 mb-8">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                                Timeline{" "}
                                <span className="text-slate-400 italic font-light">
                                    Archive
                                </span>
                                <div className="h-10 w-px bg-slate-200 ml-2"></div>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                                    {shows.length} Scheduled
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden h-[720px] flex flex-col">
                        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                            {shows.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="p-8 bg-slate-50 rounded-full text-slate-200 mb-6">
                                        <CalendarCheck size={64} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800">
                                        No Active Slots
                                    </h3>
                                    <p className="text-slate-400 font-medium max-w-xs mt-2">
                                        The schedule is currently clear. Use the
                                        engine to program new showtimes.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {(() => {
                                        const totalPages = Math.ceil(
                                            shows.length / ITEMS_PER_PAGE,
                                        );
                                        const startIndex =
                                            (currentPage - 1) * ITEMS_PER_PAGE;
                                        const paginatedShows = shows.slice(
                                            startIndex,
                                            startIndex + ITEMS_PER_PAGE,
                                        );

                                        return (
                                            <>
                                                {paginatedShows.map((show) => (
                                                    <div
                                                        key={show._id}
                                                        className="group flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            {/* Movie Thumbnail */}
                                                            <div className="w-20 h-28 bg-white p-1 rounded-2xl shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                                {show.movie &&
                                                                show.movie
                                                                    .poster ? (
                                                                    <img
                                                                        src={
                                                                            show
                                                                                .movie
                                                                                .poster
                                                                        }
                                                                        alt=""
                                                                        className="w-full h-full object-cover rounded-xl"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                                        <Film
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Details */}
                                                            <div className="space-y-3">
                                                                <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                    {show.movie
                                                                        ? show
                                                                              .movie
                                                                              .title
                                                                        : "Unknown Release"}
                                                                </h3>

                                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                                                    <span className="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                                                        <MapPin
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="text-blue-500"
                                                                        />
                                                                        {show.theater
                                                                            ? show
                                                                                  .theater
                                                                                  .name
                                                                            : "Unassigned"}
                                                                    </span>
                                                                    <span className="flex items-center gap-2">
                                                                        <Calendar
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {new Date(
                                                                            show.date,
                                                                        ).toLocaleDateString(
                                                                            undefined,
                                                                            {
                                                                                month: "short",
                                                                                day: "numeric",
                                                                                year: "numeric",
                                                                            },
                                                                        )}
                                                                    </span>
                                                                    <span className="flex items-center gap-2">
                                                                        <Clock
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        {
                                                                            show.time
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action & Price */}
                                                        <div className="flex items-center gap-8 pr-4">
                                                            <div className="text-right">
                                                                <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">
                                                                    Standard
                                                                </span>
                                                                <span className="text-2xl font-black text-emerald-600">
                                                                    ₹
                                                                    {show.price}
                                                                </span>
                                                            </div>

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        show._id,
                                                                    )
                                                                }
                                                                className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100 group-hover:rotate-6 active:scale-90"
                                                                title="Cancel Program"
                                                            >
                                                                <Trash2
                                                                    size={22}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {Math.ceil(
                                                    shows.length /
                                                        ITEMS_PER_PAGE,
                                                ) > 1 && (
                                                    <div className="flex justify-center mt-8 pb-4">
                                                        <Pagination
                                                            currentPage={
                                                                currentPage
                                                            }
                                                            totalPages={Math.ceil(
                                                                shows.length /
                                                                    ITEMS_PER_PAGE,
                                                            )}
                                                            onPageChange={
                                                                setCurrentPage
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageShows;
