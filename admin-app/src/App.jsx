import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AuthProvider from "./Contexts/AuthProvider.jsx";
import AdminSidebar from "./Pages/Admin/AdminSidebar.jsx";
import AppRouter from "./Router.jsx";
import { Suspense } from "react";

const App = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <AuthProvider>
            <div className="flex min-h-screen bg-slate-900 text-white">
                {!isLoginPage && (
                    <AdminSidebar
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                    />
                )}
                <main className={`flex-1 w-full relative transition-all duration-300 ${!isLoginPage && location.pathname === "/dashboard" ? (sidebarCollapsed ? "pl-16" : "pl-64") : ""}`}>
                    <Suspense
                        fallback={
                            <div className="min-h-screen flex items-center justify-center text-slate-400">
                                Loading...
                            </div>
                        }
                    >
                        <AppRouter />
                    </Suspense>
                </main>
            </div>
        </AuthProvider>
    );
};

export default App;
