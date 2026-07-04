import { NextRequest } from "next/server";

const RAJAONGKIR_V2_BASE = "https://rajaongkir.komerce.id/api/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();

  if (!search || search.length < 3) {
    return Response.json({ results: [] });
  }

  const apiKey = process.env.SHIPPING_COST_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "SHIPPING_COST_API_KEY not configured", results: [] }, { status: 500 });
  }

  try {
    const url = `${RAJAONGKIR_V2_BASE}/destination/domestic-destination?search=${encodeURIComponent(search)}&limit=10&offset=0`;
    const response = await fetch(url, {
      headers: { key: apiKey },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ RajaOngkir destination search error:", response.status, errorText);
      return Response.json({ error: errorText, results: [] }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ results: data?.data ?? [], raw: data });
  } catch (error) {
    console.error("❌ RajaOngkir destination search failed:", error);
    return Response.json({ error: String(error), results: [] }, { status: 500 });
  }
}
