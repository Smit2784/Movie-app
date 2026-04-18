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
    BadgeCheck,
    ChevronDown,
} from "lucide-react";
import { Pagination } from "../../Components/Pagination";

const UserList = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
    const [openRoleDropdownId, setOpenRoleDropdownId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

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
                setCurrentPage(1); // Reset page on fetch
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:5000/api/admin/users/${userId}/role`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ role: newRole }),
                },
            );
            const data = await res.json();
            if (data.success) {
                setUsers(
                    users.map((u) =>
                        u._id === userId ? { ...u, role: newRole } : u,
                    ),
                );
            } else {
                alert(data.message || "Failed to update role");
            }
        } catch (error) {
            console.error("Role update failed", error);
            alert("Error updating role");
        }
    };

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
                    <ChevronLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Database Capacity
                        </p>
                        <p className="text-xl font-black text-blue-600">
                            {filteredUsers.length} Active Profiles
                        </p>
                    </div>
                    <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <Users size={24} />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Title Section */}
                <div
                    className="animate-fade"
                    style={{ animationDelay: "100ms" }}
                >
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        User{" "}
                        <span className="text-slate-400 italic font-light">
                            Directory
                        </span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">
                        Global member management and credential audit
                    </p>
                </div>

                {/* Table Card */}
                <div
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden animate-fade"
                    style={{ animationDelay: "200ms" }}
                >
                    {/* Header Action Bar */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 flex-wrap gap-4">
                        <div className="flex items-center gap-3 text-slate-400 flex-1">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search Registry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full lg:w-96 placeholder:uppercase placeholder:tracking-widest placeholder:text-slate-300"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <button
                                    onClick={() =>
                                        setOpenFilterDropdown(
                                            !openFilterDropdown,
                                        )
                                    }
                                    className="items-center bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm hover:border-blue-300 transition-all font-bold text-[10px] uppercase tracking-widest text-slate-600 gap-2 w-36 justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter
                                            size={14}
                                            className="text-blue-500"
                                        />
                                        {roleFilter === "all"
                                            ? "All Roles"
                                            : roleFilter}
                                    </div>
                                    {/* <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform ${openFilterDropdown ? "rotate-180" : ""}`}
                                    /> */}
                                </button>

                                {openFilterDropdown && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade"
                                        style={{ animationDuration: "0.2s" }}
                                    >
                                        <ul className="py-2">
                                            {[
                                                {
                                                    value: "all",
                                                    label: "All Roles",
                                                    color: "text-slate-700",
                                                    bg: "hover:bg-slate-50",
                                                },
                                                {
                                                    value: "admin",
                                                    label: "Admin",
                                                    color: "text-purple-700",
                                                    bg: "hover:bg-purple-50",
                                                },
                                                {
                                                    value: "vendor",
                                                    label: "Vendor",
                                                    color: "text-orange-700",
                                                    bg: "hover:bg-orange-50",
                                                },
                                                {
                                                    value: "user",
                                                    label: "User",
                                                    color: "text-blue-700",
                                                    bg: "hover:bg-blue-50",
                                                },
                                            ].map((option) => (
                                                <li key={option.value}>
                                                    <button
                                                        onClick={() => {
                                                            setRoleFilter(
                                                                option.value,
                                                            );
                                                            setOpenFilterDropdown(
                                                                false,
                                                            );
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${option.color} ${option.bg} ${roleFilter === option.value ? "bg-slate-50/80 my-1" : "border-l-2 border-transparent"}`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
                                Syncing Member Data...
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-slate-100">
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            User Profile
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            Contact Information
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                            Access Level
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                            Account Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(() => {
                                        const totalPages = Math.ceil(
                                            filteredUsers.length /
                                                ITEMS_PER_PAGE,
                                        );
                                        const startIndex =
                                            (currentPage - 1) * ITEMS_PER_PAGE;
                                        const paginatedUsers =
                                            filteredUsers.slice(
                                                startIndex,
                                                startIndex + ITEMS_PER_PAGE,
                                            );

                                        return paginatedUsers.map(
                                            (u, index) => (
                                                <tr
                                                    key={u._id}
                                                    className="hover:bg-slate-50/80 transition-all duration-300 group"
                                                >
                                                    {/* Profile Column */}
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className="relative">
                                                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform">
                                                                    {u.name
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                {u.role ===
                                                                    "admin" && (
                                                                    <div className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm text-blue-600">
                                                                        <BadgeCheck
                                                                            size={
                                                                                16
                                                                            }
                                                                            fill="currentColor"
                                                                            className="text-white fill-blue-600"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-800 text-base leading-tight">
                                                                    {u.name}
                                                                </p>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                                                                    ID:{" "}
                                                                    {u._id
                                                                        .slice(
                                                                            -8,
                                                                        )
                                                                        .toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Contact Column */}
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                                            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                                <Mail
                                                                    size={16}
                                                                />
                                                            </div>
                                                            {u.email}
                                                        </div>
                                                    </td>

                                                    {/* Role Column */}
                                                    <td className="p-6 text-center">
                                                        <div className="relative inline-block text-left w-28">
                                                            <button
                                                                onClick={() =>
                                                                    setOpenRoleDropdownId(
                                                                        openRoleDropdownId ===
                                                                            u._id
                                                                            ? null
                                                                            : u._id,
                                                                    )
                                                                }
                                                                className={`w-full flex items-center justify-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                                                    u.role ===
                                                                    "admin"
                                                                        ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                                                        : u.role ===
                                                                            "vendor"
                                                                          ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                                                                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                                                                }`}
                                                            >
                                                                <span>
                                                                    {u.role}
                                                                </span>
                                                                {/* <ChevronDown
                                                                    size={12}
                                                                    className={`transition-transform duration-200 ${openRoleDropdownId === u._id ? "rotate-180" : ""}`}
                                                                /> */}
                                                            </button>

                                                            {openRoleDropdownId ===
                                                                u._id && (
                                                                <div className="absolute right-0 left-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                                                    <div className="py-1 flex flex-col">
                                                                        {[
                                                                            {
                                                                                value: "user",
                                                                                label: "USER",
                                                                                color: "text-blue-700",
                                                                                bg: "hover:bg-blue-50",
                                                                            },
                                                                            {
                                                                                value: "vendor",
                                                                                label: "VENDOR",
                                                                                color: "text-orange-700",
                                                                                bg: "hover:bg-orange-50",
                                                                            },
                                                                            {
                                                                                value: "admin",
                                                                                label: "ADMIN",
                                                                                color: "text-purple-700",
                                                                                bg: "hover:bg-purple-50",
                                                                            },
                                                                        ].map(
                                                                            (
                                                                                option,
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    onClick={() => {
                                                                                        handleRoleUpdate(
                                                                                            u._id,
                                                                                            option.value,
                                                                                        );
                                                                                        setOpenRoleDropdownId(
                                                                                            null,
                                                                                        );
                                                                                    }}
                                                                                    className={`text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${option.color} ${option.bg} ${u.role === option.value ? "bg-slate-50" : ""}`}
                                                                                >
                                                                                    {
                                                                                        option.label
                                                                                    }
                                                                                </button>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {u.role === "admin" && (
                                                            <Shield
                                                                size={12}
                                                                className="inline ml-2 text-purple-700"
                                                            />
                                                        )}
                                                    </td>

                                                    {/* Wallet Column */}
                                                    <td className="p-6 text-right">
                                                        <div className="inline-flex flex-col items-end">
                                                            <div className="flex items-center gap-2 text-emerald-600 font-black text-lg tracking-tighter">
                                                                <Wallet
                                                                    size={16}
                                                                    className="text-emerald-400"
                                                                />
                                                                ₹
                                                                {u.walletBalance.toLocaleString()}
                                                            </div>
                                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                                Available
                                                                Credits
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        );
                                    })()}
                                    {filteredUsers.length === 0 && !loading && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="p-20 text-center"
                                            >
                                                <div className="flex flex-col items-center opacity-20">
                                                    <User
                                                        size={48}
                                                        className="mb-4"
                                                    />
                                                    <p className="font-black uppercase tracking-[0.3em] text-sm">
                                                        Registry is Empty
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Component */}
                            {filteredUsers.length > ITEMS_PER_PAGE && (
                                <div className="p-6 border-t border-slate-100 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(
                                            filteredUsers.length /
                                                ITEMS_PER_PAGE,
                                        )}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserList;