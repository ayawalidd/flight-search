"use client";

import PriceChart from "./components/PriceChart";
import Navbar from "./components/Navbar";
import { useState } from "react";

type Flight = {
  id: string;
  price: number;
  stops: number;
  emissionsKg: number;
  airline: string;
};


export default function HomePage() {
  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("LAX");
  const [date, setDate] = useState("2025-05-01");

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [maxPrice, setMaxPrice] = useState(2000);
  const [maxStops, setMaxStops] = useState(2);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);

    // 🔑 Derived data: available airlines from results
  const airlines = Array.from(
    new Set(flights.map((f) => f.airline))
  );

 const filteredFlights = flights.filter((flight) => {
  const airlineMatch =
    selectedAirlines.length === 0 ||
    selectedAirlines.includes(flight.airline);

  return flight.price <= maxPrice &&
         flight.stops <= maxStops &&
         airlineMatch;
});




  async function searchFlights() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/flights?origin=${origin}&destination=${destination}&date=${date}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError("Could not load flights");
    } finally {
      setLoading(false);
    }
  }


return (
 <main className="min-h-screen bg-gradient-to-b from-[#e3f0ff] via-[#f5faff] to-white">


    <Navbar />

    <div className="px-4 py-8">

     <div className="mx-auto max-w-6xl">

  {/* Hero Section */}
  <div className="mb-12 text-center">
  <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
    Where will you fly next?
  </h1>
  <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
    Compare prices from hundreds of airlines and find your perfect flight
  </p>
</div>


      

        {/* Search Form */}
        <div className="mb-12 grid grid-cols-1 gap-4 rounded-3xl bg-white/80 backdrop-blur p-6 shadow-xl md:grid-cols-5">

         <div className="flex flex-col gap-1">
 <label className="mb-2 text-sm font-medium text-muted-foreground">

    From
  </label>
  <input
    className="rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
    placeholder="Origin (IATA)"
    value={origin}
    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
  />
</div>

<div className="flex flex-col gap-1">
  <label className="mb-2 text-sm font-medium text-muted-foreground">

    To
  </label>
  <input
    className="rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
    placeholder="Destination (IATA)"
    value={destination}
    onChange={(e) => setDestination(e.target.value.toUpperCase())}
  />
</div>

<div className="flex flex-col gap-1">
 <label className="mb-2 text-sm font-medium text-muted-foreground">

    Date
  </label>
  <input
    type="date"
    className="rounded-xl border border-gray-200 bg-white/80 p-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />
</div>


          <button
            onClick={searchFlights}
           className="mt-5 rounded-xl bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        {flights.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow md:grid-cols-2">
            <div>
             <label className="mb-3 flex items-center justify-between text-sm font-medium text-foreground">
  <span>Maximum Price</span>
  <span className="rounded-lg bg-primary/10 px-3 py-1 font-semibold text-primary">
    ${maxPrice}
  </span>
</label>

              <input
                type="range"
                min={0}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Maximum Stops: {maxStops}
              </label>
              <select
                value={maxStops}
                onChange={(e) =>
                  setMaxStops(Number(e.target.value))
                }
                className="w-full cursor-pointer rounded-xl border-2 border-border 
bg-background px-4 py-3 text-foreground outline-none 
transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"

              >
                <option value={0}>Non-stop</option>
                <option value={1}>Up to 1 stop</option>
                <option value={2}>Up to 2 stops</option>
              </select>
            </div>
          </div>
        )}

        {/* Airline Filter */}
{flights.length > 0 && (
  <div className="mb-6 rounded-xl bg-white p-4 shadow">
    <h3 className="mb-4 font-semibold text-foreground">
      Airlines
    </h3>

    <div className="flex flex-wrap gap-4">
      {airlines.map((airline) => (
        <label
          key={airline}
          className="flex items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            checked={selectedAirlines.includes(airline)}
            onChange={(e) => {
              setSelectedAirlines((prev) =>
                e.target.checked
                  ? [...prev, airline]
                  : prev.filter((a) => a !== airline)
              );
            }}
          />
          {airline}
        </label>
      ))}
    </div>
  </div>
)}


        {/* States */}
        {loading && <p>Loading flights...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <PriceChart flights={filteredFlights} />
{filteredFlights.length === 0 && !loading && (
  <p className="text-center text-gray-500 mt-4">
    No flights match your filters.
  </p>
)}

<ul className="space-y-4">
  {filteredFlights.map((flight) => (
    <li
      key={flight.id}
      className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
    >
      <div>
        <p className="font-semibold">Stops: {flight.stops}</p>
        <p className="text-sm text-gray-500">
          Emissions: {flight.emissionsKg.toFixed(1)} kg
        </p>
        <p className="text-sm text-gray-500">
          Airline: {flight.airline}
        </p>
      </div>

      <p className="text-xl font-bold">${flight.price}</p>
    </li>
  ))}
</ul>



      
              </div>
      </div>
    </main>
  );
}
