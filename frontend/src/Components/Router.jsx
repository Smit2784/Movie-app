import React, { Suspense, useEffect, useState } from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Header from "../Layouts/Header.jsx";
import Footer from "../Layouts/Footer.jsx";
import { useAuth } from "../Contexts/AuthProvider.jsx";

const Home = React.lazy(() => import("../Pages/Home.jsx"));
const AuthComponent = React.lazy(() => import("../Pages/Auth.jsx"));
const ManageMovies = React.lazy(
    () => import("../Pages/Admin/ManageMovies.jsx"),
);
const ManageUpcomingMovies = React.lazy(
    () => import("../Pages/Admin/ManageUpcomingMovies.jsx"),
);
const UserList = React.lazy(() => import("../Pages/Admin/UserList.jsx"));
const AdminDashboard = React.lazy(
    () => import("../Pages/Admin/AdminDashboard.jsx"),
);
const AdminBookings = React.lazy(
    () => import("../Pages/Admin/AdminBookings.jsx"),
);
const VendorDashboard = React.lazy(
    () => import("../Pages/Vendor/VendorDashboard.jsx"),
);
const VendorManageTheaters = React.lazy(
    () => import("../Pages/Vendor/ManageTheaters.jsx"),
);
const VendorManageShows = React.lazy(
    () => import("../Pages/Vendor/ManageShows.jsx"),
);
const VendorBookings = React.lazy(
    () => import("../Pages/Vendor/VendorBookings.jsx"),
);
const AboutUs = React.lazy(() => import("../Pages/AboutUs.jsx"));
const ContactUs = React.lazy(() => import("../Pages/ContactUs.jsx"));
const MyBookings = React.lazy(() => import("../Pages/MyBookings.jsx"));
const MovieDetails = React.lazy(() => import("../Pages/MovieDetails.jsx"));
const BookingPage = React.lazy(() => import("../Pages/BookingPage.jsx"));
const PaymentPage = React.lazy(() => import("../Pages/Payment.jsx"));
const FAQ = React.lazy(() => import("../Pages/FAQ.jsx"));
const BookingGuide = React.lazy(() => import("../Pages/BookingGuide.jsx"));
const UpcomingMovies = React.lazy(() => import("../Pages/UpcomingMovies.jsx"));
const PaymentSuccess = React.lazy(() => import("../Pages/PaymentSuccess.jsx"));
const GiftCards = React.lazy(() => import("../Pages/GiftCards.jsx"));
const UpdateProfile = React.lazy(() => import("../Pages/UpdateProfile.jsx"));
const NotFound = React.lazy(() => import("../Pages/NotFound.jsx"));
const PrivacyPolicy = React.lazy(() => import("../Pages/PrivacyPolicy.jsx"));
const TermsOfService = React.lazy(() => import("../Pages/TermsOfService.jsx"));
const LatestOffers = React.lazy(() => import("../Pages/LatestOffers.jsx"));

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Layout Component
// const RootLayout = () => {
//     return (
//         <div className="App min-h-screen flex flex-col">
//             {/* <ScrollToTop />
//             <ScrollToTopButton /> */}
//             <LayoutContent />
//         </div>
//     );
// };

// Values needed from AuthContext for Header, so we need a sub-component inside AuthProvider
// const LayoutContent = () => {
//     return (
//         <>
//             <Header />
//             <main className="grow">
//                 <Suspense fallback={<div>Loading...</div>}>
//                     <Outlet />
//                 </Suspense>
//             </main>
//             <Footer />
//         </>
//     );
// };

// Wrapper Components to handle Navigation Props (Legacy Adapter)

function HomeWithNavigation() {
    const navigate = useNavigate();
    return (
        <Home
            onMovieSelect={(movie) =>
                navigate(`/movie/${movie._id}`, { state: { movie } })
            }
        />
    );
}

function UpcomingMoviesWithNavigation() {
    const navigate = useNavigate();
    return (
        <UpcomingMovies
            onMovieSelect={(movie) =>
                navigate(`/movie/${movie._id}`, { state: { movie } })
            }
            onGoHome={() => navigate("/")}
        />
    );
}

function AuthWrapper() {
    const navigate = useNavigate();
    return (
        <AuthComponent
            setCurrentPage={(page) => {
                if (page === "home") navigate("/");
                else navigate(page);
            }}
        />
    );
}

function MovieDetailsWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <MovieDetails
            movie={location.state?.movie}
            onBack={() => navigate("/")}
            onBookNow={(show, proceed) => {
                if (proceed) {
                    navigate(`/booking/${show._id}`, { state: { show } });
                } else {
                    navigate("/auth", {
                        state: { from: `/booking/${show._id}`, show },
                    });
                }
            }}
        />
    );
}

function BookingPageWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <BookingPage
            show={location.state?.show}
            onBack={() => navigate(-1)}
            onBookingComplete={(booking) => {
                navigate("/payment", { state: { booking } });
            }}
        />
    );
}

function PaymentPageWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const booking = location.state?.booking;

    if (!booking) {
        return <Navigate to="/" replace />;
    }

    return (
        <PaymentPage
            booking={booking}
            onBack={() => navigate(-1)}
            onPaymentComplete={(result) => {
                navigate("/payment-success", {
                    state: { result, booking: result.booking },
                });
            }}
        />
    );
}

function PaymentSuccessWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { result, booking } = location.state || {};

    return (
        <PaymentSuccess
            paymentResult={result}
            booking={booking}
            onGoHome={() => navigate("/")}
        />
    );
}

function UpdateProfileWithNavigation() {
    const navigate = useNavigate();
    return <UpdateProfile onBack={() => navigate("/")} />;
}

// Admin Wrappers
function AdminDashboardWithNavigation() {
    const navigate = useNavigate();
    return (
        <AdminDashboard
            setCurrentPage={(page) => {
                if (page.startsWith("admin-")) {
                    navigate(page.replace("admin-", "/admin/"));
                } else {
                    navigate(page);
                }
            }}
        />
    );
}
// Vendor Wrappers
function VendorDashboardWithNavigation() {
    const navigate = useNavigate();
    return (
        <VendorDashboard
            setCurrentPage={(page) => {
                if (page.startsWith("vendor-")) {
                    navigate(page.replace("vendor-", "/vendor/"));
                } else {
                    navigate(page);
                }
            }}
        />
    );
}

function ManageMoviesWithNavigation() {
    const navigate = useNavigate();
    return <ManageMovies onBack={() => navigate("/admin/dashboard")} />;
}
function ManageUpcomingMoviesWithNavigation() {
    const navigate = useNavigate();
    return <ManageUpcomingMovies onBack={() => navigate("/admin/dashboard")} />;
}
function ManageShowsWithNavigation() {
    const navigate = useNavigate();
    return <VendorManageShows onBack={() => navigate("/admin/dashboard")} />;
}
function VendorManageShowsWithNavigation() {
    const navigate = useNavigate();
    return <VendorManageShows onBack={() => navigate("/vendor/dashboard")} />;
}
function VendorBookingsWithNavigation() {
    const navigate = useNavigate();
    return <VendorBookings onBack={() => navigate("/vendor/dashboard")} />;
}
function ManageTheatersWithNavigation() {
    const navigate = useNavigate();
    return <VendorManageTheaters onBack={() => navigate("/admin/dashboard")} />;
}
function VendorManageTheatersWithNavigation() {
    const navigate = useNavigate();
    return (
        <VendorManageTheaters onBack={() => navigate("/vendor/dashboard")} />
    );
}
function UserListWithNavigation() {
    const navigate = useNavigate();
    return <UserList onBack={() => navigate("/admin/dashboard")} />;
}
function AdminBookingsWithNavigation() {
    const navigate = useNavigate();
    return <AdminBookings onBack={() => navigate("/admin/dashboard")} />;
}

const AppRouter = () => {
    return (
        <Routes>
            {/* Auth Route - Outside of RootLayout to hide Header/Footer */}
            <Route path="/auth" element={<AuthWrapper />} />
            {/* Routes with Header/Footer */}
            <Route index element={<HomeWithNavigation />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/booking-guide" element={<BookingGuide />} />
            <Route path="/giftcards" element={<GiftCards />} />
            <Route
                path="/upcoming-movies"
                element={<UpcomingMoviesWithNavigation />}
            />
            <Route path="/latest-offers" element={<LatestOffers />} />
            {/* Protected User Routes */}
            <Route
                path="bookings"
                element={
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="profile"
                element={
                    <ProtectedRoute>
                        <UpdateProfileWithNavigation />
                    </ProtectedRoute>
                }
            />
            {/* Flows */}
            <Route path="movie/:id" element={<MovieDetailsWithNavigation />} />
            <Route
                path="booking/:showId"
                element={
                    <ProtectedRoute>
                        <BookingPageWithNavigation />
                    </ProtectedRoute>
                }
            />
            <Route
                path="payment"
                element={
                    <ProtectedRoute>
                        <PaymentPageWithNavigation />
                    </ProtectedRoute>
                }
            />
            <Route
                path="payment-success"
                element={
                    <ProtectedRoute>
                        <PaymentSuccessWithNavigation />
                    </ProtectedRoute>
                }
            />
            {/* Vendor Routes */}
            <Route path="vendor">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["vendor"]}>
                            <VendorDashboardWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="shows"
                    element={
                        <ProtectedRoute allowedRoles={["vendor"]}>
                            <VendorManageShowsWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="bookings"
                    element={
                        <ProtectedRoute allowedRoles={["vendor"]}>
                            <VendorBookingsWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="theaters"
                    element={
                        <ProtectedRoute allowedRoles={["vendor"]}>
                            <VendorManageTheatersWithNavigation />
                        </ProtectedRoute>
                    }
                />
            </Route>
            {/* Admin Routes */}
            <Route path="admin">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboardWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="movies"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <ManageMoviesWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="upcoming-movies"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <ManageUpcomingMoviesWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="shows"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <ManageShowsWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="theaters"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <ManageTheatersWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="users"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <UserListWithNavigation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="bookings"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminBookingsWithNavigation />
                        </ProtectedRoute>
                    }
                />
            </Route>
            {/* Catch all - Outside of RootLayout to hide Header/Footer */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
