import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";

export default function VenueDetail() {
  const { id } = useParams();
  const { token, apiKey } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
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

  async function handleBooking() {
    if (!token) {
      setBookingMessage("You must be logged in to book.");
      return;
    }
    if (!selectedDate) {
      setBookingMessage("Please select a date.");
      return;
    }

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
          dateFrom: selectedDate,
          dateTo: selectedDate,
          guests: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        return setBookingMessage(
          data.errors?.[0]?.message || "Booking failed.",
        );

      setBookingMessage("Booking successful!");
    } catch (err) {
      console.error(err);
      setBookingMessage("Something went wrong.");
    }
  }

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!venue) return null;

  const bookedDates = venue.bookings?.map((b) => b.dateFrom) || [];
  const tileDisabled = ({ date }) =>
    bookedDates.some((d) => new Date(d).toDateString() === date.toDateString());

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

      <h2 className="text-xl font-semibold mb-2 mt-6">Available Dates</h2>
      <Calendar tileDisabled={tileDisabled} />

      <h2 className="text-xl mt-6 font-semibold">Book this venue</h2>
      <input
        type="date"
        className="border p-2 mt-2"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button
        onClick={handleBooking}
        className="bg-green-600 text-white px-4 py-2 ml-3 rounded"
      >
        Book Now
      </button>
      {bookingMessage && <p className="mt-2">{bookingMessage}</p>}
    </div>
  );
}
