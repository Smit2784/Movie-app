import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import logo from "../../logo.png";
import { useAuth } from "../../Contexts/AuthProvider";

const VendorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 font-sans text-slate-900">
            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
            `}</style>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative pb-20">
                {/* Hero Header Section */}
                <div className="relative bg-linear-to-br from-purple-900 via-violet-900 to-indigo-900 text-white overflow-hidden p-8 md:p-14 lg:p-16 rounded-b-[3rem] shadow-2xl mb-12">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 right-10 w-64 h-64 bg-violet-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
                        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
                    </div>

                    <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="animate-fadeInUp">
                            <div className="flex-col items-center gap-3 mb-6">
                                <img
                                    src={logo}
                                    alt="MovieTix Logo"
                                    className="h-18 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-2"
                                />
                                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 tracking-wider shadow-lg">
                                    VENDOR OPERATIONS
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                                Welcome back, <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-400 to-indigo-400 drop-shadow-2xl">
                                    {user?.name || "Vendor"}!
                                </span>
                            </h1>
                        </div>

                        <div
                            className="flex items-center gap-4 animate-fadeInUp"
                            style={{ animationDelay: "100ms" }}
                        >
                            <div className="flex flex-col items-start md:items-end">
                                <span className="text-[10px] mr-4 font-black text-violet-200 uppercase tracking-[0.2em] mb-2 opacity-80">
                                    Server Status
                                </span>
                                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-sm font-bold text-white tracking-wide">
                                        Operational
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Dashboard Content Container */}
                <div className="px-6 md:px-10 lg:px-14">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
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
                        <StatCard
                            title="Show Bookings"
                            value={stats.bookings}
                            icon={<TrendingUp size={22} />}
                            color="orange"
                            delay="300"
                        />
                    </div>

                    {/* Quick Management Section */}
                    <section
                        className="animate-fadeInUp"
                        style={{ animationDelay: "400ms" }}
                    >
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-violet-50 to-indigo-50 rounded-full -mr-32 -mt-32 z-0 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                        Quick Actions
                                    </h2>
                                    <p className="text-slate-500 font-medium mt-2">
                                        Streamline your management workflow
                                        instantly
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-5">
                                    <ActionButton
                                        onClick={() => navigate("/shows")}
                                        label="Schedule Show"
                                        icon={<Calendar size={20} />}
                                        theme="violet"
                                    />
                                    <ActionButton
                                        onClick={() => navigate("/theaters")}
                                        label="Setup Theater"
                                        icon={<Building2 size={20} />}
                                        theme="emerald"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
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
            className="animate-fadeInUp group bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden relative"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div
                className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${themes[color].split(" shadow")[0]} opacity-[0.03] rounded-bl-full z-0 group-hover:scale-150 transition-transform duration-700`}
            ></div>
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div
                    className={`p-4 rounded-2xl bg-linear-to-br ${themes[color].split(" shadow")[0]} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                    {icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                    Live Data
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                    {value ? value.toLocaleString() : "0"}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider opacity-80">
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
            className={`group relative flex items-center gap-4 px-8 py-5 rounded-2xl font-black text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl ${styles[theme]} overflow-hidden`}
        >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:rotate-12 transition-transform shadow-sm relative z-10">
                {icon}
            </span>
            <span className="tracking-wide relative z-10 text-lg">{label}</span>
            <div className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all relative z-10">
                <ArrowRight size={20} />
            </div>
        </button>
    );
};

export default VendorDashboard;
