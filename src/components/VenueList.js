import React from "react";
import { Link } from "react-router-dom";

export default function VenueList({ venues }) {
  if (!venues || venues.length === 0)
    return <p className="p-4">No venues available.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {venues.map((venue) => {
        // Use first image if available, else a placeholder from Unsplash
        const imageUrl =
          venue.media && venue.media.length > 0 && venue.media[0].url
            ? venue.media[0].url
            : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=crop&h=300&w=400";

        return (
          <div
            key={venue.id}
            className="border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <Link to={`/venue/${venue.id}`}>
              <img
                src={imageUrl}
                alt={venue.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{venue.name}</h3>
                {venue.price !== undefined && (
                  <p className="text-gray-700 mb-2">Price: ${venue.price}</p>
                )}
                {venue.description && (
                  <p className="text-gray-600 text-sm">
                    {venue.description.length > 100
                      ? venue.description.substring(0, 100) + "..."
                      : venue.description}
                  </p>
                )}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
