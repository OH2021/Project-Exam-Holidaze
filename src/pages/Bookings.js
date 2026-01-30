import { useEffect, useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Updated Bookings page:

  - Primary source: GET /venues/{id}?_bookings=true (venue + bookings).
  - Ownership detection:
      1) tolerant owner field matching (if venue.owner exists),
      2) fallback: fetch the logged-in user's profile with ?_venues=true and check
         whether the current venue id is in the user's venues list.
     This covers the API shape where venue.owner is null but the profile lists created venues.
  - Shows bookings only if the logged-in user is the owner of that venue.
  - Tries to display the booking user's name from booking payloads and (if missing)
    attempts to resolve a profile via GET /profiles/{candidate} (cached).
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
  // If we have no token, we can't reliably fetch profile venues
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

function bookingCandidates(b) {
  const c = [];
  if (!b) return c;
  if (b.user) {
    if (typeof b.user === "string" || typeof b.user === "number")
      c.push(s(b.user));
    else if (typeof b.user === "object") {
      if (b.user.id) c.push(s(b.user.id));
      if (b.user.name) c.push(s(b.user.name));
      if (b.user.username) c.push(s(b.user.username));
      if (b.user.email) c.push(s(b.user.email));
    }
  }
  if (b.userId) c.push(s(b.userId));
  if (b.user_id) c.push(s(b.user_id));
  if (b.bookedBy) {
    if (typeof b.bookedBy === "string" || typeof b.bookedBy === "number")
      c.push(s(b.bookedBy));
    else if (typeof b.bookedBy === "object") {
      if (b.bookedBy.id) c.push(s(b.bookedBy.id));
      if (b.bookedBy.name) c.push(s(b.bookedBy.name));
      if (b.bookedBy.username) c.push(s(b.bookedBy.username));
      if (b.bookedBy.email) c.push(s(b.bookedBy.email));
    }
  }
  if (b.name) c.push(s(b.name));
  if (b.email) c.push(s(b.email));
  if (b.customer) {
    if (typeof b.customer === "string" || typeof b.customer === "number")
      c.push(s(b.customer));
    else if (typeof b.customer === "object") {
      if (b.customer.id) c.push(s(b.customer.id));
      if (b.customer.name) c.push(s(b.customer.name));
      if (b.customer.email) c.push(s(b.customer.email));
    }
  }
  return Array.from(new Set(c)).filter(Boolean);
}

export default function VenueBookings() {
  const { id } = useParams();
  const { user, token, apiKey } = useAuth();
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVenueAndBookings = useCallback(async () => {
    setLoading(true);
    setError("");
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

      // Ownership detection:
      // 1) easy owner field match if present
      // 2) fallback: check if this venue is in the logged-in user's profile venues list
      let allowed = false;
      if (isOwnerFieldMatch(v, user)) allowed = true;
      else {
        allowed = await userCreatedThisVenue(user, token, apiKey, id);
      }

      if (!allowed) {
        setBookings([]);
        setError("You do not have permission to view bookings for this venue.");
        setLoading(false);
        console.debug(
          "Access denied — venue owner field, user profile venues checked.",
        );
        return;
      }

      const rawBookings = Array.isArray(v?.bookings) ? v.bookings : [];

      // Immediate name attachment when present on booking
      const initial = rawBookings.map((b) => {
        const immediate =
          (b.user &&
            typeof b.user === "object" &&
            (b.user.name || b.user.username || b.user.email)) ||
          (typeof b.user === "string" ? b.user : null) ||
          b.name ||
          (b.bookedBy &&
            (b.bookedBy.name || b.bookedBy.username || b.bookedBy.email)) ||
          (b.customer && (b.customer.name || b.customer.email)) ||
          null;
        return { ...b, displayName: immediate ? String(immediate) : null };
      });

      setBookings(initial);

      // Resolve missing names via profiles (cached)
      const toResolve = initial.filter((b) => !b.displayName);
      if (toResolve.length === 0) {
        setLoading(false);
        return;
      }

      const cache = new Map();

      await Promise.all(
        toResolve.map(async (b) => {
          const candidates = bookingCandidates(b);
          for (const cand of candidates) {
            if (!cand) continue;
            if (cache.has(cand)) {
              const n = cache.get(cand);
              if (n) b.displayName = n;
              if (b.displayName) break;
              continue;
            }

            // Heuristic: treat full name (contains space) as display name
            if (cand.includes(" ")) {
              cache.set(cand, cand);
              b.displayName = cand;
              break;
            }

            try {
              const profRes = await fetch(
                `https://v2.api.noroff.dev/holidaze/profiles/${encodeURIComponent(cand)}`,
                { headers },
              );

              if (!profRes.ok) {
                cache.set(cand, null);
                continue;
              }

              const profPayload = await profRes.json().catch(() => null);
              const prof = profPayload?.data || profPayload;
              const profName =
                prof?.name || prof?.username || prof?.email || null;
              cache.set(cand, profName);
              if (profName) {
                b.displayName = profName;
                break;
              }
            } catch (err) {
              console.warn("Profile lookup failed for", cand, err);
              cache.set(cand, null);
              continue;
            }
          }
        }),
      );

      // Commit resolved display names
      setBookings((prev) =>
        prev.map((pb) => {
          const match = toResolve.find((t) => t.id === pb.id);
          return match ? { ...pb, displayName: match.displayName || null } : pb;
        }),
      );
    } catch (err) {
      console.error("Failed to load venue/bookings:", err);
      setError(err.message || "Failed to load bookings");
      setVenue(null);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [id, token, apiKey, user]);

  useEffect(() => {
    fetchVenueAndBookings();
  }, [fetchVenueAndBookings]);

  if (!user) return <Navigate to="/login" />;

  if (loading) return <p className="p-4">Loading bookings...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!bookings.length)
    return <p className="p-4">No bookings for this venue yet.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bookings For This Venue</h1>
        <button
          onClick={fetchVenueAndBookings}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <div>
          <strong>Venue:</strong> {venue?.name || "—"}
        </div>
        <div>
          <strong>Owner (raw):</strong> {s(venue?.owner) || "—"}
        </div>
      </div>

      <ul className="space-y-2">
        {bookings.map((b) => (
          <li
            key={b.id ?? `${b.dateFrom}-${b.dateTo}-${b.guests}`}
            className="border p-3 rounded"
          >
            <p>
              <strong>User:</strong>{" "}
              {b.displayName ||
                b.user?.name ||
                b.name ||
                b.bookedBy?.name ||
                "Unknown"}
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
            {b.created && (
              <p className="text-sm text-gray-500">
                Created: {new Date(b.created).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
