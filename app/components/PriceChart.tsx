"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Flight = {
  id: string;
  price: number;
  stops: number;
  emissionsKg: number;
  airline: string;
};


export default function PriceChart({ flights }: { flights: Flight[] }) {
  if (!flights.length) return null;

  // Prepare chart data
  const data = flights.map((flight, index) => ({
    name: `Flight ${index + 1}`,
    price: flight.price,
  }));

  return (
    <div className="mt-8 rounded-xl bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        Price Trend
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
