import React, { Suspense, useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import Header from "./Layouts/Header.jsx";
import Footer from "./Layouts/Footer.jsx";

const Home = React.lazy(() => import("./Pages/Home.jsx"));
const AuthComponent = React.lazy(() => import("./Pages/Auth.jsx"));
const ManageMovies = React.lazy(() => import("./Pages/Admin/ManageMovies.jsx"));
const ManageUpcomingMovies = React.lazy(
    () => import("./Pages/Admin/ManageUpcomingMovies.jsx"),
);
const UserList = React.lazy(() => import("./Pages/Admin/UserList.jsx"));
const AdminDashboard = React.lazy(
    () => import("./Pages/Admin/AdminDashboard.jsx"),
);
const AdminBookings = React.lazy(
    () => import("./Pages/Admin/AdminBookings.jsx"),
);
const VendorDashboard = React.lazy(
    () => import("./Pages/Vendor/VendorDashboard.jsx"),
);
const VendorManageTheaters = React.lazy(
    () => import("./Pages/Vendor/ManageTheaters.jsx"),
);
const VendorManageShows = React.lazy(
    () => import("./Pages/Vendor/ManageShows.jsx"),
);
const AboutUs = React.lazy(() => import("./Pages/AboutUs.jsx"));
const ContactUs = React.lazy(() => import("./Pages/ContactUs.jsx"));
const MyBookings = React.lazy(() => import("./Pages/MyBookings.jsx"));
const MovieDetails = React.lazy(() => import("./Pages/MovieDetails.jsx"));
const BookingPage = React.lazy(() => import("./Pages/BookingPage.jsx"));
const PaymentPage = React.lazy(() => import("./Pages/Payment.jsx"));
const FAQ = React.lazy(() => import("./Pages/FAQ.jsx"));
const BookingGuide = React.lazy(() => import("./Pages/BookingGuide.jsx"));
const UpcomingMovies = React.lazy(() => import("./Pages/UpcomingMovies.jsx"));
const PaymentSuccess = React.lazy(() => import("./Pages/PaymentSuccess.jsx"));
const GiftCards = React.lazy(() => import("./Pages/GiftCards.jsx"));
const UpdateProfile = React.lazy(() => import("./Pages/UpdateProfile.jsx"));
const NotFound = React.lazy(() => import("./Pages/NotFound.jsx"));
const PrivacyPolicy = React.lazy(() => import("./Pages/PrivacyPolicy.jsx"));
const TermsOfService = React.lazy(() => import("./Pages/TermsOfService.jsx"));
const LatestOffers = React.lazy(() => import("./Pages/LatestOffers.jsx"));

import AuthProvider, { useAuth } from "./Contexts/AuthProvider.jsx";

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

// Scroll components
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 p-3 rounded-full bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:bg-purple-500 hover:scale-110 transition-all duration-300"
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} />
        </button>
    );
};

// Layout Component
const RootLayout = () => {
    return (
        <div className="App min-h-screen flex flex-col">
            <ScrollToTop />
            <ScrollToTopButton />
            <LayoutContent />
        </div>
    );
};

// Values needed from AuthContext for Header, so we need a sub-component inside AuthProvider
const LayoutContent = () => {
    return (
        <>
            <Header />
            <main className="grow">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </>
    );
};

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

// Router Configuration
const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <Navigate to="/" replace />,
        children: [
            {
                index: true,
                element: <HomeWithNavigation />,
            },

            {
                path: "about",
                element: <AboutUs />,
            },
            {
                path: "contact",
                element: <ContactUs />,
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy />,
            },
            {
                path: "terms-of-service",
                element: <TermsOfService />,
            },
            {
                path: "faq",
                element: <FAQ />,
            },
            {
                path: "booking-guide",
                element: <BookingGuide />,
            },
            {
                path: "giftcards",
                element: <GiftCards />,
            },
            {
                path: "upcoming-movies",
                element: <UpcomingMoviesWithNavigation />,
            },
            {
                path: "latest-offers",
                element: <LatestOffers />,
            },

            // Protected User Routes
            {
                path: "bookings",
                element: (
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <UpdateProfileWithNavigation />
                    </ProtectedRoute>
                ),
            },

            // Flows
            {
                path: "movie/:id",
                element: <MovieDetailsWithNavigation />,
            },
            {
                path: "booking/:showId",
                element: (
                    <ProtectedRoute>
                        <BookingPageWithNavigation />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payment",
                element: (
                    <ProtectedRoute>
                        <PaymentPageWithNavigation />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payment-success",
                element: (
                    <ProtectedRoute>
                        <PaymentSuccessWithNavigation />
                    </ProtectedRoute>
                ),
            },

            // Vendor Routes
            {
                path: "vendor",
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: "dashboard",
                        element: (
                            <ProtectedRoute allowedRoles={["vendor"]}>
                                <VendorDashboardWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "shows",
                        element: (
                            <ProtectedRoute allowedRoles={["vendor"]}>
                                <VendorManageShowsWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "theaters",
                        element: (
                            <ProtectedRoute allowedRoles={["vendor"]}>
                                <VendorManageTheatersWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },

            // Admin Routes
            {
                path: "admin",
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />,
                    },
                    {
                        path: "dashboard",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboardWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "movies",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageMoviesWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "upcoming-movies",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageUpcomingMoviesWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "shows",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageShowsWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "theaters",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <ManageTheatersWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "users",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <UserListWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "bookings",
                        element: (
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminBookingsWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
        ],
    },
    // Auth Route - Outside of RootLayout to hide Header/Footer
    {
        path: "/auth",
        element: (
            <Suspense
                fallback={
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                        Loading...
                    </div>
                }
            >
                <AuthWrapper />
            </Suspense>
        ),
    },
    // Catch all - Outside of RootLayout to hide Header/Footer
    {
        path: "*",
        element: (
            <Suspense
                fallback={
                    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                        Loading...
                    </div>
                }
            >
                <NotFound />
            </Suspense>
        ),
    },
]);

// Main App
const MovieTicketBookingApp = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default MovieTicketBookingApp;
