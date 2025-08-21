import React, {
    useState
} from "react";

export const BookingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const bookingSteps = [
    {
      id: 1,
      title: "Browse Movies",
      description: "Explore currently showing movies",
      icon: "🎬",
      details: [
        "Visit the MovieTix homepage to see all currently playing movies",
        "Use the search bar to find specific movies",
        "Filter by genre, rating, or release date",
        "Click on any movie poster to view details",
      ],
      image: "movie-browse.png",
    },
    {
      id: 2,
      title: "Select Showtime",
      description: "Choose your preferred date and time",
      icon: "🕒",
      details: [
        "Select your preferred date from the calendar",
        "Choose from available theaters near you",
        "Pick a convenient showtime slot",
        "Check seat availability before proceeding",
      ],
      image: "showtime-select.png",
    },
    {
      id: 3,
      title: "Choose Seats",
      description: "Pick your perfect seats",
      icon: "💺",
      details: [
        "View the theater seating layout",
        "Available seats are shown in gray",
        "Selected seats appear in green",
        "Red seats are already booked",
        "Maximum 10 seats per booking",
      ],
      image: "seat-selection.png",
    },
    {
      id: 4,
      title: "Make Payment",
      description: "Complete your booking securely",
      icon: "💳",
      details: [
        "Use MovieTix Wallet for instant payment",
        "Pay with credit/debit cards or UPI",
        "Split payment: wallet + other methods",
        "All transactions are 100% secure",
        "Receive booking confirmation immediately",
      ],
      image: "payment-process.png",
    },
    {
      id: 5,
      title: "Get Your Ticket",
      description: "Download and enjoy your movie",
      icon: "🎫",
      details: [
        "Download your PDF ticket instantly",
        "Tickets are sent to your registered email",
        "Show QR code at theater entrance",
        "Arrive 15 minutes before showtime",
        "Enjoy your movie experience!",
      ],
      image: "ticket-download.png",
    },
  ];

  const nextStep = () => {
    if (currentStep < bookingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400">
              Booking Guide
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            Learn how to book your favorite movies in just 5 simple steps
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {bookingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    index === currentStep
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-110"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </button>
                {index < bookingSteps.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mr-4">
                    {bookingSteps[currentStep].icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Step {currentStep + 1}: {bookingSteps[currentStep].title}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {bookingSteps[currentStep].description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookingSteps[currentStep].details.map((detail, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <span className="text-gray-500 font-medium">
                    {currentStep + 1} of {bookingSteps.length}
                  </span>

                  <button
                    onClick={nextStep}
                    disabled={currentStep === bookingSteps.length - 1}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                  >
                    <span>Next</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-6xl mx-auto mb-6">
                    {bookingSteps[currentStep].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {bookingSteps[currentStep].title}
                  </h3>
                  <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💡 Pro Tips for a Better Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                Use MovieTix Wallet
              </h4>
              <p className="text-gray-600 text-sm">
                Skip payment forms and book instantly with your wallet balance
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Book in Advance</h4>
              <p className="text-gray-600 text-sm">
                Reserve your favorite seats early, especially for blockbuster
                movies
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Check Reviews</h4>
              <p className="text-gray-600 text-sm">
                Read ratings and reviews before booking your tickets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};