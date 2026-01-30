import { useEffect, useState } from "react";
import VenueList from "../components/VenueList";

const LIMIT = 12;

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues?limit=${LIMIT}&page=${page}&sort=created&sortOrder=desc`,
        );

        if (!res.ok) throw new Error("Failed to fetch venues");

        const data = await res.json();

        // Always set venues from API
        setVenues(data.data || []);

        // Set total page count from API
        setPageCount(data.meta?.pagination?.pageCount || 20);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [page]);

  // Client-side search
  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination component
  const Pagination = () =>
    pageCount > 1 && (
      <div className="flex justify-center items-center gap-2 my-4 flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((pNum) => (
          <button
            key={pNum}
            onClick={() => setPage(pNum)}
            className={`px-3 py-1 border rounded ${
              page === pNum ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {pNum}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
          disabled={page === pageCount}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );

  if (loading) return <p className="p-4">Loading venues...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Venues</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search venues..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* Pagination TOP */}
      <Pagination />

      {/* Venue list */}
      {filteredVenues.length > 0 ? (
        <VenueList venues={filteredVenues} />
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No venues match your search
        </p>
      )}

      {/* Pagination BOTTOM */}
      <Pagination />
    </div>
  );
}
