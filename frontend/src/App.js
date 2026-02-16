import React, { useState, useEffect } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Home,
    AuthComponent,
    ManageTheaters,
    ManageMovies,
    ManageShows,
    UserList,
    AdminDashboard,
    AdminBookings,
    Header,
    AboutUs,
    ContactUs,
    MyBookings,
    MovieDetails,
    BookingPage,
    PaymentPage,
    FAQ,
    BookingGuide,
    UpcomingMovies,
    PaymentSuccess,
    GiftCards,
    Footer,
    UpdateProfile,
    NotFound,
} from "./Index/Index.js";

import AuthProvider, { useAuth } from "./Contexts/AuthProvider.js";

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
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

    if (adminOnly && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Layout Component
const RootLayout = () => {
    return (
        <div className="App min-h-screen flex flex-col">
            <LayoutContent />
        </div>
    );
};

// Values needed from AuthContext for Header, so we need a sub-component inside AuthProvider
const LayoutContent = () => {
    return (
        <>
            <Header />
            <main className="flex-grow">
                <Outlet />
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

function ManageMoviesWithNavigation() {
    const navigate = useNavigate();
    return <ManageMovies onBack={() => navigate("/admin/dashboard")} />;
}
function ManageShowsWithNavigation() {
    const navigate = useNavigate();
    return <ManageShows onBack={() => navigate("/admin/dashboard")} />;
}
function ManageTheatersWithNavigation() {
    const navigate = useNavigate();
    return <ManageTheaters onBack={() => navigate("/admin/dashboard")} />;
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
                            <ProtectedRoute adminOnly={true}>
                                <AdminDashboardWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "movies",
                        element: (
                            <ProtectedRoute adminOnly={true}>
                                <ManageMoviesWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "shows",
                        element: (
                            <ProtectedRoute adminOnly={true}>
                                <ManageShowsWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "theaters",
                        element: (
                            <ProtectedRoute adminOnly={true}>
                                <ManageTheatersWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "users",
                        element: (
                            <ProtectedRoute adminOnly={true}>
                                <UserListWithNavigation />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "bookings",
                        element: (
                            <ProtectedRoute adminOnly={true}>
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
        element: <AuthWrapper />,
    },
    // Catch all - Outside of RootLayout to hide Header/Footer
    {
        path: "*",
        element: <NotFound />,
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
