import React, { useState, useEffect } from "react";
import { Gift, Heart, Star, Calendar, CreditCard, Wallet } from "lucide-react";
import { useAuth, api } from "../Contexts/AuthProvider";
import { API_BASE_URL } from '../Contexts/AuthProvider';


export const GiftCards = () => {
  const [activeTab, setActiveTab] = useState("purchase");
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [giftCardHistory, setGiftCardHistory] = useState([]);
  const { user, token } = useAuth();

  const predefinedAmounts = [250, 500, 1000, 1500, 2000, 3000];

  useEffect(() => {
    if (token) {
      fetchWalletBalance();
      fetchGiftCardHistory();
    }
  }, [token]);

  const fetchWalletBalance = async () => {
    try {
      const data = await api.getWalletBalance(token);
      setWalletBalance(data.walletBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

const fetchGiftCardHistory = async () => {
  try {
    console.log("🔍 Fetching gift card history...");
    
    const response = await fetch(`${API_BASE_URL}/gift-cards/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚫 History fetch error:", errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Gift card history received:", data);
    setGiftCardHistory(data);
  } catch (error) {
    console.error("❌ Error fetching gift card history:", error);
    // Don't show alert for history errors, just log them
  }
};


const handlePurchaseGiftCard = async () => {
  if (!user) {
    alert("Please log in to purchase gift cards");
    return;
  }

  const amount = customAmount || selectedAmount;
  if (amount < 100 || amount > 10000) {
    alert("Gift card amount must be between ₹100 and ₹10,000");
    return;
  }

  if (!recipientEmail || !recipientName || !senderName) {
    alert("Please fill in all required fields");
    return;
  }

  setIsProcessing(true);

  try {
    console.log("🔍 Debug: API_BASE_URL:", API_BASE_URL);
    console.log("🔍 Debug: Token:", token ? "Token exists" : "No token");
    console.log("🔍 Debug: Purchase data:", {
      amount: parseInt(amount),
      recipientEmail,
      recipientName,
      senderName
    });

    const response = await fetch(`${API_BASE_URL}/gift-cards/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: parseInt(amount),
        recipientEmail,
        recipientName,
        senderName,
        message: message || `Enjoy movies with MovieTix! From ${senderName}`,
      }),
    });

    console.log("🔍 Debug: Response status:", response.status);
    console.log("🔍 Debug: Response ok:", response.ok);

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("🚫 Server error response:", errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Purchase response:", result);

    if (result.success) {
      alert(`Gift card purchased successfully! Code: ${result.giftCard.code}`);
      // Reset form
      setRecipientEmail("");
      setRecipientName("");
      setSenderName("");
      setMessage("");
      setCustomAmount("");
      fetchWalletBalance();
      fetchGiftCardHistory();
    } else {
      alert(result.message || "Failed to purchase gift card");
    }
  } catch (error) {
    console.error("❌ Error purchasing gift card:", error);
    
    // More specific error messages
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert("Network error: Cannot connect to server. Please check if the server is running.");
    } else if (error.message.includes('404')) {
      alert("API endpoint not found. Please check backend implementation.");
    } else {
      alert(`Purchase failed: ${error.message}`);
    }
  } finally {
    setIsProcessing(false);
  }
};


const handleRedeemGiftCard = async () => {
  if (!user) {
    alert("Please log in to redeem gift cards");
    return;
  }

  if (!redeemCode || redeemCode.length < 6) {
    alert("Please enter a valid gift card code");
    return;
  }

  setIsProcessing(true);

  try {
    console.log("🔍 Debug: Redeeming gift card code:", redeemCode);

    const response = await fetch(`${API_BASE_URL}/gift-cards/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: redeemCode.toUpperCase() })
    });

    const result = await response.json();
    console.log("📋 Server response:", result);

    if (response.ok && result.success) {
      alert(`Gift card redeemed successfully! ₹${result.amount} added to your wallet.`);
      setRedeemCode("");
      fetchWalletBalance();
      fetchGiftCardHistory();
    } else {
      // Handle business logic errors (invalid codes, etc.)
      alert(result.message || "Failed to redeem gift card");
    }
  } catch (error) {
    console.error("❌ Network error:", error);
    alert("Network error. Please check your connection and try again.");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Gift className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">MovieTix Gift Cards</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Give the gift of entertainment! Perfect for birthdays, holidays, or any special occasion.
          </p>
        </div>

        {/* Wallet Balance Display */}
        {user && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-8 text-center">
            <div className="flex items-center justify-center">
              <Wallet className="h-5 w-5 mr-2" />
              <span className="text-lg font-semibold">Current Wallet Balance: ₹{walletBalance}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-2 shadow-md">
            <button
              onClick={() => setActiveTab("purchase")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "purchase"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Gift className="inline h-5 w-5 mr-2" />
              Purchase Gift Card
            </button>
            <button
              onClick={() => setActiveTab("redeem")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "redeem"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Star className="inline h-5 w-5 mr-2" />
              Redeem Gift Card
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Calendar className="inline h-5 w-5 mr-2" />
              My Gift Cards
            </button>
          </div>
        </div>

        {/* Purchase Gift Card Tab */}
        {activeTab === "purchase" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Gift Card Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Gift Card Preview</h3>
              <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <Gift className="h-32 w-32" />
                </div>
                <div className="relative">
                  <h4 className="text-2xl font-bold mb-2">MovieTix</h4>
                  <p className="text-lg mb-4">Gift Card</p>
                  <div className="text-3xl font-bold mb-4">
                    ₹{customAmount || selectedAmount}
                  </div>
                  <p className="text-sm opacity-90 mb-2">To: {recipientName || "Recipient Name"}</p>
                  <p className="text-sm opacity-90 mb-4">From: {senderName || "Your Name"}</p>
                  <p className="text-xs opacity-75 bg-white bg-opacity-20 p-2 rounded">
                    {message || "Enjoy movies with MovieTix!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Purchase Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Purchase Details</h3>
              
              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`p-3 border rounded-lg text-center font-semibold transition-all ${
                        selectedAmount === amount && !customAmount
                          ? "border-purple-600 bg-purple-50 text-purple-600"
                          : "border-gray-300 hover:border-purple-400"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Enter custom amount (₹100 - ₹10,000)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  min="100"
                  max="10000"
                />
              </div>

              {/* Recipient Details */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Recipient's full name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  rows="3"
                  placeholder="Add a personal message..."
                  maxLength="200"
                />
                <p className="text-sm text-gray-500 mt-1">{message.length}/200 characters</p>
              </div>

              <button
                onClick={handlePurchaseGiftCard}
                disabled={isProcessing || !user}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Purchase Gift Card - ₹{customAmount || selectedAmount}
                  </>
                )}
              </button>

              {!user && (
                <p className="text-center text-red-600 mt-4">
                  Please log in to purchase gift cards
                </p>
              )}
            </div>
          </div>
        )}

        {/* Redeem Gift Card Tab */}
        {activeTab === "redeem" && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Redeem Gift Card</h3>
              <p className="text-gray-600 mt-2">Enter your gift card code to add balance to your wallet</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift Card Code *
              </label>
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-center text-lg font-mono tracking-wider"
                placeholder="XXXXXXXX"
                maxLength="12"
                required
              />
            </div>

            <button
              onClick={handleRedeemGiftCard}
              disabled={isProcessing || !user}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Star className="h-5 w-5 mr-2" />
                  Redeem Gift Card
                </>
              )}
            </button>

            {!user && (
              <p className="text-center text-red-600 mt-4">
                Please log in to redeem gift cards
              </p>
            )}
          </div>
        )}

        {/* Gift Card History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">My Gift Cards</h3>
            
            {giftCardHistory.length > 0 ? (
              <div className="space-y-4">
                {giftCardHistory.map((giftCard) => (
                  <div key={giftCard._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <Gift className="h-5 w-5 text-purple-600 mr-2" />
                          <span className="font-semibold text-lg">₹{giftCard.amount}</span>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            giftCard.status === 'active' ? 'bg-green-100 text-green-800' : 
                            giftCard.status === 'redeemed' ? 'bg-gray-100 text-gray-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {giftCard.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">
                          <strong>Code:</strong> {giftCard.code}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>To:</strong> {giftCard.recipientName} ({giftCard.recipientEmail})
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>From:</strong> {giftCard.senderName}
                        </p>
                        {giftCard.message && (
                          <p className="text-gray-600 mb-1">
                            <strong>Message:</strong> {giftCard.message}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(giftCard.createdAt).toLocaleDateString()}</p>
                        {giftCard.redeemedAt && (
                          <p>Redeemed: {new Date(giftCard.redeemedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No gift cards found</p>
                <p className="text-gray-500">Purchase or receive gift cards to see them here</p>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Perfect Gift</h4>
            <p className="text-gray-600">
              Give the gift of entertainment for any occasion
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Easy to Use</h4>
            <p className="text-gray-600">
              Simple redemption process and instant wallet credit
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">No Expiry</h4>
            <p className="text-gray-600">
              Gift cards never expire and can be used anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
