import React from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useAuth } from "./Contexts/AuthProvider.jsx";

const VendorLogin = React.lazy(() => import("./Pages/Vendor/VendorLogin.jsx"));
const VendorDashboard = React.lazy(
    () => import("./Pages/Vendor/VendorDashboard.jsx"),
);
const ManageShows = React.lazy(() => import("./Pages/Vendor/ManageShows.jsx"));
const ManageTheaters = React.lazy(
    () => import("./Pages/Vendor/ManageTheaters.jsx"),
);
const VendorBookings = React.lazy(() => import("./Pages/Vendor/VendorBookings.jsx"));

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user)
        return <Navigate to="/login" state={{ from: location }} replace />;
    if (user.role !== "vendor") return <Navigate to="/login" replace />;

    return children;
};

const AppRouter = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/login" element={<VendorLogin />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <VendorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/shows"
                element={
                    <ProtectedRoute>
                        <ManageShows onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/theaters"
                element={
                    <ProtectedRoute>
                        <ManageTheaters onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <VendorBookings onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRouter;
