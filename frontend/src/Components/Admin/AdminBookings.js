import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, MapPin, Film, CreditCard, CheckCircle, XCircle } from 'lucide-react';

export const AdminBookings = ({ onBack }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setBookings(data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <button onClick={onBack} className="flex items-center gap-2 mb-8 text-blue-600 font-medium hover:underline transition">
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Booking History</h2>
                        <p className="text-gray-500 mt-1">View all user transactions and bookings</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-gray-500 font-medium">Total Revenues:</span> <span className="text-green-600 font-bold ml-1 text-lg">₹{bookings.reduce((acc, curr) => acc + (curr.status === 'confirmed' ? curr.totalAmount : 0), 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading booking records...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                                    <tr>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Movie Info</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Show Details</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Seats</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="hover:bg-blue-50/30 transition">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                                        {booking.user ? booking.user.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{booking.user ? booking.user.name : 'Unknown User'}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">{booking.user ? booking.user.email : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                {booking.show && booking.show.movie ? (
                                                    <div className="flex items-center gap-3">
                                                        <img src={booking.show.movie.poster} alt="" className="w-8 h-12 object-cover rounded shadow-sm" />
                                                        <span className="font-medium text-gray-800 text-sm">{booking.show.movie.title}</span>
                                                    </div>
                                                ) : <span className="text-red-400 text-sm">Movie Deleted</span>}
                                            </td>
                                            <td className="p-5">
                                                {booking.show ? (
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={12} /> {booking.show.theater ? booking.show.theater.name : 'Unknown Theater'}</p>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Calendar size={12} /> {new Date(booking.show.date).toLocaleDateString()}
                                                            <span className="mx-1">•</span>
                                                            {booking.show.time}
                                                        </p>
                                                    </div>
                                                ) : <span className="text-red-400 text-sm">Show Deleted</span>}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {booking.seats.map(seat => (
                                                        <span key={seat} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{seat}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-5 font-bold text-gray-800">
                                                ₹{booking.totalAmount}
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                    {booking.status === 'confirmed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-400 italic">No bookings found in the system.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
