import React from "react";

const Home = React.lazy(() => import("../Pages/Home.jsx"));
const AuthComponent = React.lazy(() => import("../Pages/Auth.jsx"));
const ManageMovies = React.lazy(() => import("../Pages/Admin/ManageMovies.jsx"));
const ManageUpcomingMovies = React.lazy(() => import("../Pages/Admin/ManageUpcomingMovies.jsx"));
const UserList = React.lazy(() => import("../Pages/Admin/UserList.jsx"));
const AdminDashboard = React.lazy(() => import("../Pages/Admin/AdminDashboard.jsx"));
const AdminBookings = React.lazy(() => import("../Pages/Admin/AdminBookings.jsx"));
const VendorDashboard = React.lazy(() => import("../Pages/Vendor/VendorDashboard.jsx"));
const VendorManageTheaters = React.lazy(() => import("../Pages/Vendor/ManageTheaters.jsx"));
const VendorManageShows = React.lazy(() => import("../Pages/Vendor/ManageShows.jsx"));
const Header = React.lazy(() => import("../Layouts/Header.jsx"));
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
const Footer = React.lazy(() => import("../Layouts/Footer.jsx"));
const UpdateProfile = React.lazy(() => import("../Pages/UpdateProfile.jsx"));
const NotFound = React.lazy(() => import("../Pages/NotFound.jsx"));
const PrivacyPolicy = React.lazy(() => import("../Pages/PrivacyPolicy.jsx"));
const TermsOfService = React.lazy(() => import("../Pages/TermsOfService.jsx"));
const LatestOffers = React.lazy(() => import("../Pages/LatestOffers.jsx"));

export {
    Home,
    AuthComponent,
    ManageMovies,
    ManageUpcomingMovies,
    UserList,
    AdminDashboard,
    AdminBookings,
    VendorDashboard,
    VendorManageTheaters,
    VendorManageShows,
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
    PrivacyPolicy,
    TermsOfService,
    LatestOffers,
};
