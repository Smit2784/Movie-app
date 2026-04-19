import React, { useState, useEffect, useCallback } from "react";
import {
    Wallet,
    Plus,
    ArrowDownToLine,
    ArrowUpFromLine,
    History,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    AlertCircle,
    CreditCard,
    Smartphone,
    Building2,
    Gift,
    ShieldCheck,
    Info,
    Sparkles,
    IndianRupee,
    ArrowLeft,
    Filter,
} from "lucide-react";
import { useAuth, api } from "../Contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
    validateUPI,
    validateCardNumber,
    validateCVV,
    validateExpiry,
    validateCardholderName,
    validateBankSelection,
    validateAccountNumber,
} from "../utils/validation";

const QUICK_ADD_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const PAYMENT_METHODS = [
    {
        id: "upi",
        label: "UPI",
        icon: <Smartphone size={18} />,
        color: "text-green-400",
    },
    {
        id: "card",
        label: "Card",
        icon: <CreditCard size={18} />,
        color: "text-blue-400",
    },
    {
        id: "netbanking",
        label: "Net Banking",
        icon: <Building2 size={18} />,
        color: "text-orange-400",
    },
];

const FILTER_OPTIONS = [
    { value: "all", label: "All" },
    { value: "add_money", label: "Added" },
    { value: "booking_payment", label: "Spent" },
    // { value: "withdrawal", label: "Withdrawn" },  // Withdraw feature disabled
    { value: "refund", label: "Refunds" },
];

const BANKS = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra Bank" },
    { id: "bob", name: "Bank of Baroda" },
    { id: "pnb", name: "Punjab National Bank" },
    { id: "idbi", name: "IDBI Bank" },
    { id: "yes", name: "Yes Bank" },
    { id: "union", name: "Union Bank of India" },
];

