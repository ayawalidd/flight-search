import { NextResponse } from "next/server";
import { searchFlights } from "@/app/lib/flightApi";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: "Missing query parameters" },
      { status: 400 }
    );
  }

  try {
    const flights = await searchFlights({
      origin,
      destination,
      date,
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}
