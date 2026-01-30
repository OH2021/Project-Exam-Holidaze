import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  EditVenue with robust owner detection

  - Loads GET /venues/{id}?_bookings=true (uses token when available).
  - Determines ownership in two ways:
      1) tolerant owner-field match (if venue.owner is present),
      2) fallback: fetch the logged-in user's profile with ?_venues=true and check
         whether this venue id is listed in the user's created venues.
  - Only allows editing/deleting when ownership is confirmed.
  - Keeps existing update/delete logic and surfaces server messages.
*/

function s(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function norm(v) {
  return s(v).toLowerCase();
}

function ownerIdentifiers(owner) {
  const ids = [];
  if (!owner) return ids;
  if (typeof owner === "string") {
    ids.push(owner);
    const parts = owner.split("/").filter(Boolean);
    if (parts.length) ids.push(parts[parts.length - 1]);
    return Array.from(new Set(ids.map(s).filter(Boolean)));
  }
  if (typeof owner === "object") {
    if (owner.id) ids.push(owner.id);
    if (owner._id) ids.push(owner._id);
    if (owner.name) ids.push(owner.name);
    if (owner.username) ids.push(owner.username);
    if (owner.email) ids.push(owner.email);
    if (owner.url) ids.push(owner.url);
    ids.push(JSON.stringify(owner));
    return Array.from(new Set(ids.map(s).filter(Boolean)));
  }
  ids.push(String(owner));
  return Array.from(new Set(ids.map(s).filter(Boolean)));
}

function userIdentifiers(user) {
  const ids = [];
  if (!user) return ids;
  if (user.id) ids.push(user.id);
  if (user._id) ids.push(user._id);
  if (user.name) ids.push(user.name);
  if (user.username) ids.push(user.username);
  if (user.email) ids.push(user.email);
  ids.push(JSON.stringify(user));
  return Array.from(new Set(ids.map(s).filter(Boolean)));
}

function isOwnerFieldMatch(venue, user) {
  if (!venue || !user) return false;
  const owner = venue.owner ?? venue.createdBy ?? null;
  if (!owner) return false;
  const ownerIds = ownerIdentifiers(owner).map(norm);
  const userIds = userIdentifiers(user).map(norm);

  for (const o of ownerIds) {
    if (!o) continue;
    for (const u of userIds) {
      if (!u) continue;
      if (o === u) return true;
      if (o.includes(u) || u.includes(o)) return true;
    }
  }

  console.debug("Owner ids:", ownerIds, "User ids:", userIds);
  return false;
}

async function userCreatedThisVenue(user, token, apiKey, venueId) {
  if (!user || !token) return false;
  try {
    const res = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(user.name)}?_venues=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      },
    );
    if (!res.ok) {
      console.warn("Profile _venues fetch failed:", res.status);
      return false;
    }
    const data = await res.json().catch(() => null);
    const profile = data?.data || data;
    const venues = Array.isArray(profile?.venues) ? profile.venues : [];
    return venues.some(
      (v) => String(v?.id || v).toLowerCase() === String(venueId).toLowerCase(),
    );
  } catch (err) {
    console.warn("Failed to fetch user's venues:", err);
    return false;
  }
}

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, apiKey, user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialised, setInitialised] = useState(false); // whether form fields populated
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);

  const fetchVenueAndCheck = useCallback(async () => {
    setLoading(true);
    setError("");
    setAllowed(false);
    try {
      const headers = { "X-Noroff-API-Key": apiKey };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`,
        { headers },
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(
          payload?.errors?.[0]?.message ||
            payload?.message ||
            "Failed to fetch venue",
        );
      }

      const payload = await res.json();
      const v = payload?.data || payload;
      setVenue(v);

      // Owner detection: owner-field OR membership in user's profile venues
      let isAllowed = false;
      if (isOwnerFieldMatch(v, user)) isAllowed = true;
      else {
        // fallback: check profile's venues (requires token)
        isAllowed = await userCreatedThisVenue(user, token, apiKey, id);
      }

      setAllowed(!!isAllowed);

      // populate form fields only if allowed and not yet initialised
      if (isAllowed && !initialised) {
        setName(v.name || "");
        setPrice(v.price ?? "");
        setDescription(v.description || "");
        setMediaUrl(v.media?.[0]?.url || "");
        setMaxGuests(v.maxGuests || 1);
        setInitialised(true);
      }

      if (!isAllowed) {
        setError("You cannot edit this venue.");
      }
    } catch (err) {
      console.error("Failed to load venue:", err);
      setError(err.message || "Failed to load venue");
      setVenue(null);
      setAllowed(false);
    } finally {
      setLoading(false);
    }
  }, [id, token, apiKey, user, initialised]);

  useEffect(() => {
    fetchVenueAndCheck();
  }, [fetchVenueAndCheck]);

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allowed) {
      setError("You do not have permission to update this venue.");
      return;
    }

    try {
      const body = {
        name,
        description,
        media: mediaUrl ? [{ url: mediaUrl }] : [],
        price: Number(price),
        maxGuests: Number(maxGuests),
      };

      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.errors?.[0]?.message || data?.message || "Update failed";
        setError(msg);
        return;
      }

      setSuccess("Venue updated successfully.");
      // refresh venue data & fields
      await fetchVenueAndCheck();
      navigate(`/venue/${id}`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating.");
    }
  }

  async function handleDelete() {
    if (!allowed) {
      setError("You do not have permission to delete this venue.");
      return;
    }
    const ok = window.confirm("Are you sure you want to delete this venue?");
    if (!ok) return;

    setError("");
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.errors?.[0]?.message || data?.message || "Delete failed";
        setError(msg);
        return;
      }

      navigate("/venues");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while deleting.");
    }
  }

  if (!user)
    return <p className="p-4">You must be logged in to edit a venue.</p>;
  if (loading) return <p className="p-4">Loading venue...</p>;
  if (!allowed)
    return (
      <p className="p-4 text-red-600">
        {error || "You cannot edit this venue."}
      </p>
    );
  if (!venue) return <p className="p-4">Venue not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleUpdate} className="space-y-3">
        <label className="block">
          Name
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Price per night
          <input
            type="number"
            className="border p-2 w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Max Guests
          <input
            type="number"
            className="border p-2 w-full"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            min={1}
            required
          />
        </label>

        <label className="block">
          Description
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label className="block">
          Media URL (first image)
          <input
            className="border p-2 w-full"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Venue
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Venue
          </button>

          <Link
            to={`/venues/${id}/bookings`}
            className="ml-auto bg-gray-700 text-white px-4 py-2 rounded"
          >
            View Bookings
          </Link>
        </div>
      </form>
    </div>
  );
}
