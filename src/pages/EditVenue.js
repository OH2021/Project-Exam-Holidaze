// src/pages/EditVenue.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchVenue() {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setVenue(data.data);
      setName(data.data.name);
      setPrice(data.data.price);
      setDescription(data.data.description);
      setBookings(data.data.bookings || []);
    }

    fetchVenue();
  }, [id, token]);

  async function handleUpdate(e) {
    e.preventDefault();

    await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        price,
        description,
      }),
    });

    navigate(`/venue/${id}`);
  }

  async function handleDelete() {
    await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    navigate("/venues");
  }

  if (!venue) return null;

  if (venue.owner?.name !== user?.name) {
    return <p>You cannot edit this venue.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>

      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Venue
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
      >
        Delete Venue
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        Bookings For This Venue
      </h2>

      {bookings.length === 0 && <p>No bookings yet.</p>}

      {bookings.map((b) => (
        <div key={b.id} className="border p-3 rounded mb-2">
          <p>
            {new Date(b.dateFrom).toDateString()} →{" "}
            {new Date(b.dateTo).toDateString()}
          </p>
          <p>Guests: {b.guests}</p>
        </div>
      ))}
    </div>
  );
}
