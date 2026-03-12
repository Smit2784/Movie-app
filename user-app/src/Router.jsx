import React, { Suspense } from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useAuth } from "./Contexts/AuthProvider.jsx";

const Home = React.lazy(() => import("./Pages/Home.jsx"));
const AuthComponent = React.lazy(() => import("./Pages/Auth.jsx"));
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

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
    return children;
};

function HomeWithNavigation() {
    const navigate = useNavigate();
    return <Home onMovieSelect={(movie) => navigate(`/movie/${movie._id}`, { state: { movie } })} />;
}

function UpcomingMoviesWithNavigation() {
    const navigate = useNavigate();
    return (
        <UpcomingMovies
            onMovieSelect={(movie) => navigate(`/movie/${movie._id}`, { state: { movie } })}
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
                if (proceed) navigate(`/booking/${show._id}`, { state: { show } });
                else navigate("/auth", { state: { from: `/booking/${show._id}`, show } });
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
            onBookingComplete={(booking) => navigate("/payment", { state: { booking } })}
        />
    );
}

function PaymentPageWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking;
    if (!booking) return <Navigate to="/" replace />;
    return (
        <PaymentPage
            booking={booking}
            onBack={() => navigate(-1)}
            onPaymentComplete={(result) =>
                navigate("/payment-success", { state: { result, booking: result.booking } })
            }
        />
    );
}

function PaymentSuccessWithNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { result, booking } = location.state || {};
    return <PaymentSuccess paymentResult={result} booking={booking} onGoHome={() => navigate("/")} />;
}

function UpdateProfileWithNavigation() {
    const navigate = useNavigate();
    return <UpdateProfile onBack={() => navigate("/")} />;
}

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/auth" element={<AuthWrapper />} />
            <Route index element={<HomeWithNavigation />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/booking-guide" element={<BookingGuide />} />
            <Route path="/giftcards" element={<GiftCards />} />
            <Route path="/upcoming-movies" element={<UpcomingMoviesWithNavigation />} />
            <Route path="/latest-offers" element={<LatestOffers />} />
            <Route path="movie/:id" element={<MovieDetailsWithNavigation />} />
            <Route path="bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><UpdateProfileWithNavigation /></ProtectedRoute>} />
            <Route path="booking/:showId" element={<ProtectedRoute><BookingPageWithNavigation /></ProtectedRoute>} />
            <Route path="payment" element={<ProtectedRoute><PaymentPageWithNavigation /></ProtectedRoute>} />
            <Route path="payment-success" element={<ProtectedRoute><PaymentSuccessWithNavigation /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
