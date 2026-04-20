import React from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useAuth } from "./Contexts/AuthProvider.jsx";

const AdminLogin = React.lazy(() => import("./Pages/Admin/AdminLogin.jsx"));
const AdminDashboard = React.lazy(
    () => import("./Pages/Admin/AdminDashboard.jsx"),
);
const ManageMovies = React.lazy(() => import("./Pages/Admin/ManageMovies.jsx"));
const ManageUpcomingMovies = React.lazy(
    () => import("./Pages/Admin/ManageUpcomingMovies.jsx"),
);
const UserList = React.lazy(() => import("./Pages/Admin/UserList.jsx"));
const AdminBookings = React.lazy(
    () => import("./Pages/Admin/AdminBookings.jsx"),
);
const AdminSuggestions = React.lazy(
    () => import("./Pages/Admin/AdminSuggestions.jsx"),
);
// const ManageShows = React.lazy(() => import("./Pages/Admin/ManageShows.jsx"));
// const ManageTheaters = React.lazy(
//     () => import("./Pages/Admin/ManageTheaters.jsx"),
// );

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user)
        return <Navigate to="/login" state={{ from: location }} replace />;
    if (user.role !== "admin") return <Navigate to="/login" replace />;

    return children;
};

const AppRouter = () => {
    const navigate = useNavigate();

    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/movies"
                element={
                    <ProtectedRoute>
                        <ManageMovies onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/upcoming-movies"
                element={
                    <ProtectedRoute>
                        <ManageUpcomingMovies
                            onBack={() => navigate("/dashboard")}
                        />
                    </ProtectedRoute>
                }
            />
            {/* <Route
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
            /> */}
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <UserList onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <AdminBookings onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/suggestions"
                element={
                    <ProtectedRoute>
                        <AdminSuggestions onBack={() => navigate("/dashboard")} />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRouter;
