import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SeatSelection } from "./SeatSelection";
import { api, useAuth } from "../Contexts/AuthProvider";

export const BookingPage = ({ show: propShow, onBack, onBookingComplete }) => {
    const { showId } = useParams();
    const [show, setShow] = useState(propShow || null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingShow, setFetchingShow] = useState(!propShow);
    const { user } = useAuth();

    useEffect(() => {
        const getShow = async () => {
            if (!show && showId) {
                try {
                    setFetchingShow(true);
                    const data = await api.getShow(showId);
                    setShow(data);
                } catch (error) {
                    console.error("Failed to fetch show:", error);
                } finally {
                    setFetchingShow(false);
                }
            } else {
                setFetchingShow(false);
            }
        };
        getShow();
    }, [showId, show]);

    const handleSeatSelect = (seatId) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            } else if (prev.length < 10) {
                return [...prev, seatId];
            }
            return prev;
        });
    };

    const handleConfirmBooking = async () => {
        if (!user) {
            alert("Please login first.");
            return;
        }
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        setLoading(true);
        try {
            const bookingInfo = {
                show: show, // This contains the _id
                showId: show._id, // Also include direct showId
                seats: selectedSeats,
                totalAmount: selectedSeats.length * show.price,
            };

            console.log("🔍 Booking info being passed:", bookingInfo);
            await onBookingComplete(bookingInfo);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingShow) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Loading Show Details...
            </div>
        );
    }

    if (!show) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                Show not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <button
                    onClick={onBack}
                    className="mb-6 text-purple-600 hover:text-purple-800 flex items-center space-x-2"
                >
                    <span className="text-lg font-semibold transition-transform duration-300 hover:scale-105">
                        ⬅️ Back to Movie Details
                    </span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <SeatSelection
                            show={show}
                            onSeatSelect={handleSeatSelect}
                            selectedSeats={selectedSeats}
                        />
                    </div>
                    <div>
                        <BookingSummary
                            show={show}
                            selectedSeats={selectedSeats}
                            onConfirmBooking={handleConfirmBooking}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Booking Summary Component
const BookingSummary = ({ show, selectedSeats, onConfirmBooking, loading }) => {
    const totalAmount = selectedSeats.length * show.price;

    return (
        <div className="bg-white p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span>Movie:</span>
                    <span className="font-semibold">{show.movie.title}</span>
                </div>
                <div className="flex justify-between">
                    <span>Theater:</span>
                    <span>{show.theater.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span>
                        {new Date(show.date).toLocaleDateString()} {show.time}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Seats:</span>
                    <span className="font-semibold">
                        {selectedSeats.join(", ")}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Tickets:</span>
                    <span>
                        {selectedSeats.length} × ₹{show.price}
                    </span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{totalAmount}</span>
                </div>
            </div>

            <button
                onClick={onConfirmBooking}
                disabled={loading || selectedSeats.length === 0}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
                {loading ? "Processing..." : "Confirm Booking"}
            </button>
        </div>
    );
};
