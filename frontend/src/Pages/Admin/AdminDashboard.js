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
        {
            id: "admin-dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: "admin-movies",
            label: "Manage Movies",
            icon: <Film size={20} />,
        },
        {
            id: "admin-shows",
            label: "Manage Shows",
            icon: <Calendar size={20} />,
        },
        {
            id: "admin-theaters",
            label: "Manage Theaters",
            icon: <Building2 size={20} />,
        },
        {
            id: "admin-bookings",
            label: "All Bookings",
            icon: <CreditCard size={20} />,
        },
        {
            id: "admin-users",
            label: "User Directory",
            icon: <Users size={20} />,
        },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
            {/* Glossy Sidebar */}
            <div className="w-full md:w-72 bg-slate-900 text-white p-6 flex flex-col shadow-2xl relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-90 z-0"></div>
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-10 px-2">
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            MovieTix
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Admin Control Center
                        </p>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                                    item.id === "admin-dashboard"
                                        ? "bg-blue-600 shadow-lg shadow-blue-900/50 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-slate-700/50 mt-auto">
                        <button
                            onClick={() => setCurrentPage("home")}
                            className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/50 border border-transparent rounded-xl transition-all group"
                        >
                            <LogOut
                                size={18}
                                className="group-hover:text-red-400"
                            />
                            <span>Exit Panel</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-50">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Welcome back, Admin. Here's your daily report.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-600">
                            System Online
                        </span>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Movies"
                        value={stats.movies}
                        icon={<Film size={24} />}
                        gradient="from-blue-500 to-cyan-400"
                        delay="0"
                    />
                    <StatCard
                        title="Active Theaters"
                        value={stats.theaters}
                        icon={<Building2 size={24} />}
                        gradient="from-emerald-500 to-teal-400"
                        delay="100"
                    />
                    <StatCard
                        title="Registered Users"
                        value={stats.users}
                        icon={<Users size={24} />}
                        gradient="from-violet-500 to-purple-400"
                        delay="200"
                    />
                    <StatCard
                        title="Total Bookings"
                        value={stats.bookings}
                        icon={<LayoutDashboard size={24} />}
                        gradient="from-orange-500 to-amber-400"
                        delay="300"
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        Quick Management
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <ActionButton
                            onClick={() => setCurrentPage("admin-movies")}
                            label="Add New Movie"
                            icon={<Film size={18} />}
                            color="blue"
                        />
                        <ActionButton
                            onClick={() => setCurrentPage("admin-shows")}
                            label="Schedule Show"
                            icon={<Calendar size={18} />}
                            color="violet"
                        />
                        <ActionButton
                            onClick={() => setCurrentPage("admin-theaters")}
                            label="Setup Theater"
                            icon={<Building2 size={18} />}
                            color="emerald"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, gradient, delay }) => (
    <div
        className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        style={{ animation: `fadeIn Up 0.5s ease-out ${delay}ms` }}
    >
        <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-10 -mt-10`}
        ></div>

        <div className="flex items-center justify-between mb-4 relative z-10">
            <div
                className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
            >
                {icon}
            </div>
            {/* <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                +2.5%
            </span> */}
        </div>

        <div className="relative z-10">
            <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">{title}</p>
        </div>
    </div>
);

const ActionButton = ({ onClick, label, icon, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-200",
        violet: "bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white border-violet-200",
        emerald:
            "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-200",
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 border ${colorClasses[color]} hover:shadow-lg hover:scale-105 active:scale-95`}
        >
            {icon}
            {label}
        </button>
    );
};
