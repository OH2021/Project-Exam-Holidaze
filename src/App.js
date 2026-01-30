import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";
import VenueBookings from "./pages/Bookings";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Logged-in user routes */}
          <Route
            path="/bookings"
            element={user ? <MyBookings /> : <Navigate to="/login" />}
          />
          <Route
            path="/Profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          {/* Venue manager only for creating new venues */}
          <Route
            path="/venues/create"
            element={user?.venueManager ? <CreateVenue /> : <Navigate to="/" />}
          />

          {/* Allow any logged-in user to open the Edit and Bookings pages,
              then let those pages themselves verify ownership/permissions.
              This fixes the case where an owner can't access because
              user?.venueManager was false at the route level. */}
          <Route
            path="/venues/:id/edit"
            element={user ? <EditVenue /> : <Navigate to="/login" />}
          />
          <Route
            path="/venues/:id/bookings"
            element={user ? <VenueBookings /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
