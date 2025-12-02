import React, { useEffect, useState } from "react";
import VenueList from "../components/VenueList";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(
          "https://v2.api.noroff.dev/holidaze/venues"
        );
        if (!response.ok) throw new Error("Failed to fetch venues");
        const data = await response.json();

        if (Array.isArray(data)) {
          setVenues(data);
        } else if (Array.isArray(data.data)) {
          // Some APIs wrap the array inside a 'data' property
          setVenues(data.data);
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (loading) return <p className="p-4">Loading venues...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return <VenueList venues={venues} />;
}
