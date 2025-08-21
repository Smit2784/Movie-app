import React, {
  useState
} from "react";


export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      category: "Booking Process",
      questions: [
        {
          q: "How do I book tickets online?",
          a: "Select your movie and showtime, choose your preferred seats from the interactive seating chart, and complete payment using your MovieTix wallet, credit/debit card, or UPI. You'll receive your ticket instantly via email.",
        },
        {
          q: "How many tickets can I book at once?",
          a: "You can book a maximum of 10 tickets per transaction. For bulk bookings, please contact our customer support team for assistance.",
        },
        {
          q: "Can I select specific seats?",
          a: "Yes! MovieTix offers an interactive seat selection feature. You can view the theater layout and choose your preferred seats. Gray seats are available, green are your selections, and red are already booked.",
        },
        {
          q: "Is advance booking available?",
          a: "Yes, you can book tickets in advance for upcoming shows. Advance booking opens as soon as show times are announced by theaters.",
        },
      ],
    },
    {
      category: "Payment & Wallet",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "MovieTix accepts multiple payment methods including MovieTix Wallet, credit/debit cards (Visa, MasterCard, American Express), UPI (Paytm, PhonePe, Google Pay), and net banking.",
        },
        {
          q: "How does MovieTix Wallet work?",
          a: "MovieTix Wallet allows you to store money securely for quick bookings. Add money to your wallet and use it for instant payments. You can also use wallet balance partially and pay the remaining amount through other methods.",
        },
        {
          q: "Is my payment information secure?",
          a: "Absolutely! All payments are processed using bank-level encryption and secure payment gateways. We never store your card details and follow strict security protocols.",
        },
        {
          q: "What if payment fails but money is deducted?",
          a: "If payment fails but money is deducted from your account, you'll receive an automatic refund within 5-7 working days. Contact support if you don't receive it within this timeframe.",
        },
      ],
    },
    {
      category: "Tickets & Cancellation",
      questions: [
        {
          q: "How do I get my booked tickets?",
          a: "After successful payment, you can download your ticket as a PDF from the booking confirmation page. Tickets are also sent to your registered email address with a QR code.",
        },
        {
          q: "Can I cancel my booking?",
          a: "Cancellation depends on the theater's policy. Most theaters allow cancellation up to 20 minutes to 4 hours before showtime. Check your booking email for specific cancellation terms.",
        },
        {
          q: "How do I get a refund?",
          a: "For eligible cancellations, you can choose between refund to original payment method (5-7 working days) or instant credit to MovieTix Wallet. Refund amount may be subject to cancellation fees.",
        },
        {
          q: "What if I lose my ticket?",
          a: "Don't worry! Your tickets are stored in your MovieTix account under 'My Bookings'. You can also re-download the PDF or show the QR code from your booking confirmation email.",
        },
      ],
    },
    {
      category: "Account & Support",
      questions: [
        {
          q: "Do I need to create an account to book tickets?",
          a: "Yes, creating a free MovieTix account is required for booking tickets. This helps us manage your bookings, send notifications, and provide better customer service.",
        },
        {
          q: "How do I check my booking history?",
          a: "Log into your MovieTix account and navigate to 'My Bookings' section to view all your past and upcoming bookings with complete details.",
        },
        {
          q: "What is the minimum age for children?",
          a: "Children aged 3 years and above require a separate ticket. Age restrictions may apply for certain movie ratings (A, U/A). Please check movie details before booking.",
        },
        {
          q: "How can I contact customer support?",
          a: "You can reach our customer support team via email at support@movietix.com, or use the 'Contact Us' section on our website. We're available 24/7 to assist you.",
        },
      ],
    },
  ];

  const toggleAccordion = (categoryIndex, questionIndex) => {
    const newIndex = `${categoryIndex}-${questionIndex}`;
    setActiveIndex(activeIndex === newIndex ? null : newIndex);
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400">
              Frequently Asked Questions
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Get instant answers to your movie booking questions
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm border-0 shadow-2xl"
              placeholder="Search for answers..."
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">25+</h3>
            <p className="text-gray-600">Common Questions</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">24/7</h3>
            <p className="text-gray-600">Support Available</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-yellow-100">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">💬</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Instant</h3>
            <p className="text-gray-600">Quick Answers</p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-1.009-5.927-2.709A8 8 0 119.172 16.172z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Results Found
              </h3>
              <p className="text-gray-600 text-lg">
                Try adjusting your search terms or browse all categories
              </p>
            </div>
          ) : (
            filteredFAQ.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-4"></div>
                  {category.category}
                </h2>

                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const isActive =
                      activeIndex === `${categoryIndex}-${questionIndex}`;
                    return (
                      <div
                        key={questionIndex}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
                      >
                        <button
                          onClick={() =>
                            toggleAccordion(categoryIndex, questionIndex)
                          }
                          className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 pr-4">
                            {item.q}
                          </h3>
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white transition-transform duration-300 ${
                              isActive ? "rotate-45" : ""
                            }`}
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isActive ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="px-8 pb-6 pt-2">
                            <div className="border-t border-gray-100 pt-4">
                              <p className="text-gray-700 leading-relaxed text-base">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-xl mb-3 opacity-90">
            Can't find what you're looking for? Our support team is here to
            help!
          </p>
          <p className="text-xl mb-5 opacity-90">
            Go to Contect Us page and leave your query there..
          </p>
        </div>
      </div>
    </div>
  );
};