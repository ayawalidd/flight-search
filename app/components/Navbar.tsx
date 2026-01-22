"use client";

export default function Navbar() {
  return (
    <nav className="flex items-center px-6 py-4 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-2">
        {/* Airplane icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white text-xl font-bold">
          ✈️
        </div>

        {/* Brand name */}
        <span className="text-2xl font-bold text-gray-900 tracking-tight">
          FlightEngine
        </span>
      </div>
    </nav>
  );
}
