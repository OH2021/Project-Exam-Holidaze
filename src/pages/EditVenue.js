import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EditVenue() {
  const { id } = useParams();
  const { token, apiKey } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        );
        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
        setMediaUrl(data.media?.[0]?.url || "");
        setPrice(data.price);
        setMaxGuests(data.maxGuests);
      } catch (err) {
        setError("Failed to load venue");
      }
    }
    fetchVenue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            name,
            description,
            media: mediaUrl ? [{ url: mediaUrl }] : [],
            price: Number(price),
            maxGuests: Number(maxGuests),
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update venue");

      navigate(`/venue/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 border rounded mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Venue</h2>
      {error && <p className="text-red-600">{error}</p>}

      <label className="block mb-2">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2"
          required
        />
      </label>

      <label className="block mb-2">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2"
          required
        />
      </label>

      <label className="block mb-2">
        Media URL
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="border w-full p-2"
        />
      </label>

      <label className="block mb-2">
        Price
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border w-full p-2"
          required
        />
      </label>

      <label className="block mb-4">
        Max Guests
        <input
          type="number"
          value={maxGuests}
          min={1}
          onChange={(e) => setMaxGuests(e.target.value)}
          className="border w-full p-2"
          required
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </form>
  );
}
