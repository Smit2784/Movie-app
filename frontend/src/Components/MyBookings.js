import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, User, Ticket } from "lucide-react";
import { useAuth } from "../Contexts/AuthProvider";
import { api } from "../Contexts/AuthProvider";

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingIds, setCancellingIds] = useState(new Set());
  const [walletBalance, setWalletBalance] = useState(0);
  const [refundNotifications, setRefundNotifications] = useState(new Map());
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchWalletBalance();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings(token);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const data = await api.getWalletBalance(token);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleCancelBooking = async (bookingId, movieTitle, totalAmount) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your booking for "${movieTitle}"?\n\nRefund amount ₹${totalAmount} will be credited to your wallet in 5-7 working days.`
    );

    if (!confirmCancel) {
      return;
    }

    setCancellingIds((prev) => new Set(prev).add(bookingId));

    try {
      const response = await api.cancelBooking(bookingId, token);

      if (response.message) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
        setRefundNotifications((prev) =>
          new Map(prev).set(bookingId, {
            amount: totalAmount,
            timestamp: Date.now(),
          })
        );
        setTimeout(() => {
          setWalletBalance((prev) => prev + totalAmount);
          setTimeout(() => {
            setRefundNotifications((prev) => {
              const newMap = new Map(prev);
              newMap.delete(bookingId);
              return newMap;
            });
          }, 3000);
        }, Math.floor(Math.random() * 3000) + 5000);

        alert(
          "Booking cancelled successfully! Refund will be credited to your wallet shortly."
        );
      } else {
        alert(response.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Loading your bookings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              My Bookings
            </span>
          </h1>
          <p className="text-lg text-gray-300 text-center">
            Manage your movie bookings and view booking history
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Refund Notifications */}

        {refundNotifications.size > 0 && (
          <div className="mb-6">
            {Array.from(refundNotifications.entries()).map(
              ([bookingId, notification]) => (
                <div
                  key={bookingId}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <div className="font-semibold text-blue-800">
                        Processing Refund
                      </div>
                      <div className="text-blue-600">
                        ₹{notification.amount} will be credited to your wallet
                        shortly...
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-8">
              You haven't made any movie bookings yet. Start exploring our
              latest movies!
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => {
              const isCancelling = cancellingIds.has(booking._id);
              const isCancelled = booking.status === "cancelled";
              const showDate = new Date(booking.show.date);
              const showTime = booking.show.time;
              const [hours, minutes] = showTime.split(":");
              const showDateTime = new Date(showDate);
              showDateTime.setHours(parseInt(hours), parseInt(minutes));
              const hasShowStarted = showDateTime <= new Date();

              return (
                <div
                  key={booking._id}
                  className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                    isCancelled ? "opacity-75" : ""
                  }`}
                >
                  <div className="p-8">
                    {/* Status Badge */}

                    <div className="flex justify-between items-start mb-6">
                      <h3 className="font-bold text-xl text-gray-800">
                        {booking.show.movie.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          isCancelled
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isCancelled ? "Cancelled" : "Confirmed"}
                      </span>
                    </div>

                    {/* Booking Details */}

                    <div className="space-y-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-purple-600" />
                        <span className="font-medium">
                          {booking.show.theater.name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                        <span>
                          {showDate.toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-3 text-green-600" />
                        <span>{booking.show.time}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-3 text-orange-600" />
                        <span className="font-semibold">
                          {booking.seats.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Booking Summary */}

                    <div className="border-t border-gray-100 pt-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Seats:</span>
                        <span className="font-semibold text-gray-800">
                          {booking.seats.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Total Amount:
                        </span>
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                          ₹{booking.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Booking ID:
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {booking._id.slice(-8)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}

                    <div className="flex space-x-3">
                      {/* Cancel Button */}

                      {!isCancelled && !hasShowStarted && (
                        <button
                          onClick={() =>
                            handleCancelBooking(
                              booking._id,
                              booking.show.movie.title,
                              booking.totalAmount
                            )
                          }
                          disabled={isCancelling}
                          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isCancelling ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Cancelling...</span>
                            </div>
                          ) : (
                            "Cancel Booking"
                          )}
                        </button>
                      )}

                      {/* View Ticket Button */}

                      <button
                        onClick={() => window.print()}
                        className={`${
                          !isCancelled && !hasShowStarted ? "flex-1" : "w-full"
                        } bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                      >
                        {isCancelled ? "View Cancelled Ticket" : "View Ticket"}
                      </button>
                    </div>
                    {/* Cancellation Info */}

                    {isCancelled && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 text-sm font-medium">
                          ⚠️ This booking has been cancelled. Refund will be
                          processed within 5-7 working days.
                        </p>
                      </div>
                    )}

                    {/* Show Started Info */}

                    {!isCancelled && hasShowStarted && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-gray-600 text-sm">
                          ℹ️ Show has started. Cancellation is no longer
                          available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
