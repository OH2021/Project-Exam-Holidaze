import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl">
        Holidaze
      </Link>
      <nav className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/venues">Venues</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/register">Register</Link>
        <Link to="/bookings">My Bookings</Link>
      </nav>
    </header>
  );
}
