import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateVenue() {
  const { user, token } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState("");
  const [message, setMessage] = useState("");

  async function handleCreate() {
    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            price: Number(price),
            media: media ? [media] : [],
            maxGuests: 4,
            venueManager: user.name,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create venue");

      setMessage("Venue created successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Venue</h1>

      <input
        type="text"
        placeholder="Venue name"
        className="border p-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price per night"
        className="border p-2 w-full mb-3"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Image URL"
        className="border p-2 w-full mb-3"
        value={media}
        onChange={(e) => setMedia(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Venue
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
