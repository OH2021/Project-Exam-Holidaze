import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";

export default function VenueDetail() {
  const { id } = useParams();
  const { token, apiKey, user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`,
        );
        if (!res.ok) throw new Error("Failed to fetch venue");
        const data = await res.json();
        setVenue(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  const handleBooking = async () => {
    if (!token) {
      setBookingMessage("You must be logged in to book.");
      return;
    }
    if (!startDate || !endDate) {
      setBookingMessage("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setBookingMessage("End date must be after start date.");
      return;
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    try {
      const res = await fetch("https://v2.api.noroff.dev/holidaze/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({
          venueId: id,
          dateFrom: startDate,
          dateTo: endDate,
          guests: Number(guests),
        }),
      });

      const data = await res.json();
      if (!res.ok)
        return setBookingMessage(
          data.errors?.[0]?.message || "Booking failed.",
        );

      setBookingMessage(`Booking successful for ${nights} night(s)!`);
    } catch (err) {
      console.error(err);
      setBookingMessage("Something went wrong.");
    }
  };

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!venue) return null;

  const bookedDates = venue.bookings?.map((b) => b.dateFrom) || [];
  const tileDisabled = ({ date }) =>
    bookedDates.some((d) => new Date(d).toDateString() === date.toDateString());

  const showManagerLinks = user?.venueManager;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
      {venue.media && venue.media.length > 0 && (
        <img
          src={venue.media[0]?.url || venue.media[0]}
          alt={venue.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <p className="mb-4">{venue.description}</p>
      <p>
        <strong>Price:</strong> ${venue.price} per night
      </p>
      <p>
        <strong>Max Guests:</strong> {venue.maxGuests}
      </p>

      {showManagerLinks && (
        <div className="mt-4 space-x-2">
          <Link
            to={`/venues/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Venue
          </Link>
          <Link
            to={`/venues/${id}/bookings`}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            View Bookings
          </Link>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2 mt-6">Available Dates</h2>
      <Calendar tileDisabled={tileDisabled} />

      <h2 className="text-xl mt-6 font-semibold">Book this venue</h2>
      <label className="block mb-2">
        Start Date
        <input
          type="date"
          className="border p-2 w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        End Date
        <input
          type="date"
          className="border p-2 w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Guests
        <input
          type="number"
          min={1}
          max={venue.maxGuests || 1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border p-2 w-full"
        />
      </label>

      <button
        onClick={handleBooking}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>

      {bookingMessage && <p className="mt-2">{bookingMessage}</p>}
    </div>
  );
}
