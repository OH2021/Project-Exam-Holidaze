import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateVenue() {
  const { user, token, apiKey } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) {
    navigate("/login");
  }

  if (!user.venueManager) {
    return (
      <p className="text-center mt-6 text-red-600">
        You registered as a venue manager, but your account is pending approval.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
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
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errors?.[0]?.message || "Failed to create venue");
        return;
      }

      setSuccess("Venue created successfully!");
      navigate(`/venue/${data.data.id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-4 border rounded mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Create a New Venue</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <label className="block mb-2">
        Name
        <input
          type="text"
          className="border w-full p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block mb-2">
        Description
        <textarea
          className="border w-full p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label className="block mb-2">
        Media URL
        <input
          type="url"
          className="border w-full p-2"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        Price per night
        <input
          type="number"
          className="border w-full p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>

      <label className="block mb-4">
        Max Guests
        <input
          type="number"
          className="border w-full p-2"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          min={1}
          required
        />
      </label>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Venue
      </button>
    </form>
  );
}
