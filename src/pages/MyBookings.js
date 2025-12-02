import { useEffect, useState } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token) return setError("Please log in.");

      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/bookings?_venue=true`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) return setError("Failed to load bookings.");

        setBookings(data.data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      }
    }

    fetchBookings();
  }, []);

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 && <p>No upcoming bookings.</p>}

      {bookings.map((b) => (
        <div key={b.id} className="border p-4 mb-4 rounded">
          <h2 className="font-bold">{b.venue.name}</h2>
          <p>Date: {b.dateFrom}</p>
        </div>
      ))}
    </div>
  );
}
