import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { token, apiKey, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (!token) return;

      try {
        // Use /profiles/me?_bookings=true to get current user's bookings
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}?_bookings=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        // Make sure we handle empty bookings array
        setBookings(data.data.bookings || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token, apiKey, user]);

  if (loading) return <p className="p-4">Loading bookings...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id} className="mb-2 border-b pb-2">
              <strong>{b.venue.name}</strong> <br />
              From: {new Date(b.dateFrom).toLocaleDateString()} <br />
              To: {new Date(b.dateTo).toLocaleDateString()} <br />
              Guests: {b.guests}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
