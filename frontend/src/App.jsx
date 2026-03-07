import AuthProvider from "./Contexts/AuthProvider.jsx";
import AppRouter from "./Components/Router.jsx";
import { Suspense } from "react";
import {
    ScrollToTop,
    ScrollToTopButton,
} from "./Components/GlobalComponents.jsx";
import Header from "./Layouts/Header.jsx";
import Footer from "./Layouts/Footer.jsx";
import { useLocation } from "react-router-dom";

// Main App
const App = () => {
    const location = useLocation();

    // Determine if the current route is a 404 Not Found page or Auth page
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);
    const basePath = pathParts[0] || "";

    let isNotFound = false;

    const validExactRoutes = [
        "",
        "auth",
        "about",
        "contact",
        "privacy-policy",
        "terms-of-service",
        "faq",
        "booking-guide",
        "giftcards",
        "upcoming-movies",
        "latest-offers",
        "bookings",
        "profile",
        "payment",
        "payment-success",
    ];

    const validDynamicRoutes = ["movie", "booking"];

    const vendorRoutes = ["dashboard", "shows", "theaters"];
    const adminRoutes = [
        "dashboard",
        "movies",
        "upcoming-movies",
        "shows",
        "theaters",
        "users",
        "bookings",
    ];

    if (validExactRoutes.includes(basePath)) {
        if (pathParts.length > 1) isNotFound = true;
    } else if (validDynamicRoutes.includes(basePath)) {
        if (pathParts.length !== 2) isNotFound = true;
    } else if (basePath === "vendor") {
        if (
            pathParts.length > 2 ||
            (pathParts.length === 2 && !vendorRoutes.includes(pathParts[1]))
        ) {
            isNotFound = true;
        }
    } else if (basePath === "admin") {
        if (
            pathParts.length > 2 ||
            (pathParts.length === 2 && !adminRoutes.includes(pathParts[1]))
        ) {
            isNotFound = true;
        }
    } else {
        isNotFound = true;
    }

    const hideHeaderFooter = basePath === "auth" || isNotFound;

    return (
        <AuthProvider>
            {!hideHeaderFooter && <Header />}
            <Suspense
                fallback={
                    <div className="min-h-screen justify-center items-center flex">
                        Loading...
                    </div>
                }
            >
                <AppRouter />
            </Suspense>
            {!hideHeaderFooter && <Footer />}
            <ScrollToTop />
            <ScrollToTopButton />
        </AuthProvider>
    );
};

export default App;
