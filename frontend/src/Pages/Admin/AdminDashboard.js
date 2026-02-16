import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Film,
    Building2,
    Users,
    ArrowLeft,
    Calendar,
    LogOut,
    CreditCard,
    TrendingUp,
    ChevronRight,
    Activity
} from "lucide-react";

export const AdminDashboard = ({ setCurrentPage }) => {
    const [stats, setStats] = useState({
        movies: 0,
        theaters: 0,
        users: 0,
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
                console.error("Error fetching admin stats:", error);
            }
        };
        fetchStats();
    }, []);

    const menuItems = [
        { id: "admin-dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "admin-movies", label: "Manage Movies", icon: <Film size={20} /> },
        { id: "admin-shows", label: "Manage Shows", icon: <Calendar size={20} /> },
        { id: "admin-theaters", label: "Manage Theaters", icon: <Building2 size={20} /> },
        { id: "admin-bookings", label: "All Bookings", icon: <CreditCard size={20} /> },
        { id: "admin-users", label: "User Directory", icon: <Users size={20} /> },
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

            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-slate-950 text-white flex flex-col relative z-20 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
                
                <div className="relative z-10 flex flex-col h-full p-6">
                    {/* Brand */}
                    <div className="mb-12 flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                            <Activity size={24} className="text-white" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            CineAdmin
                        </h2>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-1.5 flex-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group ${
                                    item.id === "admin-dashboard"
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`${item.id === "admin-dashboard" ? "text-white" : "group-hover:text-blue-400"} transition-colors`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                                </div>
                                {item.id === "admin-dashboard" && <ChevronRight size={14} className="opacity-50" />}
                            </button>
                        ))}
                    </nav>

                    {/* Exit */}
                    <div className="pt-6 border-t border-white/10 mt-auto">
                        <button
                            onClick={() => setCurrentPage("home")}
                            className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300 group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm">Exit Control Center</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>

                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="animate-fadeInUp">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-8 bg-blue-600 rounded-full"></span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Administrator</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                            System <span className="text-slate-400 italic font-light">Overview</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 animate-fadeInUp" style={{animationDelay: '100ms'}}>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Status</span>
                            <div className="flex items-center gap-2 mt-1 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[13px] font-bold text-slate-700">Operational</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                    <StatCard
                        title="Total Movies"
                        value={stats.movies}
                        icon={<Film size={22} />}
                        color="blue"
                        delay="100"
                    />
                    <StatCard
                        title="Active Theaters"
                        value={stats.theaters}
                        icon={<Building2 size={22} />}
                        color="emerald"
                        delay="200"
                    />
                    <StatCard
                        title="Registered Users"
                        value={stats.users}
                        icon={<Users size={22} />}
                        color="violet"
                        delay="300"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.bookings}
                        icon={<TrendingUp size={22} />}
                        color="orange"
                        delay="400"
                    />
                </div>

                {/* Quick Management Section */}
                <section className="animate-fadeInUp" style={{animationDelay: '500ms'}}>
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0"></div>
                        
                        <div className="relative z-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-800">Quick Actions</h2>
                                <p className="text-slate-500 font-medium">Streamline your management workflow</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-5">
                                <ActionButton
                                    onClick={() => setCurrentPage("admin-movies")}
                                    label="Add New Movie"
                                    icon={<Film size={20} />}
                                    theme="blue"
                                />
                                <ActionButton
                                    onClick={() => setCurrentPage("admin-shows")}
                                    label="Schedule Show"
                                    icon={<Calendar size={20} />}
                                    theme="violet"
                                />
                                <ActionButton
                                    onClick={() => setCurrentPage("admin-theaters")}
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
        blue: "from-blue-600 to-indigo-600 shadow-blue-200 text-blue-600",
        emerald: "from-emerald-500 to-teal-600 shadow-emerald-200 text-emerald-600",
        violet: "from-violet-600 to-purple-600 shadow-violet-200 text-violet-600",
        orange: "from-orange-500 to-amber-600 shadow-orange-200 text-orange-600",
    };

    return (
        <div
            className="animate-fadeInUp group bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${themes[color].split(' shadow')[0]} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    Live Data
                </div>
            </div>

            <div>
                <h3 className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
                    {value.toLocaleString()}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide opacity-80">
                    {title}
                </p>
            </div>
            
            {/* <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className={`text-xs font-bold ${themes[color].split(' shadow')[2]}`}>+12% from last month</span>
                <ChevronRight size={14} className="text-slate-300" />
            </div> */}
        </div>
    );
};

const ActionButton = ({ onClick, label, icon, theme }) => {
    const styles = {
        blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
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