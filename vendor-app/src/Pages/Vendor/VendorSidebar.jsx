import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Tv2,
    Building2,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Store,
} from "lucide-react";
import { useAuth } from "../../Contexts/AuthProvider.jsx";

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} />,
    },
    { label: "Shows", path: "/shows", icon: <Tv2 size={18} /> },
    { label: "Theaters", path: "/theaters", icon: <Building2 size={18} /> },
];

const VendorSidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const isDashboard = location.pathname === "/dashboard";
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 left-0 h-screen z-50 group">
            {/* Visible Menu Button Indicator */}
            {!isDashboard && (
                <div className="absolute top-25 left-0 px-3 py-3 bg-slate-900 border-y border-r border-white/10 shadow-xl rounded-r-xl z-40 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 cursor-pointer">
                    <Menu size={20} className="text-slate-400" />
                </div>
            )}
            {/* Invisible full-edge hover trigger */}
            <div className="absolute top-0 left-0 w-6 h-full bg-transparent z-40" />
            <aside
                className={`${
                    collapsed ? "w-16" : "w-64"
                } absolute top-0 left-0 h-full bg-slate-950 border-r border-white/10 flex flex-col transition-transform duration-300 ${isDashboard ? "translate-x-0 shadow-2xl" : "-translate-x-full group-hover:translate-x-0"} z-50`}
            >
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <Store size={22} className="text-emerald-400" />
                        <span className="font-black text-white text-sm tracking-tight">
                            Vendor Panel
                        </span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all ml-auto"
                >
                    {collapsed ? <Menu size={18} /> : <X size={18} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : ""}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group ${
                                active
                                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <span
                                className={`shrink-0 ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-white"}`}
                            >
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}
                            {!collapsed && active && (
                                <ChevronRight
                                    size={14}
                                    className="ml-auto text-emerald-400"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="border-t border-white/10 p-3">
                {user && !collapsed && (
                    <div className="mb-3 px-3 py-2 rounded-xl bg-white/5">
                        <p className="text-xs font-black text-white truncate">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-emerald-300/70 italic uppercase">
                            {user.role}
                        </p>
                    </div>
                )}
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    title={collapsed ? "Sign Out" : ""}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && "Sign Out"}
                </button>
            </div>
            </aside>
        </div>
    );
};

export default VendorSidebar;
