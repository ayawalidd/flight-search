import { mockFlights } from "./mockFlights";

type SearchParams = {
  origin: string;
  destination: string;
  date: string;
};

export async function searchFlights({
  origin,
  destination,
  date,
}: SearchParams) {
  const apiKey = process.env.FLIGHTAPI_KEY!;

  const url = `https://api.flightapi.io/onewaytrip/${apiKey}/${origin}/${destination}/${date}/1/0/0/Economy/USD`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    console.warn(
      "FlightAPI quota reached or error. Falling back to mock data.",
      res.status,
      errorText
    );

    return mockFlights;
  }

  const json = await res.json();

  const itineraries = json.itineraries ?? [];
  const emissionsMap = json.emissions ?? {};

  return itineraries.map((itinerary: any, index: number) => {
    const leg = itinerary.legs?.[0];
    const emissionKey = leg?.id;

    const emissionData = emissionsMap[emissionKey];
    const segments = leg?.segments ?? [];
    const stops = Math.max(segments.length - 1, 0);

    // ✅ ADD THIS (AIRLINE EXTRACTION)
    const airline =
      segments?.[0]?.carrierCode ??
      segments?.[0]?.operating?.carrierCode ??
      "Unknown";

    const emissionsKg =
      emissionData?.emissions_in_kg ??
      leg?.emissions?.emissions_in_kg ??
      0;

    // ✅ RETURN airline WITH THE FLIGHT
    return {
      id: itinerary.id ?? emissionKey ?? index.toString(),
      price: Number(
        itinerary.price?.amount ??
        itinerary.price?.raw ??
        0
      ),
      stops,
      emissionsKg,
      airline,
    };
  });
}
