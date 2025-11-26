import React, {
  useState,
  useEffect
} from "react";
import { useAuth } from "../Contexts/AuthProvider";
import { api } from "../Contexts/AuthProvider";

export const PaymentPage = ({ booking, onBack, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageWalletBalance, setPageWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const { token, refreshWalletBalance } = useAuth();
  const showId = booking.show._id || booking.show.id || booking.showId;
  const { seats, totalAmount } = booking;

  const walletAmountUsed = useWallet
    ? Math.min(pageWalletBalance, totalAmount)
    : 0;
  const remainingAmount = totalAmount - walletAmountUsed;
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    upiId: "",
    wallet: "paytm",
  });
  const [errors, setErrors] = useState({});
  const [walletAmount] = useState(0);

  useEffect(() => {
    if (token) {
      api
        .getWalletBalance(token)
        .then((data) => setPageWalletBalance(data.walletBalance))
        .catch((err) =>
          console.error("Error fetching wallet balance for PaymentPage:", err)
        );
    }
  }, [token]);

  if (!booking || !booking.show || !booking.show.movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">
            Loading Payment Details...
          </div>
        </div>
      </div>
    );
  }

  // The rest of the component logic remains the same.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const validateForm = () => {
    const newErrors = {};
    if (useWallet && walletAmount >= booking.totalAmount) {
      return true;
    }
    if (remainingAmount > 0) {
      if (paymentMethod === "card") {
        if (
          !formData.cardNumber ||
          formData.cardNumber.replace(/\s/g, "").length < 16
        )
          newErrors.cardNumber = "Please enter a valid 16-digit card number";
        if (!formData.cardName || formData.cardName.length < 3)
          newErrors.cardName = "Please enter the cardholder name";
        if (!formData.expiryMonth || !formData.expiryYear)
          newErrors.expiry = "Please enter expiry date";
        if (!formData.cvv || formData.cvv.length < 3)
          newErrors.cvv = "Please enter a valid CVV";
      } else if (paymentMethod === "upi") {
        if (!formData.upiId || !formData.upiId.includes("@"))
          newErrors.upiId = "Please enter a valid UPI ID";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if ((!useWallet || (useWallet && remainingAmount > 0)) && paymentMethod === "card" || paymentMethod === "upi") {
    if (!validateForm()) {
      return;  
    }
  } 

    setIsProcessing(true);
    const bookingDataForApi = { showId, seats, totalAmount };

    try {
      let response;
      if (useWallet && walletAmountUsed >= totalAmount) {
        response = await api.walletPayment(bookingDataForApi, token);
      } else if (useWallet && walletAmountUsed > 0) {
        const splitData = {
          ...bookingDataForApi,
          walletAmount: walletAmountUsed,
          externalPayment: remainingAmount,
          paymentMethod,
        };
        response = await api.splitPayment(splitData, token);
      } else {
        console.log("💳 Attempting regular payment...");
        response = await api.createBooking(bookingDataForApi, token);
      }
      
      if (response && response.success) {
        alert("Booking successful!");
        await refreshWalletBalance();
        onPaymentComplete(response);
      } else {
        throw new Error(response?.message || "Payment failed");
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      let errorMessage;
      if (error.message.includes("timeout")) {
        errorMessage =
          "Payment request timed out. Please check your connection and try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error occurred. Please check your internet connection and try again.";
      } else if (error.message.includes("no longer available")) {
        errorMessage =
          "Selected seats are no longer available. Please choose different seats.";
      } else {
        errorMessage = `Payment Error: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() + i).toString().slice(-2)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-6">
          <button
            onClick={onBack}
            className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/20 transition-all duration-300">
              <svg
                className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform duration-300"
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
            </div>
            <span className="text-lg font-semibold">Back to Booking</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                Secure Payment
              </span>
            </h1>
            <p className="text-lg text-gray-300">
              Complete your booking with our secure payment gateway
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Choose Payment Method
              </h2>
              {pageWalletBalance > 0 && (
                <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-2xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                          Use MovieTix Wallet
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Available Balance:
                          </span>
                          <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            ₹{pageWalletBalance}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-orange-500 shadow-inner"></div>
                    </div>
                  </label>

                  {useWallet && (
                    <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-yellow-100 animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">
                          Wallet payment activated
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handlePayment}>
                {(!useWallet || remainingAmount > 0) && (
                  <div className="space-y-6">
                    <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          paymentMethod === "card"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        💳 Credit/Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          paymentMethod === "upi"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        📱 UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("wallet-external")}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          paymentMethod === "wallet-external"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        💰 Wallets
                      </button>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-6">
                        {" "}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              handleInputChange({
                                target: {
                                  name: "cardNumber",
                                  value: formatCardNumber(e.target.value),
                                },
                              })
                            }
                            maxLength="19"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                              errors.cardNumber
                                ? "border-red-400"
                                : "border-gray-200 focus:border-purple-500"
                            }`}
                            placeholder="1234 5678 9012 3456"
                          />
                          {errors.cardNumber && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>{" "}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                              errors.cardName
                                ? "border-red-400"
                                : "border-gray-200 focus:border-purple-500"
                            }`}
                            placeholder="Enter name as on card"
                          />
                          {errors.cardName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cardName}
                            </p>
                          )}
                        </div>{" "}
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Expiry Month *
                            </label>
                            <select
                              name="expiryMonth"
                              value={formData.expiryMonth}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                                errors.expiry
                                  ? "border-red-400"
                                  : "border-gray-200 focus:border-purple-500"
                              }`}
                            >
                              <option value="">MM</option>
                              {months.map((month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Expiry Year *
                            </label>
                            <select
                              name="expiryYear"
                              value={formData.expiryYear}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                                errors.expiry
                                  ? "border-red-400"
                                  : "border-gray-200 focus:border-purple-500"
                              }`}
                            >
                              <option value="">YY</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="password"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              maxLength="4"
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                                errors.cvv
                                  ? "border-red-400"
                                  : "border-gray-200 focus:border-purple-500"
                              }`}
                              placeholder="***"
                            />
                          </div>
                        </div>{" "}
                        {errors.expiry && (
                          <p className="text-red-500 text-sm">
                            {errors.expiry}
                          </p>
                        )}{" "}
                        {errors.cvv && (
                          <p className="text-red-500 text-sm">{errors.cvv}</p>
                        )}{" "}
                      </div>
                    )}
                    {paymentMethod === "upi" && (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">📱</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Pay with UPI
                          </h3>
                          <p className="text-gray-600">
                            Enter your UPI ID to complete the payment
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            UPI ID *
                          </label>
                          <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-300 ${
                              errors.upiId
                                ? "border-red-400"
                                : "border-gray-200 focus:border-purple-500"
                            }`}
                            placeholder="yourname@paytm"
                          />
                          {errors.upiId && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.upiId}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {paymentMethod === "wallet-external" && (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">💰</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Choose Your Wallet
                          </h3>
                          <p className="text-gray-600">
                            Select your preferred digital wallet
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: "paytm", name: "Paytm", icon: "😎" },
                            { id: "phonepe", name: "PhonePe", icon: "🤩" },
                            { id: "googlepay", name: "Google Pay", icon: "🤠" },
                            {
                              id: "movietix",
                              name: "Amzon Pay",
                              icon: "❤️",
                            },
                          ].map((wallet) => (
                            <label key={wallet.id} className="cursor-pointer">
                              <input
                                type="radio"
                                name="wallet"
                                value={wallet.id}
                                checked={formData.wallet === wallet.id}
                                onChange={handleInputChange}
                                className="sr-only"
                              />
                              <div
                                className={`border-2 rounded-xl p-4 text-center transition-all duration-300 ${
                                  formData.wallet === wallet.id
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="text-3xl mb-2">
                                  {wallet.icon}
                                </div>
                                <div className="font-semibold text-gray-800">
                                  {wallet.name}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-2xl transform hover:scale-105"
                      } text-white`}
                    >
                      {isProcessing
                        ? "Processing..."
                        : `Pay ₹${remainingAmount}`}
                    </button>
                  </div>
                )}

                {useWallet && remainingAmount === 0 && (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${booking.totalAmount} from MovieTix Wallet`}
                  </button>
                )}
              </form>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Booking Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie:</span>
                  <span className="font-semibold text-gray-800">
                    {booking.show.movie.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theater:</span>
                  <span className="text-gray-800">
                    {booking.show.theater.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="text-gray-800">
                    {new Date(booking.show.date).toLocaleDateString()}{" "}
                    {booking.show.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-semibold text-gray-800">
                    {booking.seats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tickets:</span>
                  <span className="text-gray-800">
                    {booking.seats.length} × ₹{booking.show.price}
                  </span>
                </div>
                <hr className="my-4" />
                {useWallet && walletAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>From Wallet:</span>
                      <span className="font-semibold">-₹{walletAmount}</span>
                    </div>
                    {remainingAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Remaining:</span>
                        <span className="font-semibold">
                          ₹{remainingAmount}
                        </span>
                      </div>
                    )}
                    <hr className="my-2" />
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Your Wallet Balance</div>
                  <div className="text-3xl font-black">
                    ₹{pageWalletBalance}
                  </div>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};