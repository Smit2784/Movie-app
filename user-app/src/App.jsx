import AuthProvider from "./Contexts/AuthProvider.jsx";
import AppRouter from "./Router.jsx";
import { Suspense } from "react";
import { ScrollToTop, ScrollToTopButton } from "./GlobalComponents.jsx";
import Header from "./Layouts/Header.jsx";
import Footer from "./Layouts/Footer.jsx";
import { useLocation } from "react-router-dom";

const App = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/").filter(Boolean);
    const basePath = pathParts[0] || "";

    const hideHeaderFooter = basePath === "auth";

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
