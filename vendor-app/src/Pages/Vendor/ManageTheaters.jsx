import React, { useState, useEffect } from "react";
import {
    Plus,
    Trash2,
    MapPin,
    Monitor,
    Edit,
    Armchair,
    ChevronLeft,
    Building2,
    Settings2,
    Zap,
} from "lucide-react";
import {
    validatePositiveNumber,
    validateMinLength,
} from "../../utils/validation";
import { Pagination } from "../../Components/Pagination";

const ManageTheaters = ({ onBack }) => {
    const [theaters, setTheaters] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [newTheater, setNewTheater] = useState({
        name: "",
        location: "",
        capacity: "",
        screens: 1,
        facilities: "",
    });
    const [errors, setErrors] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                "http://localhost:5000/api/admin/theaters",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await res.json();
            if (data.theater) {
                setTheaters(data.theater);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    };

    const handleEdit = (theater) => {
        setIsEditing(true);
        setEditId(theater._id);
        setNewTheater({
            name: theater.name,
            location: theater.location,
            capacity: theater.capacity,
            screens: theater.screens,
            facilities: Array.isArray(theater.facilities)
                ? theater.facilities.join(", ")
                : theater.facilities,
        });
        setErrors({});
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setNewTheater({
            name: "",
            location: "",
            capacity: "",
            screens: 1,
            facilities: "",
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        const nameError = validateMinLength(newTheater.name, 1, "Theater Name");
        if (nameError) newErrors.name = nameError;

        const locationError = validateMinLength(
            newTheater.location,
            1,
            "Location",
        );
        if (locationError) newErrors.location = locationError;

        const capacityError = validatePositiveNumber(
            newTheater.capacity,
            "Capacity",
        );
        if (capacityError) newErrors.capacity = capacityError;

        const screensError = validatePositiveNumber(
            newTheater.screens,
            "Screens",
        );
        if (screensError) newErrors.screens = screensError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const token = localStorage.getItem("token");

        const theaterData = {
            ...newTheater,
            facilities: newTheater.facilities.split(",").map((f) => f.trim()),
        };

        const url = isEditing
            ? `http://localhost:5000/api/admin/theaters/${editId}`
            : "http://localhost:5000/api/admin/theaters";

        const method = isEditing ? "PUT" : "POST";

        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(theaterData),
        });

        if (res.ok) {
            fetchTheaters();
            handleCancelEdit();
            alert(
                isEditing
                    ? "Theater updated successfully!"
                    : "Theater added successfully!",
            );
        } else {
            alert("Operation failed. See console.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        if (
            window.confirm(
                "Remove this theater from the platform? This action cannot be undone.",
            )
        ) {
            await fetch(`http://localhost:5000/api/admin/theaters/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTheaters();
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideIn { animation: slideInLeft 0.5s ease-out forwards; }
            `}</style>

            {/* Navigation Header */}
            <nav className="mb-12 flex items-center justify-between animate-slideIn">
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
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Venue Manager
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                            Infrastructure Control
                        </p>
                    </div>
                </div>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Configuration Form */}
                <div
                    className="lg:col-span-4 animate-slideIn"
                    style={{ animationDelay: "100ms" }}
                >
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white sticky top-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div
                                className={`p-4 rounded-2xl shadow-lg transition-colors duration-500 ${isEditing ? "bg-orange-500 text-white shadow-orange-200" : "bg-emerald-600 text-white shadow-emerald-200"}`}
                            >
                                {isEditing ? (
                                    <Settings2 size={24} />
                                ) : (
                                    <Plus size={24} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                                    {isEditing
                                        ? "Modify Venue"
                                        : "Register Venue"}
                                </h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    Theater Configuration
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div className="space-y-1">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Formal Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Grand Cineplex"
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.name ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700`}
                                    value={newTheater.name}
                                    onChange={(e) =>
                                        setNewTheater({
                                            ...newTheater,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={10} /> Geospatial Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="City Center, Mall Road"
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.location ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700`}
                                    value={newTheater.location}
                                    onChange={(e) =>
                                        setNewTheater({
                                            ...newTheater,
                                            location: e.target.value,
                                        })
                                    }
                                    required
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Armchair size={10} /> Capacity
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={400}
                                        placeholder="350"
                                        className={`w-full p-4 bg-slate-50 border-2 ${errors.capacity ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700`}
                                        value={newTheater.capacity}
                                        onChange={(e) => {
                                            const val = e.target.value.slice(0, 3);
                                            setNewTheater({
                                                ...newTheater,
                                                capacity: val,
                                            });
                                        }}
                                        required
                                    />
                                    {errors.capacity && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">
                                            {errors.capacity}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Monitor size={10} /> Screens
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        className={`w-full p-4 bg-slate-50 border-2 ${errors.screens ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-700`}
                                        value={newTheater.screens}
                                        onChange={(e) =>
                                            setNewTheater({
                                                ...newTheater,
                                                screens: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.screens && (
                                        <p className="text-red-500 text-xs mt-1 ml-2">
                                            {errors.screens}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Facilities (Comma Separated)
                                </label>
                                <textarea
                                    placeholder="4K, IMAX, Dolby Atmos, Valet..."
                                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium text-slate-600 h-28 resize-none text-sm"
                                    value={newTheater.facilities}
                                    onChange={(e) =>
                                        setNewTheater({
                                            ...newTheater,
                                            facilities: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="w-1/3 py-4 rounded-2xl font-black text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest"
                                    >
                                        Abort
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={`flex-1 py-4 rounded-2xl font-black text-white transition-all shadow-xl uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 ${
                                        isEditing
                                            ? "bg-linear-to-r from-orange-500 to-amber-500 shadow-orange-200"
                                            : "bg-linear-to-r from-emerald-600 to-teal-600 shadow-emerald-200"
                                    }`}
                                >
                                    {isEditing
                                        ? "Save Changes"
                                        : "Commit to Network"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Network List */}
                <div
                    className="lg:col-span-8 space-y-8 animate-slideIn"
                    style={{ animationDelay: "200ms" }}
                >
                    <div className="px-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Venue{" "}
                            <span className="text-slate-400 italic font-light">
                                Network
                            </span>
                        </h2>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">
                            Managing {theaters.length} Locations across the
                            globe
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {theaters.length > 0 ? (
                            (() => {
                                const totalPages = Math.ceil(
                                    theaters.length / ITEMS_PER_PAGE,
                                );
                                const startIndex =
                                    (currentPage - 1) * ITEMS_PER_PAGE;
                                const paginatedTheaters = theaters.slice(
                                    startIndex,
                                    startIndex + ITEMS_PER_PAGE,
                                );

                                return (
                                    <>
                                        {paginatedTheaters.map((theater) => (
                                            <div
                                                key={theater._id}
                                                className="group bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                                            >
                                                {/* Ambient Glow */}
                                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors duration-500 blur-3xl opacity-50"></div>

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                                                                {theater.name}
                                                            </h3>
                                                            <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mt-1 uppercase tracking-tighter">
                                                                <MapPin
                                                                    size={12}
                                                                    className="text-emerald-500"
                                                                />
                                                                {
                                                                    theater.location
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        theater,
                                                                    )
                                                                }
                                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300"
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        theater._id,
                                                                    )
                                                                }
                                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-300 uppercase font-black tracking-widest mb-1">
                                                                Total Capacity
                                                            </span>
                                                            <span className="text-slate-700 font-black text-lg flex items-center gap-2">
                                                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                                                    <Armchair
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </div>
                                                                {
                                                                    theater.capacity
                                                                }{" "}
                                                                Seats
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-slate-300 uppercase font-black tracking-widest mb-1">
                                                                Projection Units
                                                            </span>
                                                            <span className="text-slate-700 font-black text-lg flex items-center gap-2">
                                                                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                                                    <Monitor
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </div>
                                                                {
                                                                    theater.screens
                                                                }{" "}
                                                                Units
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-5">
                                                        {theater.facilities &&
                                                        theater.facilities
                                                            .length > 0 ? (
                                                            theater.facilities.map(
                                                                (fac, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-black rounded-lg border border-slate-100 flex items-center gap-2 group-hover:bg-white group-hover:border-emerald-100 group-hover:text-emerald-600 transition-all duration-300"
                                                                    >
                                                                        <Zap
                                                                            size={
                                                                                10
                                                                            }
                                                                            className="text-emerald-400"
                                                                        />
                                                                        {fac}
                                                                    </span>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-[10px] text-slate-300 font-bold italic py-1">
                                                                Basic
                                                                Infrastructure
                                                                Only
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Pagination Component */}
                                        {Math.ceil(
                                            theaters.length / ITEMS_PER_PAGE,
                                        ) > 1 && (
                                            <div className="col-span-1 md:col-span-2 flex justify-center mt-6">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={Math.ceil(
                                                        theaters.length /
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
                            })()
                        ) : (
                            <div className="col-span-1 md:col-span-2 py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                <div className="p-8 bg-slate-50 rounded-full text-slate-200 mb-6">
                                    <Building2 size={64} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800">
                                    No Venues Registered
                                </h3>
                                <p className="text-slate-400 font-medium max-w-xs mt-2">
                                    Initialize your network by registering your
                                    first cinema location.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTheaters;
