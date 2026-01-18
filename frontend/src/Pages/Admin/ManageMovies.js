import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    ArrowLeft,
    Film,
    Edit,
    Star,
    Clock,
    AlertCircle,
} from "lucide-react";

export const ManageMovies = ({ onBack }) => {
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

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/movies");
            const data = await res.json();
            setMovies(data);
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
    };

    const handleAdd = async (e) => {
        e.preventDefault();
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
        if (window.confirm("Delete this movie?")) {
            await fetch(`http://localhost:5000/api/admin/movies/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMovies();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <button
                onClick={onBack}
                className="flex items-center gap-2 mb-8 text-blue-600 font-medium hover:underline transition"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit sticky top-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div
                            className={`p-3 rounded-xl ${isEditing ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                        >
                            {isEditing ? (
                                <Edit size={24} />
                            ) : (
                                <Plus size={24} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditing ? "Edit Movie" : "Add New Movie"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Enter movie details below
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Movie Title"
                                className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={newMovie.title}
                                onChange={(e) =>
                                    setNewMovie({
                                        ...newMovie,
                                        title: e.target.value,
                                    })
                                }
                                required
                            />

                            <textarea
                                placeholder="Description"
                                className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition h-24 resize-none"
                                value={newMovie.description}
                                onChange={(e) =>
                                    setNewMovie({
                                        ...newMovie,
                                        description: e.target.value,
                                    })
                                }
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Genre"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.genre}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            genre: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Language"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.language}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            language: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <input
                                    type="number"
                                    placeholder="Mins"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.duration}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            duration: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Rtg"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.rating}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            rating: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.price}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            price: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Poster URL"
                                className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                                value={newMovie.poster}
                                onChange={(e) =>
                                    setNewMovie({
                                        ...newMovie,
                                        poster: e.target.value,
                                    })
                                }
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-500"
                                    value={newMovie.releaseDate}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            releaseDate: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Director"
                                    className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={newMovie.director}
                                    onChange={(e) =>
                                        setNewMovie({
                                            ...newMovie,
                                            director: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Cast (comma separated)"
                                className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={newMovie.cast}
                                onChange={(e) =>
                                    setNewMovie({
                                        ...newMovie,
                                        cast: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className={`flex-1 ${isEditing ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"} text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200`}
                            >
                                {isEditing ? "Update Movie" : "Add Movie"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Movie Library{" "}
                            <span className="text-gray-400 text-lg ml-2">
                                {movies.length} titles
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {movies.map((movie) => (
                            <div
                                key={movie._id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex gap-4 group"
                            >
                                <img
                                    src={movie.poster}
                                    alt=""
                                    className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
                                />

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm bg-yellow-50 px-2 py-0.5 rounded-md">
                                                <Star
                                                    size={12}
                                                    fill="currentColor"
                                                />{" "}
                                                {movie.rating}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {movie.language} • {movie.genre}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />{" "}
                                                {movie.duration}m
                                            </span>
                                            <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">
                                                ₹{movie.price}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(movie)}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(movie._id)
                                            }
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
