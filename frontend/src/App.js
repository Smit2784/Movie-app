import React, { useState, useEffect } from "react";

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
} from "./Components/index.js";

import AuthProvider, { useAuth } from "./Contexts/AuthProvider.js";

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [authRedirect, setAuthRedirect] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && authRedirect) {
      setSelectedShow(authRedirect.show);
      setCurrentPage("booking");
      setAuthRedirect(null);
    }
  }, [user, authRedirect]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage("movie-details");
  };

  const handleShowSelect = (show, proceed) => {
    if (proceed) {
      setSelectedShow(show);
      setCurrentPage("booking");
    } else {
      setAuthRedirect({ show: show });
      setCurrentPage("auth");
    }
  };

  const handleBookingComplete = (booking) => {
    setBookingData(booking);
    setCurrentPage("payment");
  };

  const handlePaymentComplete = (paymentResult) => {
    setPaymentResult(paymentResult);
    setBookingData(paymentResult.booking);
    setCurrentPage("payment-success");
  };

  const renderPage = () => {
    if (
      !user &&
      (currentPage === "bookings" ||
        currentPage === "booking" ||
        currentPage === "payment")
    ) {
      return <AuthComponent setCurrentPage={setCurrentPage} />;
    }

    if (currentPage.startsWith("admin-") && (!user || user.role !== "admin")) {
      setCurrentPage("home");
      return <Home onMovieSelect={handleMovieSelect} />;
    }

    switch (currentPage) {
      case "auth":
        return <AuthComponent setCurrentPage={setCurrentPage} />;

      case "admin-dashboard":
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      case "admin-movies":
        return (
          <ManageMovies onBack={() => setCurrentPage("admin-dashboard")} />
        );
      case "admin-shows":
        return (
          <ManageShows onBack={() => setCurrentPage("admin-dashboard")} />
        );
      case "admin-theaters":
        return (
          <ManageTheaters onBack={() => setCurrentPage("admin-dashboard")} />
        );
      case "admin-users":
        return <UserList onBack={() => setCurrentPage("admin-dashboard")} />;
      case "admin-bookings":
        return <AdminBookings onBack={() => setCurrentPage("admin-dashboard")} />;

      case "about":
        return <AboutUs />;
      case "contact":
        return <ContactUs />;
      case "booking-guide":
        return <BookingGuide />;
      case "faq":
        return <FAQ />;
      case "movie-details":
        return (
          <MovieDetails
            movie={selectedMovie}
            onBack={() => setCurrentPage("home")}
            onBookNow={handleShowSelect}
          />
        );
      case "booking":
        return (
          <BookingPage
            show={selectedShow}
            onBack={() => setCurrentPage("movie-details")}
            onBookingComplete={handleBookingComplete}
          />
        );
      case "payment":
        return (
          <PaymentPage
            booking={bookingData}
            onBack={() => setCurrentPage("booking")}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      case "payment-success":
        return (
          <PaymentSuccess
            paymentResult={paymentResult}
            booking={bookingData}
            onGoHome={() => {
              setCurrentPage("home");
              setBookingData(null);
              setPaymentResult(null);
            }}
          />
        );
      case "giftcards":
        return <GiftCards />;
      case "bookings":
        return <MyBookings />;
      case "upcoming-movies":
        return (
          <UpcomingMovies
            onMovieSelect={handleMovieSelect}
            onGoHome={() => setCurrentPage("home")}
          />
        );
      case "profile":
        return <UpdateProfile onBack={() => setCurrentPage("home")} />;
      default:
        return <Home onMovieSelect={handleMovieSelect} />;
    }
  };

  return (
    <div className="App min-h-screen flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

// Main component with AuthProvider
const MovieTicketBookingApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default MovieTicketBookingApp;
