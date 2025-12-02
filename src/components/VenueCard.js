import React from "react";
import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  return (
    <Link
      to={`/venue/${venue.id}`}
      className="block border rounded shadow hover:shadow-lg transition p-4"
    >
      {venue.media && venue.media.length > 0 && (
        <img
          src={venue.media[0]}
          alt={venue.name}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}
      <h2 className="text-xl font-bold">{venue.name}</h2>
      <p className="text-gray-600">{venue.description?.substring(0, 100)}...</p>
      <p className="mt-2 font-semibold">${venue.price} / night</p>
    </Link>
  );
}
