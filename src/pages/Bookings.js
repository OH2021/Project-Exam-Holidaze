import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VenueBookings() {
  const { id } = useParams();
  const { token, apiKey } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/bookings?venue=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [id, token, apiKey]);

  if (loading) return <p className="p-4">Loading bookings...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!bookings.length)
    return <p className="p-4">No bookings for this venue yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings for this venue</h1>
      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id} className="border p-2 rounded">
            <p>
              <strong>User:</strong> {b.user?.name || "Unknown"}
            </p>
            <p>
              <strong>Guests:</strong> {b.guests}
            </p>
            <p>
              <strong>Check-in:</strong>{" "}
              {new Date(b.dateFrom).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {new Date(b.dateTo).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
