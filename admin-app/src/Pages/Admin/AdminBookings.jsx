import React, { useState, useEffect } from "react";
import {
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
    ChevronLeft,
    TrendingUp,
    Receipt,
    Ticket,
} from "lucide-react";
import { Pagination } from "../../Components/Pagination";

const AdminBookings = ({ onBack }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                "http://localhost:5000/api/admin/bookings",
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
            setCurrentPage(1);
        }
    };

    const totalRevenue = bookings.reduce(
        (acc, curr) =>
            acc + (curr.status === "confirmed" ? curr.totalAmount : 0),
        0,
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>

            {/* Header Navigation */}
            <nav className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm w-fit"
                >
                    <ChevronLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Dashboard</span>
                </button>

                <div className="flex items-center gap-6 animate-fadeIn">
                    {/* Total Bookings Stat */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Total Bookings
                            </p>
                            <p className="text-2xl font-black text-blue-600">
                                {bookings.length}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-200">
                            <Ticket size={24} />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>

                    {/* Revenue Stat */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Net confirmed
                            </p>
                            <p className="text-2xl font-black text-emerald-600">
                                ₹{totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Title Section */}
                <div className="animate-fadeIn">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Booking{" "}
                        <span className="text-slate-400 italic font-light">
                            Ledger
                        </span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">
                        Transaction audit and reservation management
                    </p>
                </div>

                {/* Table Container */}
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-fadeIn"
                    style={{ animationDelay: "100ms" }}
                >
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                                Accessing Records...
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Customer
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Movie
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Showtime
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                            Seats
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Total
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(() => {
                                        const totalPages = Math.ceil(
                                            bookings.length / ITEMS_PER_PAGE,
                                        );
                                        const startIndex =
                                            (currentPage - 1) * ITEMS_PER_PAGE;
                                        const paginatedBookings =
                                            bookings.slice(
                                                startIndex,
                                                startIndex + ITEMS_PER_PAGE,
                                            );

                                        return paginatedBookings.map(
                                            (booking) => (
                                                <tr
                                                    key={booking._id}
                                                    className="hover:bg-slate-50/80 transition-all duration-300 group"
                                                >
                                                    {/* User Info */}
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                                                                {booking.user
                                                                    ? booking.user.name
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase()
                                                                    : "?"}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-800 text-sm">
                                                                    {booking.user
                                                                        ? booking
                                                                              .user
                                                                              .name
                                                                        : "Unknown User"}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-slate-400 lowercase tracking-tight">
                                                                    {booking.user
                                                                        ? booking
                                                                              .user
                                                                              .email
                                                                        : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Movie Info */}
                                                    <td className="p-6">
                                                        {booking.show &&
                                                        booking.show.movie ? (
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={
                                                                        booking
                                                                            .show
                                                                            .movie
                                                                            .poster
                                                                    }
                                                                    alt=""
                                                                    className="w-10 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                                                                />
                                                                <span className="font-bold text-slate-700 text-sm leading-tight max-w-[150px]">
                                                                    {
                                                                        booking
                                                                            .show
                                                                            .movie
                                                                            .title
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase italic">
                                                                <XCircle
                                                                    size={14}
                                                                />{" "}
                                                                Deleted Content
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Show Details */}
                                                    <td className="p-6">
                                                        {booking.show ? (
                                                            <div className="space-y-1.5">
                                                                <p className="text-xs font-black text-slate-600 flex items-center gap-2">
                                                                    <MapPin
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-blue-500"
                                                                    />
                                                                    {booking
                                                                        .show
                                                                        .theater
                                                                        ? booking
                                                                              .show
                                                                              .theater
                                                                              .name
                                                                        : "Unassigned"}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                                                                    <Calendar
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    {new Date(
                                                                        booking
                                                                            .show
                                                                            .date,
                                                                    ).toLocaleDateString(
                                                                        undefined,
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        },
                                                                    )}
                                                                    <span className="text-slate-200">
                                                                        |
                                                                    </span>
                                                                    <span className="text-slate-500">
                                                                        {
                                                                            booking
                                                                                .show
                                                                                .time
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-300 text-[10px] font-black uppercase">
                                                                Schedule Purged
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Seats */}
                                                    <td className="p-6">
                                                        <div className="flex flex-wrap justify-center gap-1.5 max-w-[120px] mx-auto">
                                                            {booking.seats &&
                                                            booking.seats
                                                                .length > 0 ? (
                                                                booking.seats.map(
                                                                    (seat) => (
                                                                        <span
                                                                            key={
                                                                                seat
                                                                            }
                                                                            className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-black rounded-lg shadow-sm group-hover:border-blue-200 transition-colors"
                                                                        >
                                                                            {
                                                                                seat
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <span className="text-slate-400 text-xs font-bold">
                                                                    {
                                                                        booking.seats
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="p-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-black text-slate-900 tracking-tighter">
                                                                ₹
                                                                {booking.totalAmount.toLocaleString()}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                                Gross total
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="p-6 text-right">
                                                        <div
                                                            className={`inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border-2 ${
                                                                booking.status ===
                                                                "confirmed"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-100"
                                                                    : "bg-rose-50 text-rose-700 border-rose-100 shadow-sm shadow-rose-100"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`p-1 rounded-full ${booking.status === "confirmed" ? "bg-emerald-500" : "bg-rose-500"} text-white`}
                                                            >
                                                                {booking.status ===
                                                                "confirmed" ? (
                                                                    <CheckCircle
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <XCircle
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        );
                                    })()}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="p-20 text-center"
                                            >
                                                <div className="flex flex-col items-center opacity-20">
                                                    <Receipt
                                                        size={48}
                                                        className="mb-4"
                                                    />
                                                    <p className="font-black uppercase tracking-[0.3em] text-sm">
                                                        Zero Transactions Logged
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Component */}
                            {bookings.length > ITEMS_PER_PAGE && (
                                <div className="p-6 border-t border-slate-100 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            bookings.length / ITEMS_PER_PAGE,
                                        )}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
