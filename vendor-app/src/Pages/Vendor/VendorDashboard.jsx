import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Calendar,
    LogOut,
    TrendingUp,
    ChevronRight,
    Activity,
    ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../Contexts/AuthProvider";

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        theaters: 0,
        shows: 0,
        bookings: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(
                    "http://localhost:5000/api/admin/stats",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching vendor stats:", error);
            }
        };
        fetchStats();
    }, []);

    const menuItems = [
        {
            id: "vendor-dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: "vendor-shows",
            label: "Manage Shows",
            icon: <Calendar size={20} />,
        },
        {
            id: "vendor-theaters",
            label: "Manage Theaters",
            icon: <Building2 size={20} />,
        },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
            `}</style>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-b from-violet-50/50 to-transparent -z-10"></div>

                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-fadeInUp">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-8 bg-violet-600 rounded-full"></span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                                Operations
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            System{" "}
                            <span className="text-slate-400 italic font-light">
                                Overview
                            </span>
                        </h1>
                    </div>

                    <div
                        className="flex items-center gap-4 animate-fadeInUp"
                        style={{ animationDelay: "100ms" }}
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Server Status
                            </span>
                            <div className="flex items-center gap-2 mt-1 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[13px] font-bold text-slate-700">
                                    Operational
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-14">
                    <StatCard
                        title="Your Theaters"
                        value={stats.theaters}
                        icon={<Building2 size={22} />}
                        color="emerald"
                        delay="100"
                    />
                    <StatCard
                        title="Total Shows"
                        value={stats.shows}
                        icon={<Calendar size={22} />}
                        color="violet"
                        delay="200"
                    />
                    {/* <StatCard
                        title="Show Bookings"
                        value={stats.bookings}
                        icon={<TrendingUp size={22} />}
                        color="orange"
                        delay="300"
                    /> */}
                </div>

                {/* Quick Management Section */}
                <section
                    className="animate-fadeInUp"
                    style={{ animationDelay: "400ms" }}
                >
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0"></div>

                        <div className="relative z-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-800">
                                    Quick Actions
                                </h2>
                                <p className="text-slate-500 font-medium">
                                    Streamline your management workflow
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-5">
                                <ActionButton
                                    onClick={() =>
                                        navigate("/shows")
                                    }
                                    label="Schedule Show"
                                    icon={<Calendar size={20} />}
                                    theme="violet"
                                />
                                <ActionButton
                                    onClick={() =>
                                        navigate("/theaters")
                                    }
                                    label="Setup Theater"
                                    icon={<Building2 size={20} />}
                                    theme="emerald"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, delay }) => {
    const themes = {
        emerald:
            "from-emerald-500 to-teal-600 shadow-emerald-200 text-emerald-600",
        violet: "from-violet-600 to-purple-600 shadow-violet-200 text-violet-600",
        orange: "from-orange-500 to-amber-600 shadow-orange-200 text-orange-600",
    };

    return (
        <div
            className="animate-fadeInUp group bg-white p-8 rounded-4xl shadow-lg border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div
                    className={`p-4 rounded-2xl bg-linear-to-br ${themes[color].split(" shadow")[0]} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    Live Data
                </div>
            </div>

            <div>
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
                    {value ? value.toLocaleString() : "0"}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide opacity-80">
                    {title}
                </p>
            </div>
        </div>
    );
};

const ActionButton = ({ onClick, label, icon, theme }) => {
    const styles = {
        violet: "bg-violet-600 hover:bg-violet-700 shadow-violet-200",
        emerald: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    };

    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl ${styles[theme]}`}
        >
            <span className="p-2 bg-white/20 rounded-lg group-hover:rotate-12 transition-transform">
                {icon}
            </span>
            <span className="tracking-tight">{label}</span>
            <div className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <ArrowLeft size={18} className="rotate-180" />
            </div>
        </button>
    );
};

export default VendorDashboard;
