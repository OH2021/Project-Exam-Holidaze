import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        Holidaze
      </Link>

      <nav className="flex items-center space-x-4">
        {/* ✅ Home button */}
        <Link to="/">Home</Link>

        <Link to="/venues">Venues</Link>

        {user && <Link to="/bookings">My Bookings</Link>}
        {user?.venueManager && <Link to="/venues/create">Create Venue</Link>}
        {user && <Link to="/Profile">Profile</Link>}

        {user ? (
          <div className="flex items-center space-x-2">
            {user.avatar?.url && (
              <img
                src={user.avatar.url}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
