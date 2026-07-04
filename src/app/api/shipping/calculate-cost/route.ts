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

    // Split couriers and fetch all in parallel
    const courierList = String(courier).split(",").map(c => c.trim());
    const courierRequests = courierList.map(async (singleCourier) => {
      const params = new URLSearchParams();
      params.append("origin", String(origin));
      params.append("destination", String(destination));
      params.append("weight", String(weight));
      params.append("courier", singleCourier);
      if (price !== undefined) {
        params.append("price", price ? "lowest" : "highest");
      }

      try {
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
          console.warn(`⚠️ RajaOngkir ${type} cost error for ${singleCourier}:`, response.status);
          return [];
        }

        const data = await response.json();
        if (data?.meta?.code === 200 && data?.data) {
          return data.data;
        }
        return [];
      } catch (error) {
        console.warn(`⚠️ RajaOngkir ${type} fetch error for ${singleCourier}:`, error);
        return [];
      }
    });

    console.log(`📦 RajaOngkir ${type} cost calculation for couriers:`, courierList);

    const allResults = await Promise.all(courierRequests);
    const allCosts = allResults.flat();

    if (allCosts.length > 0) {
      const costs: ShippingCost[] = allCosts.map((item: any) => ({
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
      console.log(`✅ RajaOngkir ${type} cost returned:`, costs.length, "options");
      return Response.json({ success: true, costs });
    }

    return Response.json({ error: "No shipping options available", costs: [] }, { status: 200 });
  } catch (error) {
    console.error("❌ RajaOngkir cost calculation failed:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
