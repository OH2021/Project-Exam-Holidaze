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
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";
import AvatarUpdate from "./components/AvatarUpdate";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth(); // get logged-in user data

  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/register" element={<Register />} />

          {/* Profile page for logged-in users (capital P) */}
          <Route
            path="/Profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          {/* Avatar update page for logged-in users */}
          <Route
            path="/profile/avatar"
            element={user ? <AvatarUpdate /> : <Navigate to="/login" />}
          />

          {/* ✅ PROTECTED ROUTES FOR VENUE MANAGERS */}
          <Route
            path="/venues/create"
            element={
              user?.venueManager ? <CreateVenue /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/venues/:id/edit"
            element={
              user?.venueManager ? <EditVenue /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
