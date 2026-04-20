import React, { useState, useEffect } from "react";
import {
    MessageSquarePlus,
    Send,
    Trash2,
    ChevronLeft,
    Lightbulb,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    MessageCircle,
    Tag,
    AlertCircle,
} from "lucide-react";

const CATEGORIES = [
    { value: "feature", label: "Feature Request", color: "blue" },
    { value: "bug", label: "Bug Report", color: "red" },
    { value: "movie", label: "Movie Suggestion", color: "purple" },
    { value: "improvement", label: "Improvement", color: "amber" },
    { value: "other", label: "Other", color: "slate" },
];

const STATUS_CONFIG = {
    pending: { label: "Pending", icon: Clock, color: "amber", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    reviewed: { label: "Reviewed", icon: Eye, color: "blue", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    resolved: { label: "Resolved", icon: CheckCircle2, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    rejected: { label: "Rejected", icon: XCircle, color: "red", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

const VendorSuggestions = ({ onBack }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ subject: "", message: "", category: "feature" });
    const [errors, setErrors] = useState({});
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const fetchSuggestions = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/suggestions/me", {
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

    const validateForm = () => {
        const newErrors = {};
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (form.subject.trim().length > 100) newErrors.subject = "Subject max 100 characters";
        if (!form.message.trim()) newErrors.message = "Message is required";
        if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setForm({ subject: "", message: "", category: "feature" });
                setErrors({});
                fetchSuggestions();
            } else {
                alert(data.message || "Failed to submit");
            }
        } catch (error) {
            alert("Network error. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this suggestion?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/suggestions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) fetchSuggestions();
            else alert(data.message);
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const filteredSuggestions = filter === "all"
        ? suggestions
        : suggestions.filter((s) => s.status === filter);

    const getCategoryInfo = (cat) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[4];

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
            <nav className="mb-10 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
                <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm font-bold tracking-widest uppercase">
                    <Lightbulb size={16} />
                    <span>Suggestion Box</span>
                </div>
            </nav>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Submit Form */}
                <div className="xl:col-span-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white h-fit sticky top-6 animate-slideIn">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 rounded-2xl shadow-lg bg-emerald-600 text-white shadow-emerald-200">
                                <MessageSquarePlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-slate-800">
                                    New Suggestion
                                </h2>
                                <p className="text-slate-400 font-semibold text-sm uppercase tracking-wider">
                                    Share your ideas with admin
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Category Selector */}
                            <div className="space-y-2">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={10} /> Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, category: cat.value })}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                                                form.category === cat.value
                                                    ? `bg-${cat.color}-100 text-${cat.color}-700 border-2 border-${cat.color}-300 shadow-md`
                                                    : "bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100"
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-1">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="Brief title for your suggestion"
                                    maxLength={100}
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.subject ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300`}
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                />
                                {errors.subject && <p className="text-red-500 text-xs mt-1 ml-2">{errors.subject}</p>}
                            </div>

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Describe your suggestion in detail..."
                                    className={`w-full p-4 bg-slate-50 border-2 ${errors.message ? "border-red-500" : "border-transparent"} rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-600 h-36 resize-none placeholder:text-slate-300`}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1 ml-2">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 rounded-2xl font-black text-white bg-linear-to-r from-emerald-600 to-teal-600 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                {submitting ? "Submitting..." : "Submit Suggestion"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Suggestions List */}
                <div className="xl:col-span-8 space-y-6 animate-slideIn" style={{ animationDelay: "100ms" }}>
                    <div className="flex items-end justify-between px-2">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                                My{" "}
                                <span className="text-slate-400 italic font-light">Suggestions</span>
                            </h2>
                            <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-xs">
                                {suggestions.length} Total Submissions
                            </p>
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-wrap gap-2 px-2">
                        {[
                            { key: "all", label: "All" },
                            { key: "pending", label: "Pending" },
                            { key: "reviewed", label: "Reviewed" },
                            { key: "resolved", label: "Resolved" },
                            { key: "rejected", label: "Rejected" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                    filter === f.key
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                        : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                {f.label}
                                {f.key === "all"
                                    ? ` (${suggestions.length})`
                                    : ` (${suggestions.filter((s) => s.status === f.key).length})`}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="bg-white p-20 rounded-[3rem] flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredSuggestions.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="p-6 bg-slate-50 rounded-full text-slate-200 mb-4">
                                <Lightbulb size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800">
                                {filter === "all" ? "No Suggestions Yet" : `No ${filter} suggestions`}
                            </h3>
                            <p className="text-slate-400 font-medium mt-1">
                                {filter === "all"
                                    ? "Be the first to share an idea with the admin team!"
                                    : "Try a different filter."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSuggestions.map((suggestion, index) => {
                                const statusInfo = STATUS_CONFIG[suggestion.status];
                                const StatusIcon = statusInfo.icon;
                                const categoryInfo = getCategoryInfo(suggestion.category);

                                return (
                                    <div
                                        key={suggestion._id}
                                        className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 animate-fadeIn"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-lg font-black text-slate-800">
                                                        {suggestion.subject}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                                                        <StatusIcon size={12} className="inline mr-1" />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                                                    <span className="bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                        {categoryInfo.label}
                                                    </span>
                                                    <span>
                                                        {new Date(suggestion.createdAt).toLocaleDateString("en-US", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            {suggestion.status === "pending" && (
                                                <button
                                                    onClick={() => handleDelete(suggestion._id)}
                                                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4 bg-slate-50 p-4 rounded-2xl">
                                            {suggestion.message}
                                        </p>

                                        {/* Admin Reply */}
                                        {suggestion.adminReply && (
                                            <div className="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageCircle size={14} className="text-emerald-600" />
                                                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                                                        Admin Reply
                                                    </span>
                                                    {suggestion.repliedAt && (
                                                        <span className="text-[10px] text-emerald-500 font-bold ml-auto">
                                                            {new Date(suggestion.repliedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-emerald-800 text-sm leading-relaxed font-medium">
                                                    {suggestion.adminReply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorSuggestions;
