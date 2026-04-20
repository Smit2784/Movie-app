import React, { useState, useEffect } from "react";
import {
    Lightbulb,
    ChevronLeft,
    Trash2,
    Send,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    MessageCircle,
    Tag,
    User,
    Filter,
    Inbox,
} from "lucide-react";
import { Pagination } from "../../Components/Pagination";

const CATEGORIES = [
    { value: "feature", label: "Feature Request", color: "blue" },
    { value: "bug", label: "Bug Report", color: "red" },
    { value: "movie", label: "Movie Suggestion", color: "purple" },
    { value: "improvement", label: "Improvement", color: "amber" },
    { value: "other", label: "Other", color: "slate" },
];

const STATUS_CONFIG = {
    pending: { label: "Pending", icon: Clock, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-500" },
    reviewed: { label: "Reviewed", icon: Eye, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", dot: "bg-blue-500" },
    resolved: { label: "Resolved", icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
    rejected: { label: "Rejected", icon: XCircle, bg: "bg-red-50", text: "text-red-600", border: "border-red-200", dot: "bg-red-500" },
};

const AdminSuggestions = ({ onBack }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyStatus, setReplyStatus] = useState("reviewed");
    const [sending, setSending] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/admin/suggestions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setSuggestions(data.suggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;
        setSending(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/admin/suggestions/${id}/reply`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ adminReply: replyText, status: replyStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setReplyingTo(null);
                setReplyText("");
                setReplyStatus("reviewed");
                fetchSuggestions();
            } else {
                alert(data.message || "Failed to reply");
            }
        } catch (error) {
            alert("Network error");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this suggestion permanently?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/api/admin/suggestions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSuggestions();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/api/admin/suggestions/${id}/reply`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus, adminReply: suggestions.find(s => s._id === id)?.adminReply || '' }),
            });
            fetchSuggestions();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const filteredSuggestions = filter === "all"
        ? suggestions
        : suggestions.filter((s) => s.status === filter);

    const totalPages = Math.ceil(filteredSuggestions.length / ITEMS_PER_PAGE);
    const paginatedSuggestions = filteredSuggestions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getCategoryInfo = (cat) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[4];

    // Summary counts
    const counts = {
        all: suggestions.length,
        pending: suggestions.filter((s) => s.status === "pending").length,
        reviewed: suggestions.filter((s) => s.status === "reviewed").length,
        resolved: suggestions.filter((s) => s.status === "resolved").length,
        rejected: suggestions.filter((s) => s.status === "rejected").length,
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideIn { animation: slideInRight 0.5s ease-out forwards; }
                .animate-fadeIn { animation: fadeInUp 0.4s ease-out forwards; }
            `}</style>

            {/* Navigation */}
            <nav className="mb-10 flex items-center justify-between animate-slideIn">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
                <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-bold tracking-widest uppercase">
                    <Lightbulb size={16} />
                    <span>Vendor Suggestions Manager</span>
                </div>
            </nav>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 animate-slideIn" style={{ animationDelay: "50ms" }}>
                {[
                    { key: "all", label: "Total", icon: Inbox, gradient: "from-slate-600 to-slate-800" },
                    { key: "pending", label: "Pending", icon: Clock, gradient: "from-amber-500 to-orange-500" },
                    { key: "reviewed", label: "Reviewed", icon: Eye, gradient: "from-blue-500 to-indigo-500" },
                    { key: "resolved", label: "Resolved", icon: CheckCircle2, gradient: "from-emerald-500 to-teal-500" },
                    { key: "rejected", label: "Rejected", icon: XCircle, gradient: "from-red-500 to-rose-500" },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.key}
                            onClick={() => { setFilter(item.key); setCurrentPage(1); }}
                            className={`p-5 rounded-2xl text-white bg-linear-to-br ${item.gradient} shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 text-left ${filter === item.key ? "ring-4 ring-white shadow-2xl scale-105" : ""}`}
                        >
                            <Icon size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-black">{counts[item.key]}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{item.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="animate-slideIn" style={{ animationDelay: "100ms" }}>
                <div className="flex items-end justify-between px-2 mb-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            Vendor{" "}
                            <span className="text-slate-400 italic font-light">Suggestions</span>
                        </h2>
                        <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-xs">
                            {filter === "all" ? "Showing all" : `Filtered: ${filter}`} · {filteredSuggestions.length} results
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white p-20 rounded-[3rem] flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : paginatedSuggestions.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-200 mb-4">
                            <Lightbulb size={48} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">No Suggestions Found</h3>
                        <p className="text-slate-400 font-medium mt-1">
                            {filter !== "all" ? "Try a different filter." : "No vendors have submitted suggestions yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {paginatedSuggestions.map((suggestion, index) => {
                            const statusInfo = STATUS_CONFIG[suggestion.status];
                            const StatusIcon = statusInfo.icon;
                            const categoryInfo = getCategoryInfo(suggestion.category);
                            const isReplying = replyingTo === suggestion._id;

                            return (
                                <div
                                    key={suggestion._id}
                                    className="bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeIn"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="p-6">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-black text-slate-800">
                                                        {suggestion.subject}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border inline-flex items-center gap-1`}>
                                                        <StatusIcon size={12} />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold flex-wrap">
                                                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-600 px-2 py-1 rounded-md">
                                                        <User size={10} />
                                                        {suggestion.vendorName}
                                                    </span>
                                                    <span className="bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                        {categoryInfo.label}
                                                    </span>
                                                    <span>
                                                        {new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Quick Status Buttons */}
                                                <select
                                                    value={suggestion.status}
                                                    onChange={(e) => handleUpdateStatus(suggestion._id, e.target.value)}
                                                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-purple-400 transition-colors cursor-pointer"
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="reviewed">👁️ Reviewed</option>
                                                    <option value="resolved">✅ Resolved</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(suggestion._id)}
                                                    className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl mb-4">
                                            {suggestion.message}
                                        </p>

                                        {/* Existing Admin Reply */}
                                        {suggestion.adminReply && !isReplying && (
                                            <div className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 mb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageCircle size={14} className="text-purple-600" />
                                                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                                                        Your Reply
                                                    </span>
                                                    {suggestion.repliedAt && (
                                                        <span className="text-[10px] text-purple-400 font-bold ml-auto">
                                                            {new Date(suggestion.repliedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-purple-800 text-sm leading-relaxed font-medium">
                                                    {suggestion.adminReply}
                                                </p>
                                            </div>
                                        )}

                                        {/* Reply Section */}
                                        {isReplying ? (
                                            <div className="bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4 space-y-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MessageCircle size={14} className="text-purple-600" />
                                                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                                                        {suggestion.adminReply ? "Update Reply" : "Write Reply"}
                                                    </span>
                                                </div>
                                                <textarea
                                                    placeholder="Type your reply to the vendor..."
                                                    className="w-full p-4 bg-white border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-slate-600 h-28 resize-none placeholder:text-slate-300 text-sm"
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={replyStatus}
                                                        onChange={(e) => setReplyStatus(e.target.value)}
                                                        className="text-xs font-bold bg-white border border-purple-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-400"
                                                    >
                                                        <option value="reviewed">Mark as Reviewed</option>
                                                        <option value="resolved">Mark as Resolved</option>
                                                        <option value="rejected">Mark as Rejected</option>
                                                    </select>
                                                    <div className="flex gap-2 ml-auto">
                                                        <button
                                                            onClick={() => { setReplyingTo(null); setReplyText(""); }}
                                                            className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleReply(suggestion._id)}
                                                            disabled={!replyText.trim() || sending}
                                                            className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-linear-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                                                        >
                                                            <Send size={12} />
                                                            {sending ? "Sending..." : "Send Reply"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(suggestion._id);
                                                    setReplyText(suggestion.adminReply || "");
                                                    setReplyStatus(suggestion.status === "pending" ? "reviewed" : suggestion.status);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-all"
                                            >
                                                <MessageCircle size={14} />
                                                {suggestion.adminReply ? "Edit Reply" : "Reply"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSuggestions;
