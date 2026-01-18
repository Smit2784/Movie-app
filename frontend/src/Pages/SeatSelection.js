import React, {
  useState,
  useEffect
} from "react";
import { API_BASE_URL } from "../Contexts/AuthProvider";


export const SeatSelection = ({ show, onSeatSelect, selectedSeats }) => {
  const [currentShow, setCurrentShow] = useState(show);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (!refreshing) {
        setRefreshing(true);
        try {
          const response = await fetch(`${API_BASE_URL}/shows/${show._id}`);
          const updatedShow = await response.json();
          setCurrentShow(updatedShow);

          const nowBooked = selectedSeats.filter((seat) =>
            updatedShow.bookedSeats.includes(String(seat))
          );

          if (nowBooked.length > 0) {
            console.log(
              "⚠️ Some selected seats were booked by others:",
              nowBooked
            );
            alert(
              `Seats ${nowBooked.join(
                ", "
              )} are no longer available. Please select different seats.`
            );
          }
        } catch (error) {
          console.error("Error refreshing seats:", error);
        }
        setRefreshing(false);
      }
    }, 10000);

    return () => clearInterval(refreshInterval);
  }, [show._id, selectedSeats, refreshing]);

  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 15;
    const seats = [];

    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          id: seatId,
          row,
          number: i,
          isBooked: currentShow.bookedSeats.includes(seatId),
          isSelected: selectedSeats.includes(seatId),
        });
      }
    });

    return seats;
  };

  const seats = generateSeats();

  const getSeatColor = (seat) => {
    if (seat.isBooked)
      return "bg-red-500 hover:bg-red-600 cursor-not-allowed text-white border-red-600";
    if (seat.isSelected)
      return "bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-lg transform scale-105";
    return "bg-gray-200 hover:bg-blue-400 hover:text-white cursor-pointer border-gray-300 hover:border-blue-500 hover:shadow-md";
  };

  const seatsByRow = {};
  seats.forEach((seat) => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = [];
    }
    seatsByRow[seat.row].push(seat);
  });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl max-w-6xl mx-auto border border-gray-100">
      {/* Header */}

      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-gray-800 mb-2">
          Select Your Seats
        </h2>
        <p className="text-gray-600 text-lg">
          Choose your preferred seats for the best movie experience
        </p>
        {refreshing && (
          <div className="flex items-center justify-center mt-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-blue-500 text-sm">
              Refreshing seat availability...
            </span>
          </div>
        )}
      </div>

      {/* Screen Indicator */}

      <div className="relative mb-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="h-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-t-3xl shadow-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest">
              SCREEN
            </span>
          </div>
          <div className="h-2 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 rounded-b-lg opacity-50"></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 font-medium">
            All eyes on the screen
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center mb-10 space-x-8 bg-gray-50 py-4 px-8 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-gray-200 border border-gray-300 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-green-500 border border-green-600 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Selected</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-red-500 border border-red-600 shadow-sm"></div>
          <span className="text-sm font-semibold text-gray-700">Booked</span>
        </div>
      </div>

      {/* Seats Grid */}

      <div className="space-y-3 max-w-5xl mx-auto">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center justify-center space-x-2">
            {/* Row Label */}

            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 text-lg mr-4">
              {row}
            </div>

            {/* Seats in this row */}
            <div className="flex space-x-2">
              {rowSeats.map((seat) => (
                <button
                  key={seat.id}
                  disabled={seat.isBooked}
                  onClick={() => !seat.isBooked && onSeatSelect(seat.id)}
                  className={`
                    w-9 h-9 rounded-lg border-2 text-xs font-bold 
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-4 focus:ring-purple-300
                    ${getSeatColor(seat)}
                    ${seat.isSelected ? "animate-pulse" : ""}
                  `}
                  title={`Seat ${seat.id} - ${
                    seat.isBooked
                      ? "Booked"
                      : seat.isSelected
                      ? "Selected"
                      : "Available"
                  }`}
                >
                  {seat.number}
                </button>
              ))}
            </div>

            {/* Row Label (Right Side) */}

            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 text-lg ml-4">
              {row}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Numbers Guide */}

      <div className="flex justify-between max-w-5xl mx-auto mt-6 px-12">
        <span className="text-xs font-medium text-gray-500">1</span>
        <span className="text-xs font-medium text-gray-500">8</span>
        <span className="text-xs font-medium text-gray-500">15</span>
      </div>

      {/* Selection Summary */}

      <div className="mt-10 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-600">
                {selectedSeats.length}
              </div>
              <div className="text-sm text-gray-600">Seats Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                ₹{currentShow.price}
              </div>
              <div className="text-sm text-gray-600">Per Seat</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">
                ₹{selectedSeats.length * currentShow.price}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Selected Seats:
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Click on available seats to select • Maximum 10 seats per booking •
          Real-time availability updates
        </p>
      </div>
    </div>
  );
};