import { NextRequest } from "next/server";

const RAJAONGKIR_V2_BASE = "https://rajaongkir.komerce.id/api/v1";

export interface CalculateCostRequest {
  origin: string | number;
  destination: string | number;
  weight: number;
  courier: string;
  type: "domestic" | "international";
  price?: boolean;
}

export interface ShippingCost {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  currency?: string;
  currency_value?: number;
  currency_updated_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculateCostRequest = await request.json();
    const { origin, destination, weight, courier, type, price } = body;

    // Validate required fields
    if (!origin || !destination || !weight || !courier || !type) {
      return Response.json(
        { error: "Missing required fields: origin, destination, weight, courier, type" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SHIPPING_COST_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "SHIPPING_COST_API_KEY not configured" }, { status: 500 });
    }

    const endpoint =
      type === "domestic" ? `${RAJAONGKIR_V2_BASE}/calculate/domestic-cost` : `${RAJAONGKIR_V2_BASE}/calculate/international-cost`;

    const params = new URLSearchParams();
    params.append("origin", String(origin));
    params.append("destination", String(destination));
    params.append("weight", String(weight));
    params.append("courier", String(courier));
    if (price !== undefined) {
      params.append("price", price ? "lowest" : "highest");
    }

    console.log(`📦 RajaOngkir ${type} cost calculation:`, {
      endpoint,
      origin,
      destination,
      weight,
      courier,
      price,
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        key: apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ RajaOngkir ${type} cost error:`, response.status, errorText);
      return Response.json(
        { error: `RajaOngkir API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ RajaOngkir ${type} cost returned:`, data?.data?.length || 0, "options");

    if (data?.status?.code === 200 || data?.meta?.code === 200 || data?.data) {
      const costs: ShippingCost[] = (data.data || []).map((item: any) => ({
        name: item.name,
        code: item.code,
        service: item.service,
        description: item.description,
        cost: item.cost,
        etd: item.etd,
        currency: item.currency,
        currency_value: item.currency_value,
        currency_updated_at: item.currency_updated_at,
      }));
      return Response.json({ success: true, costs, raw: data });
    }

    return Response.json({ error: "Unexpected API response format", raw: data }, { status: 400 });
  } catch (error) {
    console.error("❌ RajaOngkir cost calculation failed:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
