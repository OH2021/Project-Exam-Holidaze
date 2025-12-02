import React, { useState } from "react";
import VenueCard from "./VenueCard";

export default function VenueList({ venues }) {
  const [search, setSearch] = useState("");

  // Ensure venues is always an array
  const safeVenues = Array.isArray(venues) ? venues : [];

  const filtered = safeVenues.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search venues..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>
    </div>
  );
}
