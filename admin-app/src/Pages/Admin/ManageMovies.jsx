import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    Film,
    Edit,
    Star,
    Clock,
    AlertCircle,
    ChevronLeft,
    Languages,
    User,
    Users as UsersIcon,
    DollarSign,
    Calendar as CalendarIcon,
} from "lucide-react";
import { Pagination } from "../../Components/Pagination";
import {
    validatePositiveNumber,
    validateMinLength,
} from "../../utils/validation";

const ManageMovies = ({ onBack }) => {
    const [movies, setMovies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newMovie, setNewMovie] = useState({
        title: "",
        description: "",
        genre: "",
        duration: "",
        rating: "",
        poster: "",
        releaseDate: "",
        language: "",
        director: "",
        cast: "",
        price: "",
    });
    const [errors, setErrors] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/movies");
            const data = await res.json();
            setMovies(data);
            setCurrentPage(1); // Reset page on fetch
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleEdit = (movie) => {
        setIsEditing(true);
        setEditId(movie._id);
        setNewMovie({
            title: movie.title,
            description: movie.description,
            genre: movie.genre || "",
            duration: movie.duration,
            rating: movie.rating,
            poster: movie.poster,
            releaseDate: movie.releaseDate
                ? new Date(movie.releaseDate).toISOString().split("T")[0]
                : "",
            language: movie.language,
            director: movie.director,
            cast: Array.isArray(movie.cast)
                ? movie.cast.join(", ")
                : movie.cast,
            price: movie.price,
        });
        setErrors({});
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setNewMovie({
            title: "",
            description: "",
            genre: "",
            duration: "",
            rating: "",
            poster: "",
            releaseDate: "",
            language: "",
            director: "",
            cast: "",
            price: "",
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        const titleError = validateMinLength(newMovie.title, 1, "Title");
        if (titleError) newErrors.title = titleError;

        const descriptionError = validateMinLength(
            newMovie.description,
            10,
            "Description",
        );
        if (descriptionError) newErrors.description = descriptionError;

        const durationError = validatePositiveNumber(
            newMovie.duration,
            "Duration",
        );
        if (durationError) newErrors.duration = durationError;

        const ratingError = validatePositiveNumber(newMovie.rating, "Rating");
        if (ratingError) newErrors.rating = ratingError;
        else if (Number(newMovie.rating) > 10)
            newErrors.rating = "Rating cannot be more than 10";

        const priceError = validatePositiveNumber(newMovie.price, "Price");
        if (priceError) newErrors.price = priceError;

        if (!newMovie.releaseDate)
            newErrors.releaseDate = "Release date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = localStorage.getItem("token");

        const movieData = {
            ...newMovie,
            duration: Number(newMovie.duration),
            rating: Number(newMovie.rating),
            price: Number(newMovie.price),
            cast: newMovie.cast
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== ""),
        };

        const url = isEditing
            ? `http://localhost:5000/api/admin/movies/${editId}`
            : "http://localhost:5000/api/admin/movies";

        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(movieData),
        });

        if (res.ok) {
            fetchMovies();
            handleCancelEdit();
            alert(
                isEditing
                    ? "Movie updated successfully!"
                    : "Movie added successfully!",
            );
        } else {
            alert("Operation failed. See console.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this title?")) {
            await fetch(`http://localhost:5000/api/admin/movies/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMovies();
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideIn { animation: slideInRight 0.5s ease-out forwards; }
            `}</style>

            {/* Top Navigation */}
            <nav className="mb-10 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm"
                >
                    <ChevronLeft
                        size={20}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Back to Dashboard</span>
                </button>

                <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-bold tracking-widest uppercase">
                    <Film size={16} />
                    <span>Content Management System</span>
                </div>
            </nav>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Form Section (Sticky) */}
                <div className="xl:col-span-4">
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white h-fit sticky top-6 animate-slideIn">
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className={`p-4 rounded-2xl shadow-lg ${isEditing ? "bg-orange-500 text-white shadow-orange-200" : "bg-blue-600 text-white shadow-blue-200"}`}
                            >
                                {isEditing ? (
                                    <Edit size={24} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                                    {isEditing ? "Modify Movie" : "New Movie"}
                                </h2>
                                <p className="text-slate-400 font-semibold text-sm uppercase tracking-wider">
                                    {isEditing
                                        ? "Editing Database Entry"
                                        : "Expand your library"}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-2">
                            <div className="group relative">
                                <input
                                    type="text"
                                    placeholder="Movie Title"
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.title ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300`}
                                    value={newMovie.title}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <textarea
                                    placeholder="Plot Synopsis"
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.description ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-600 h-20 resize-none placeholder:text-slate-300`}
                                    value={newMovie.description}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <InputField
                                    icon={<Film size={16} />}
                                    placeholder="Genre"
                                    value={newMovie.genre}
                                    onChange={(val) =>
                                        setNewMovie({ ...newMovie, genre: val })
                                    }
                                />
                                <InputField
                                    icon={<Languages size={16} />}
                                    placeholder="Language"
                                    value={newMovie.language}
                                    onChange={(val) =>
                                        setNewMovie({
                                            ...newMovie,
                                            language: val,
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <InputField
                                        icon={<Clock size={16} />}
                                        type="number"
                                        placeholder="Mins"
                                        value={newMovie.duration}
                                        onChange={(val) =>
                                            setNewMovie({
                                                ...newMovie,
                                                duration: val,
                                            })
                                        }
                                        error={errors.duration}
                                    />
                                    {errors.duration && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.duration}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <InputField
                                        icon={<Star size={16} />}
                                        type="number"
                                        step="0.1"
                                        placeholder="Rating"
                                        value={newMovie.rating}
                                        onChange={(val) =>
                                            setNewMovie({
                                                ...newMovie,
                                                rating: val,
                                            })
                                        }
                                        error={errors.rating}
                                    />
                                    {errors.rating && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <InputField
                                        icon={<DollarSign size={16} />}
                                        type="number"
                                        placeholder="Price"
                                        value={newMovie.price}
                                        onChange={(val) =>
                                            setNewMovie({
                                                ...newMovie,
                                                price: val,
                                            })
                                        }
                                        error={errors.price}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <InputField
                                icon={<AlertCircle size={16} />}
                                placeholder="Poster Image URL"
                                value={newMovie.poster}
                                onChange={(val) =>
                                    setNewMovie({ ...newMovie, poster: val })
                                }
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <div className="relative">
                                    <CalendarIcon
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                                        size={16}
                                    />
                                    <input
                                        type="date"
                                        max={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className={`w-full p-4 pl-12 bg-slate-50 border-2 ${errors.releaseDate ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-500`}
                                        value={newMovie.releaseDate}
                                        onChange={(e) =>
                                            setNewMovie({
                                                ...newMovie,
                                                releaseDate: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.releaseDate && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">
                                            Required
                                        </p>
                                    )}
                                </div>
                                <InputField
                                    icon={<User size={16} />}
                                    placeholder="Director"
                                    value={newMovie.director}
                                    onChange={(val) =>
                                        setNewMovie({
                                            ...newMovie,
                                            director: val,
                                        })
                                    }
                                />
                            </div>

                            <InputField
                                icon={<UsersIcon size={16} />}
                                placeholder="Cast (comma separated)"
                                value={newMovie.cast}
                                onChange={(val) =>
                                    setNewMovie({ ...newMovie, cast: val })
                                }
                            />

                            <div className="flex gap-4 pt-3">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="w-1/3 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={`flex-1 py-4 rounded-2xl font-black text-white transition-all shadow-xl uppercase text-xs tracking-widest ${
                                        isEditing
                                            ? "bg-linear-to-r from-orange-500 to-amber-500 shadow-orange-200 hover:scale-[1.02]"
                                            : "bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-200 hover:scale-[1.02]"
                                    }`}
                                >
                                    {isEditing
                                        ? "Update Entry"
                                        : "Commit to Database"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div
                    className="xl:col-span-8 space-y-8 animate-slideIn"
                    style={{ animationDelay: "100ms" }}
                >
                    <div className="flex items-end justify-between px-2">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                Library{" "}
                                <span className="text-slate-400 italic font-light">
                                    Archive
                                </span>
                            </h2>
                            <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-xs">
                                Manage {movies.length} Global Titles
                            </p>
                        </div>
                    </div>

                    {/* Pagination Calculation */}
                    {(() => {
                        const totalPages = Math.ceil(
                            movies.length / ITEMS_PER_PAGE,
                        );
                        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                        const paginatedMovies = movies.slice(
                            startIndex,
                            startIndex + ITEMS_PER_PAGE,
                        );

                        return (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {paginatedMovies.map((movie) => (
                                        <div
                                            key={movie._id}
                                            className="group bg-white p-5 rounded-4xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 flex gap-6 relative overflow-hidden"
                                        >
                                            {/* Decorative Background Elements */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] z-0 transition-all group-hover:bg-blue-50/50"></div>

                                            <div className="relative z-10 w-32 h-48 shrink-0">
                                                <img
                                                    src={movie.poster}
                                                    alt=""
                                                    className="w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2"
                                                />
                                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                    <Star
                                                        size={12}
                                                        className="text-amber-500"
                                                        fill="currentColor"
                                                    />
                                                    <span className="text-[10px] font-black text-slate-800">
                                                        {movie.rating}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-black text-xl text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                            {movie.title}
                                                        </h3>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                            {movie.language}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                                                            {movie.genre}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                                        <span className="flex items-center gap-1.5 text-slate-500">
                                                            <Clock
                                                                size={14}
                                                                className="text-slate-300"
                                                            />{" "}
                                                            {movie.duration}m
                                                        </span>
                                                        <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[11px]">
                                                            ₹{movie.price}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    movie,
                                                                )
                                                            }
                                                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    movie._id,
                                                                )
                                                            }
                                                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-300 italic">
                                                        ID: ...
                                                        {movie._id.slice(-6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </>
                        );
                    })()}

                    {movies.length === 0 && (
                        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="p-6 bg-slate-50 rounded-full text-slate-200 mb-4">
                                <Film size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800">
                                No Titles Found
                            </h3>
                            <p className="text-slate-400 font-medium">
                                Start building your cinema empire by adding your
                                first movie.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Internal Helper Components for Cleanliness
const InputField = ({ icon, error, ...props }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            {icon}
        </div>
        <input
            {...props}
            onChange={(e) => props.onChange(e.target.value)}
            className={`w-full p-4 pl-12 bg-slate-50 border-2 ${error ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-600 placeholder:text-slate-300 placeholder:font-normal text-sm`}
        />
    </div>
);

export default ManageMovies;
