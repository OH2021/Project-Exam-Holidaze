import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateAvatar, token, apiKey } = useAuth();
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venuesError, setVenuesError] = useState("");

  useEffect(() => {
    async function fetchMyVenues() {
      if (!user) return;
      setLoadingVenues(true);
      setVenuesError("");

      try {
        // Fetch profile including venues
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}?_venues=true`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              "X-Noroff-API-Key": apiKey,
            },
          },
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err?.errors?.[0]?.message || "Failed to fetch your venues",
          );
        }

        const data = await res.json();
        // API returns profile in data.data — venues may be at data.data.venues
        const profile = data?.data || data;
        setVenues(profile.venues || []);
      } catch (err) {
        console.error(err);
        setVenuesError(err.message || "Could not load your venues");
      } finally {
        setLoadingVenues(false);
      }
    }

    fetchMyVenues();
  }, [user, token, apiKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await updateAvatar(url);
      setMessage("Avatar updated successfully");
      setUrl("");
    } catch (err) {
      setMessage(err.message || "Failed to update avatar");
    }
  }

  async function handleDeleteVenue(venueId) {
    const ok = window.confirm("Are you sure you want to delete this venue?");
    if (!ok) return;

    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "X-Noroff-API-Key": apiKey,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || "Failed to delete venue");
      }

      // remove from local state
      setVenues((prev) => prev.filter((v) => v.id !== venueId));
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete venue");
    }
  }

  if (!user)
    return <p className="p-4">You must be logged in to view your profile.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="flex items-center gap-4 mb-4">
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No avatar</span>
          </div>
        )}

        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          {user.venueManager ? (
            <p className="text-sm text-green-600 mt-1">Venue manager</p>
          ) : (
            <p className="text-sm text-yellow-600 mt-1">
              Not a venue manager / pending
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block mb-2">
          Update avatar URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 w-full mt-1"
            placeholder="https://example.com/avatar.jpg"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Avatar
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>

      <hr className="my-6" />

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Venues</h2>
          {user.venueManager && (
            <button
              onClick={() => navigate("/venues/create")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Create new venue
            </button>
          )}
        </div>

        {loadingVenues && <p className="p-4">Loading your venues...</p>}
        {venuesError && <p className="p-4 text-red-600">{venuesError}</p>}

        {!loadingVenues && venues.length === 0 && (
          <p className="p-4">You don't have any venues yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {venues.map((v) => {
            const image =
              v.media && v.media.length > 0
                ? v.media[0]?.url || v.media[0]
                : null;
            return (
              <div key={v.id} className="border rounded p-4 flex flex-col">
                <div className="flex items-center gap-4">
                  {image ? (
                    <img
                      src={image}
                      alt={v.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{v.name}</h3>
                    <p className="text-sm text-gray-600">
                      ${v.price} per night • {v.maxGuests} guests
                    </p>
                    <p className="text-sm mt-1">
                      {v.description?.slice(0, 120)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/venues/${v.id}/edit`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </Link>

                  <Link
                    to={`/venues/${v.id}/bookings`}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    View Bookings
                  </Link>

                  <button
                    onClick={() => handleDeleteVenue(v.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
