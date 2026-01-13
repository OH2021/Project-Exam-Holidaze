import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth() || {};

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        Holidaze
      </Link>

      <nav className="space-x-4 flex items-center">
        <Link to="/">Home</Link>
        <Link to="/venues">Venues</Link>

        {user && <Link to="/bookings">My Bookings</Link>}

        {user?.venueManager && (
          <>
            <Link to="/venues/create">Create Venue</Link>
            <Link to="/admin">Admin</Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="ml-2">{user.name}</span>
            <button
              onClick={logout}
              className="ml-2 bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
