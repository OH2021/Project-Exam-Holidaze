import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        Holidaze
      </Link>

      <nav className="space-x-4 flex items-center">
        <Link to="/">Home</Link>
        <Link to="/venues">Venues</Link>

        {user && <Link to="/bookings">My Bookings</Link>}

        {/* Show only for venue managers */}
        {user?.venueManager && (
          <>
            <Link to="/venues/create">Create Venue</Link>
          </>
        )}

        {user ? (
          <div className="flex items-center space-x-2 ml-4">
            <span>Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="ml-4">
              Login
            </Link>
            <Link to="/register" className="ml-2">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