const WalletPage = () => {
    const { token, refreshWalletBalance, walletBalance } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState("add"); // overview, add, withdraw
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
    });
    const [txFilter, setTxFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(false);

    // Add Money State
    const [addAmount, setAddAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [addLoading, setAddLoading] = useState(false);
    const [addSuccess, setAddSuccess] = useState(false);
    const [addError, setAddError] = useState("");

    // Payment Detail State
    const [addUpiId, setAddUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // Withdraw State (commented out – withdraw feature disabled)
    // const [withdrawAmount, setWithdrawAmount] = useState("");
    // const [upiId, setUpiId] = useState("");
    // const [withdrawLoading, setWithdrawLoading] = useState(false);
    // const [withdrawSuccess, setWithdrawSuccess] = useState(false);
    // const [withdrawError, setWithdrawError] = useState("");
    // const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

    // Load data
    const loadSummary = useCallback(async () => {
        try {
            const data = await api.getWalletSummary(token);
            if (data.success) setSummary(data.summary);
        } catch (error) {
            console.error("Failed to load summary:", error);
        }
    }, [token]);

    const loadTransactions = useCallback(
        async (page = 1, category = "all") => {
            setTxLoading(true);
            try {
                const data = await api.getWalletTransactions(
                    token,
                    page,
                    category,
                );
                if (data.success) {
                    setTransactions(data.transactions);
                    setPagination(data.pagination);
                }
            } catch (error) {
                console.error("Failed to load transactions:", error);
            } finally {
                setTxLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([loadSummary(), loadTransactions(1, "all")]);
            setLoading(false);
        };
        init();
    }, [loadSummary, loadTransactions]);

    // Reset payment fields when switching methods
    const resetPaymentFields = () => {
        setAddUpiId("");
        setCardNumber("");
        setCardExpiry("");
        setCardCvv("");
        setCardName("");
        setSelectedBank("");
        setAccountNumber("");
        setFieldErrors({});
        setAddError("");
    };

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const clean = value.replace(/\D/g, "").slice(0, 16);
        return clean.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    // Format expiry with auto-slash
    const formatExpiry = (value) => {
        const clean = value.replace(/\D/g, "").slice(0, 4);
        if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
        return clean;
    };

    // Validate payment details based on method
    const validatePaymentDetails = () => {
        const errors = {};

        if (paymentMethod === "upi") {
            const upiErr = validateUPI(addUpiId);
            if (upiErr) errors.addUpiId = upiErr;
        } else if (paymentMethod === "card") {
            const nameErr = validateCardholderName(cardName);
            if (nameErr) errors.cardName = nameErr;

            const numErr = validateCardNumber(cardNumber.replace(/\s/g, ""));
            if (numErr) errors.cardNumber = numErr;

            const expErr = validateExpiry(cardExpiry);
            if (expErr) errors.cardExpiry = expErr;

            const cvvErr = validateCVV(cardCvv);
            if (cvvErr) errors.cardCvv = cvvErr;
        } else if (paymentMethod === "netbanking") {
            const bankErr = validateBankSelection(selectedBank);
            if (bankErr) errors.selectedBank = bankErr;

            const accErr = validateAccountNumber(accountNumber);
            if (accErr) errors.accountNumber = accErr;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Add Money Handler
    const handleAddMoney = async () => {
        const amount = Number(addAmount);
        if (!amount || amount < 100) {
            setAddError("Minimum amount is ₹100");
            return;
        }
        if (amount > 10000) {
            setAddError("Maximum amount per transaction is ₹10,000");
            return;
        }

        // Validate payment details
        if (!validatePaymentDetails()) {
            return;
        }

        setAddLoading(true);
        setAddError("");
        try {
            await api.addMoneyToWallet({ amount, paymentMethod }, token);
            setAddSuccess(true);
            setAddAmount("");
            resetPaymentFields();
            await refreshWalletBalance();
            await loadSummary();
            await loadTransactions(1, txFilter);
            setTimeout(() => {
                setAddSuccess(false);
                setActiveTab("overview");
            }, 2500);
        } catch (error) {
            setAddError(error.message);
        } finally {
            setAddLoading(false);
        }
    };

    // Withdraw Money Handler (commented out – withdraw feature disabled)
    // const handleWithdraw = async () => {
    //     const amount = Number(withdrawAmount);
    //     if (!amount || amount < 200) {
    //         setWithdrawError("Minimum withdrawal is ₹200");
    //         return;
    //     }
    //     if (amount > walletBalance) {
    //         setWithdrawError("Insufficient balance");
    //         return;
    //     }
    //     if (!upiId || !upiId.includes("@")) {
    //         setWithdrawError("Enter a valid UPI ID (e.g. name@upi)");
    //         return;
    //     }
    //
    //     setWithdrawLoading(true);
    //     setWithdrawError("");
    //     try {
    //         await api.withdrawFromWallet({ amount, upiId }, token);
    //         setWithdrawSuccess(true);
    //         setWithdrawAmount("");
    //         setUpiId("");
    //         setShowWithdrawConfirm(false);
    //         await refreshWalletBalance();
    //         await loadSummary();
    //         await loadTransactions(1, txFilter);
    //         setTimeout(() => {
    //             setWithdrawSuccess(false);
    //             setActiveTab("overview");
    //         }, 2500);
    //     } catch (error) {
    //         setWithdrawError(error.message);
    //     } finally {
    //         setWithdrawLoading(false);
    //     }
    // };

    // Filter transactions
    const handleFilterChange = (category) => {
        setTxFilter(category);
        loadTransactions(1, category);
    };

    // Format date
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case "add_money":
                return <Plus size={16} className="text-green-600" />;
            case "withdrawal":
                return (
                    <ArrowUpFromLine size={16} className="text-orange-500" />
                );
            case "booking_payment":
                return <CreditCard size={16} className="text-rose-500" />;
            case "refund":
                return <RefreshCw size={16} className="text-blue-500" />;
            case "gift_card":
                return <Gift size={16} className="text-purple-500" />;
            case "cashback":
                return <Sparkles size={16} className="text-amber-500" />;
            default:
                return <IndianRupee size={16} className="text-slate-400" />;
        }
    };

    const getCategoryLabel = (category) => {
        switch (category) {
            case "add_money":
                return "Money Added";
            case "withdrawal":
                return "Withdrawal";
            case "booking_payment":
                return "Booking Payment";
            case "refund":
                return "Refund";
            case "gift_card":
                return "Gift Card";
            case "cashback":
                return "Cashback";
            default:
                return "Transaction";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold text-sm">
                        Loading Wallet...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-28 lg:pb-12">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-purple-100 via-white to-indigo-50"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 pt-8 pb-6 relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 group transition-all"
                    >
                        <ArrowLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span className="text-sm font-bold">
                            Back to Movies
                        </span>
                    </button>

                    {/* Balance Hero Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Balance Section */}
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-[0_10px_30px_rgba(251,191,36,0.25)]">
                                    <Wallet size={32} className="text-black" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                        MovieTix Wallet
                                    </p>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                                        ₹
                                        {walletBalance?.toLocaleString(
                                            "en-IN",
                                        ) || "0"}
                                    </h1>
                                    <p className="text-xs text-slate-400 font-bold mt-1">
                                        Available Balance
                                    </p>
                                </div>
                            </div>

                            {/* Summary Stats */}
                            {summary && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <StatBadge
                                        label="Added"
                                        value={summary.totalAdded}
                                        icon={<TrendingUp size={14} />}
                                        color="text-green-600"
                                        bg="bg-green-50"
                                    />
                                    <StatBadge
                                        label="Spent"
                                        value={summary.totalSpent}
                                        icon={<TrendingDown size={14} />}
                                        color="text-rose-600"
                                        bg="bg-rose-50"
                                    />
                                    {/* Withdrawn stat badge – withdraw feature disabled */}
                                    {/* <StatBadge
                                        label="Withdrawn"
                                        value={summary.totalWithdrawn}
                                        icon={<ArrowUpFromLine size={14} />}
                                        color="text-orange-600"
                                        bg="bg-orange-50"
                                    /> */}
                                    <StatBadge
                                        label="Refunded"
                                        value={summary.totalRefunded}
                                        icon={<RefreshCw size={14} />}
                                        color="text-blue-600"
                                        bg="bg-blue-50"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    setActiveTab("add");
                                    setAddError("");
                                    setAddSuccess(false);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                                    activeTab === "add"
                                        ? "bg-green-500 text-white shadow-[0_8px_25px_rgba(34,197,94,0.3)] scale-105"
                                        : "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                                }`}
                            >
                                <Plus size={18} />
                                Add Money
                            </button>
                            {/* Withdraw button – withdraw feature disabled */}
                            {/* <button
                                onClick={() => {
                                    setActiveTab("withdraw");
                                    setWithdrawError("");
                                    setWithdrawSuccess(false);
                                    setShowWithdrawConfirm(false);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                                    activeTab === "withdraw"
                                        ? "bg-orange-500 text-white shadow-[0_8px_25px_rgba(249,115,22,0.3)] scale-105"
                                        : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
                                }`}
                            >
                                <ArrowUpFromLine size={18} />
                                Withdraw
                            </button> */}
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all duration-300 ${
                                    activeTab === "overview"
                                        ? "bg-purple-500 text-white shadow-[0_8px_25px_rgba(168,85,247,0.3)] scale-105"
                                        : "bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100"
                                }`}
                            >
                                <History size={18} />
                                History
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 mt-6">
                {/* ADD MONEY TAB */}
                {activeTab === "add" && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {addSuccess ? (
                            <SuccessCard
                                title="Money Added Successfully!"
                                message={`₹${addAmount || "—"} has been added to your wallet`}
                                icon={
                                    <CheckCircle2
                                        size={48}
                                        className="text-green-400"
                                    />
                                }
                            />
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                        <Plus
                                            size={20}
                                            className="text-green-600"
                                        />
                                    </div>
                                    Add Money to Wallet
                                </h2>

                                {/* Quick Add Presets */}
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Quick Add
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                                    {QUICK_ADD_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => {
                                                setAddAmount(String(amt));
                                                setAddError("");
                                            }}
                                            className={`py-3 rounded-xl font-black text-sm transition-all duration-200 ${
                                                Number(addAmount) === amt
                                                    ? "bg-green-500 text-white shadow-[0_4px_15px_rgba(34,197,94,0.3)] scale-105"
                                                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105"
                                            }`}
                                        >
                                            ₹{amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Amount */}
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Or Enter Amount
                                </p>
                                <div className="relative mb-6">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        value={addAmount}
                                        onChange={(e) => {
                                            setAddAmount(e.target.value);
                                            setAddError("");
                                        }}
                                        placeholder="Enter amount"
                                        min="100"
                                        max="10000"
                                        maxLength="5"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-2xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                                    />
                                </div>

                                {/* Payment Method */}
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                    Payment Method
                                </p>
                                <div className="flex gap-3 mb-6">
                                    {PAYMENT_METHODS.map((pm) => (
                                        <button
                                            key={pm.id}
                                            onClick={() => {
                                                setPaymentMethod(pm.id);
                                                resetPaymentFields();
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                                                paymentMethod === pm.id
                                                    ? "bg-purple-50 border-2 border-purple-400 text-purple-700 shadow-[0_4px_15px_rgba(168,85,247,0.12)]"
                                                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                                            }`}
                                        >
                                            <span className={pm.color}>
                                                {pm.icon}
                                            </span>
                                            {pm.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Payment Details - UPI */}
                                {paymentMethod === "upi" && (
                                    <div className="mb-6 animate-in fade-in slide-in-from-top-3 duration-300">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                                            Enter UPI ID
                                        </p>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <Smartphone
                                                    size={18}
                                                    className="text-green-500"
                                                />
                                            </span>
                                            <input
                                                type="text"
                                                value={addUpiId}
                                                onChange={(e) => {
                                                    setAddUpiId(e.target.value);
                                                    setFieldErrors((prev) => ({
                                                        ...prev,
                                                        addUpiId: "",
                                                    }));
                                                }}
                                                placeholder="yourname@upi"
                                                className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none transition-all ${
                                                    fieldErrors.addUpiId
                                                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                        : "border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                                                }`}
                                            />
                                        </div>
                                        {fieldErrors.addUpiId && (
                                            <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
                                                <XCircle size={12} />
                                                {fieldErrors.addUpiId}
                                            </p>
                                        )}
                                        <p className="text-[10px] text-slate-400 mt-2">
                                            Example: name@okicici, name@ybl,
                                            9876543210@paytm
                                        </p>
                                    </div>
                                )}

                                {/* Payment Details - Card */}
                                {paymentMethod === "card" && (
                                    <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                                        {/* Cardholder Name */}
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Cardholder Name
                                            </p>
                                            <input
                                                type="text"
                                                value={cardName}
                                                onChange={(e) => {
                                                    setCardName(e.target.value);
                                                    setFieldErrors((prev) => ({
                                                        ...prev,
                                                        cardName: "",
                                                    }));
                                                }}
                                                placeholder="John Doe"
                                                className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none transition-all ${
                                                    fieldErrors.cardName
                                                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                }`}
                                            />
                                            {fieldErrors.cardName && (
                                                <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                    <XCircle size={12} />
                                                    {fieldErrors.cardName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Card Number */}
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Card Number
                                            </p>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                    <CreditCard
                                                        size={18}
                                                        className="text-blue-500"
                                                    />
                                                </span>
                                                <input
                                                    type="text"
                                                    value={cardNumber}
                                                    onChange={(e) => {
                                                        setCardNumber(
                                                            formatCardNumber(
                                                                e.target.value,
                                                            ),
                                                        );
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                cardNumber: "",
                                                            }),
                                                        );
                                                    }}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                    className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none tracking-widest transition-all ${
                                                        fieldErrors.cardNumber
                                                            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    }`}
                                                />
                                            </div>
                                            {fieldErrors.cardNumber && (
                                                <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                    <XCircle size={12} />
                                                    {fieldErrors.cardNumber}
                                                </p>
                                            )}
                                        </div>

                                        {/* Expiry & CVV Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                    Expiry
                                                </p>
                                                <input
                                                    type="text"
                                                    value={cardExpiry}
                                                    onChange={(e) => {
                                                        setCardExpiry(
                                                            formatExpiry(
                                                                e.target.value,
                                                            ),
                                                        );
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                cardExpiry: "",
                                                            }),
                                                        );
                                                    }}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none text-center tracking-widest transition-all ${
                                                        fieldErrors.cardExpiry
                                                            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    }`}
                                                />
                                                {fieldErrors.cardExpiry && (
                                                    <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                        <XCircle size={12} />
                                                        {fieldErrors.cardExpiry}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                    CVV
                                                </p>
                                                <input
                                                    type="password"
                                                    value={cardCvv}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value
                                                                .replace(
                                                                    /\D/g,
                                                                    "",
                                                                )
                                                                .slice(0, 4);
                                                        setCardCvv(val);
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                cardCvv: "",
                                                            }),
                                                        );
                                                    }}
                                                    placeholder="•••"
                                                    maxLength="4"
                                                    className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none text-center tracking-[0.4em] transition-all ${
                                                        fieldErrors.cardCvv
                                                            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    }`}
                                                />
                                                {fieldErrors.cardCvv && (
                                                    <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                        <XCircle size={12} />
                                                        {fieldErrors.cardCvv}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Details - Net Banking */}
                                {paymentMethod === "netbanking" && (
                                    <div className="mb-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                                        {/* Bank Selection */}
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Select Bank
                                            </p>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                    <Building2
                                                        size={18}
                                                        className="text-orange-500"
                                                    />
                                                </span>
                                                <select
                                                    value={selectedBank}
                                                    onChange={(e) => {
                                                        setSelectedBank(
                                                            e.target.value,
                                                        );
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                selectedBank:
                                                                    "",
                                                            }),
                                                        );
                                                    }}
                                                    className={`w-full bg-slate-50 border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:outline-none transition-all appearance-none cursor-pointer ${
                                                        fieldErrors.selectedBank
                                                            ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                            : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                                    }`}
                                                >
                                                    <option
                                                        value=""
                                                        className="text-slate-400"
                                                    >
                                                        Choose your bank
                                                    </option>
                                                    {BANKS.map((bank) => (
                                                        <option
                                                            key={bank.id}
                                                            value={bank.id}
                                                        >
                                                            {bank.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {fieldErrors.selectedBank && (
                                                <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                    <XCircle size={12} />
                                                    {fieldErrors.selectedBank}
                                                </p>
                                            )}
                                        </div>

                                        {/* Account Number */}
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                                                Account Number
                                            </p>
                                            <input
                                                type="text"
                                                value={accountNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 18);
                                                    setAccountNumber(val);
                                                    setFieldErrors((prev) => ({
                                                        ...prev,
                                                        accountNumber: "",
                                                    }));
                                                }}
                                                placeholder="Enter account number"
                                                maxLength="18"
                                                className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none tracking-wider transition-all ${
                                                    fieldErrors.accountNumber
                                                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                                                        : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                                }`}
                                            />
                                            {fieldErrors.accountNumber && (
                                                <p className="text-xs font-bold text-rose-500 mt-1.5 flex items-center gap-1">
                                                    <XCircle size={12} />
                                                    {fieldErrors.accountNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Info */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
                                    <Info
                                        size={16}
                                        className="text-amber-500 mt-0.5 shrink-0"
                                    />
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <p>
                                            Minimum:{" "}
                                            <span className="text-amber-600 font-bold">
                                                ₹100
                                            </span>{" "}
                                            • Maximum:{" "}
                                            <span className="text-amber-600 font-bold">
                                                ₹10,000
                                            </span>{" "}
                                            per transaction
                                        </p>
                                        <p>
                                            Wallet cap:{" "}
                                            <span className="text-amber-600 font-bold">
                                                ₹50,000
                                            </span>{" "}
                                            total balance
                                        </p>
                                    </div>
                                </div>

                                {/* Error */}
                                {addError && (
                                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 flex items-center gap-3">
                                        <XCircle
                                            size={18}
                                            className="text-rose-500 shrink-0"
                                        />
                                        <p className="text-sm font-bold text-rose-600">
                                            {addError}
                                        </p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleAddMoney}
                                    disabled={addLoading || !addAmount}
                                    className="w-full py-4 rounded-2xl font-black text-base bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-[0_10px_30px_rgba(34,197,94,0.2)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.3)] transition-all duration-300 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {addLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={20} />
                                            Add ₹
                                            {Number(
                                                addAmount || 0,
                                            ).toLocaleString()}{" "}
                                            to Wallet
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* WITHDRAW TAB – withdraw feature disabled (entire block removed) */}

                {/* OVERVIEW / HISTORY TAB */}
                {activeTab === "overview" && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {/* Wallet Tips */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <TipCard
                                icon={
                                    <ShieldCheck
                                        size={20}
                                        className="text-green-600"
                                    />
                                }
                                title="Secure Payments"
                                description="All wallet transactions are encrypted and secure"
                                gradient="from-green-50 to-emerald-50"
                                border="border-green-200"
                            />
                            <TipCard
                                icon={
                                    <Sparkles
                                        size={20}
                                        className="text-purple-600"
                                    />
                                }
                                title="Instant Booking"
                                description="Pay for movie tickets instantly using your wallet"
                                gradient="from-purple-50 to-indigo-50"
                                border="border-purple-200"
                            />
                            <TipCard
                                icon={
                                    <RefreshCw
                                        size={20}
                                        className="text-blue-600"
                                    />
                                }
                                title="Auto Refunds"
                                description="Cancelled booking refunds are credited automatically"
                                gradient="from-blue-50 to-cyan-50"
                                border="border-blue-200"
                            />
                        </div>

                        {/* Transaction History */}
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                        <History
                                            size={20}
                                            className="text-purple-600"
                                        />
                                    </div>
                                    Transaction History
                                    <span className="hidden sm:flex text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                        {pagination.total} total
                                    </span>
                                </h2>

                                {/* Filters */}
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                                    {FILTER_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() =>
                                                handleFilterChange(opt.value)
                                            }
                                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 ${
                                                txFilter === opt.value
                                                    ? "bg-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.25)]"
                                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Transactions List */}
                            {txLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <History
                                            size={32}
                                            className="text-slate-300"
                                        />
                                    </div>
                                    <p className="text-slate-500 font-bold text-sm">
                                        No transactions yet
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Add money to your wallet to get started
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {transactions.map((tx) => (
                                        <div
                                            key={tx._id}
                                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 group"
                                        >
                                            {/* Icon */}
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                {getCategoryIcon(tx.category)}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-slate-800 truncate">
                                                    {getCategoryLabel(
                                                        tx.category,
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {tx.description}
                                                </p>
                                            </div>

                                            {/* Amount & Date */}
                                            <div className="text-right shrink-0">
                                                <p
                                                    className={`text-sm font-black ${
                                                        tx.type === "credit"
                                                            ? "text-green-600"
                                                            : "text-rose-500"
                                                    }`}
                                                >
                                                    {tx.type === "credit"
                                                        ? "+"
                                                        : "-"}
                                                    ₹
                                                    {tx.amount.toLocaleString(
                                                        "en-IN",
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold">
                                                    {formatDate(tx.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() =>
                                            loadTransactions(
                                                pagination.current - 1,
                                                txFilter,
                                            )
                                        }
                                        disabled={pagination.current <= 1}
                                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-xs font-black text-slate-400">
                                        Page {pagination.current} of{" "}
                                        {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() =>
                                            loadTransactions(
                                                pagination.current + 1,
                                                txFilter,
                                            )
                                        }
                                        disabled={
                                            pagination.current >=
                                            pagination.pages
                                        }
                                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sub-components
const StatBadge = ({ label, value, icon, color, bg }) => (
    <div className={`${bg} rounded-xl p-3 text-center border border-slate-100`}>
        <div className={`flex items-center justify-center gap-1 ${color} mb-1`}>
            {icon}
            <span className="text-[10px] font-black uppercase tracking-wider">
                {label}
            </span>
        </div>
        <p className="text-sm font-black text-slate-800">
            ₹{(value || 0).toLocaleString("en-IN")}
        </p>
    </div>
);

const SuccessCard = ({ title, message, icon }) => (
    <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex justify-center animate-bounce">{icon}</div>
        <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
    </div>
);

const TipCard = ({ icon, title, description, gradient, border }) => (
    <div
        className={`bg-linear-to-r ${gradient} rounded-2xl border ${border} p-5 hover:scale-[1.02] transition-transform duration-300`}
    >
        <div className="mb-3">{icon}</div>
        <h3 className="text-sm font-black text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
);

export default WalletPage;
