import React, { useState, useEffect } from "react";
import { 
    User,
    Shield,
    Mail,
    Wallet,
    ChevronLeft,
    Users,
    Search,
    Filter, 
    BadgeCheck
} from "lucide-react";

export const UserList = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "http://localhost:5000/api/admin/users",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const data = await res.json();
                if (data.success) setUsers(data.users);
            } catch (error) {
                console.error("Fetch users failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
            {/* Custom Animations & Scrollbar */}
            <style>{`
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade { animation: fadeInRight 0.5s ease-out forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>

            {/* Navigation Header */}
            <nav className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all duration-300 shadow-sm w-fit"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Overview</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Capacity</p>
                        <p className="text-xl font-black text-blue-600">{users.length} Active Profiles</p>
                    </div>
                    <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <Users size={24} />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Title Section */}
                <div className="animate-fade" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        User <span className="text-slate-400 italic font-light">Directory</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">
                        Global member management and credential audit
                    </p>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-fade" style={{ animationDelay: '200ms' }}>
                    {/* Header Action Bar (Visual Only) */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Search size={18} />
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Search Registry...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 text-slate-400 hover:bg-white hover:text-blue-600 rounded-lg transition-all cursor-pointer shadow-sm">
                                <Filter size={18} />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Syncing Member Data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Access Level</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Account Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u, index) => (
                                        <tr
                                            key={u._id}
                                            className="hover:bg-slate-50/80 transition-all duration-300 group"
                                        >
                                            {/* Profile Column */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {u.role === "admin" && (
                                                            <div className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm text-blue-600">
                                                                <BadgeCheck size={16} fill="currentColor" className="text-white fill-blue-600" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-base leading-tight">
                                                            {u.name}
                                                        </p>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                                            ID: {u._id.slice(-8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Column */}
                                            <td className="p-6">
                                                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                        <Mail size={16} />
                                                    </div>
                                                    {u.email}
                                                </div>
                                            </td>

                                            {/* Role Column */}
                                            <td className="p-6 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                        u.role === "admin" 
                                                        ? "bg-purple-50 text-purple-700 border-purple-100 shadow-sm shadow-purple-100" 
                                                        : "bg-blue-50 text-blue-700 border-blue-100 shadow-sm shadow-blue-100"
                                                    }`}
                                                >
                                                    {u.role === "admin" && <Shield size={12} className="fill-purple-700/10" />}
                                                    {u.role}
                                                </span>
                                            </td>

                                            {/* Wallet Column */}
                                            <td className="p-6 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <div className="flex items-center gap-2 text-emerald-600 font-black text-lg tracking-tighter">
                                                        <Wallet size={16} className="text-emerald-400" />
                                                        ₹{u.walletBalance.toLocaleString()}
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Available Credits</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="4" className="p-20 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <User size={48} className="mb-4" />
                                                    <p className="font-black uppercase tracking-[0.3em] text-sm">Registry is Empty</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};