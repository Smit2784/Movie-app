import React, { useState, useEffect } from "react";
import { ChevronLeft, CalendarCheck, Film, MapPin, Calendar, Clock, CreditCard, User } from "lucide-react";
import { Pagination } from "../../Components/Pagination";

const VendorBookings = ({ onBack }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/vendor/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error("Error fetching vendor bookings:", error);
        } finally {
            setLoading(false);
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
                            Bookings Engine
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                            Live Data
                        </span>
                    </div>
                </div>
            </nav>

            <div className="animate-slideUp">
                <div className="flex items-end justify-between px-4 mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            Recent <span className="text-slate-400 italic font-light">Bookings</span>
                            <div className="h-10 w-px bg-slate-200 ml-2"></div>
                            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                                {bookings.length} Total
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="flex-1 p-8 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="p-8 bg-slate-50 rounded-full text-slate-200 mb-6">
                                    <CalendarCheck size={64} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800">
                                    No Bookings Yet
                                </h3>
                                <p className="text-slate-400 font-medium max-w-xs mt-2">
                                    Once users book tickets for your shows, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {(() => {
                                    const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
                                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                                    const paginatedBookings = bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                                    return (
                                        <>
                                            {paginatedBookings.map((booking) => (
                                                <div
                                                    key={booking._id}
                                                    className="group flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 gap-4"
                                                >
                                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                                        {/* Movie Thumbnail */}
                                                        <div className="w-16 h-24 bg-white p-1 rounded-2xl shadow-sm overflow-hidden shrink-0">
                                                            {booking.show?.movie?.poster ? (
                                                                <img
                                                                    src={booking.show.movie.poster}
                                                                    alt={booking.show.movie.title}
                                                                    className="w-full h-full object-cover rounded-xl"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                                    <Film size={20} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="space-y-2">
                                                            <h3 className="font-black text-lg text-slate-900">
                                                                {booking.show?.movie?.title || "Unknown Movie"}
                                                            </h3>
                                                            
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                                <User size={14} className="text-slate-400" />
                                                                {booking.user?.name || "Unknown User"} 
                                                                <span className="text-slate-400 text-xs">({booking.user?.email})</span>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                                                <span className="flex items-center gap-2 text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                                                    <MapPin size={12} className="text-blue-500" />
                                                                    {booking.show?.theater?.name || "Unknown Theater"}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <Calendar size={12} />
                                                                    {booking.show?.date && new Date(booking.show.date).toLocaleDateString()}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <Clock size={12} />
                                                                    {booking.show?.time}
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                                                    Seats: {booking.seats.join(", ")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status & Amount */}
                                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto px-2">
                                                        <div className="text-left md:text-right">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                                                                Total Paid
                                                            </span>
                                                            <span className="text-xl font-black text-emerald-600 flex items-center gap-1">
                                                                ₹{booking.totalAmount}
                                                            </span>
                                                        </div>
                                                        <div className={`mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                            booking.status === 'confirmed' 
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                                                : "bg-rose-50 text-rose-600 border border-rose-100"
                                                        }`}>
                                                            {booking.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {totalPages > 1 && (
                                                <div className="flex justify-center mt-8 pb-4">
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        onPageChange={setCurrentPage}
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
    );
};

export default VendorBookings;
