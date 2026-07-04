import { NextRequest } from "next/server";
import { getAllProducts } from "@/lib/products";
import { readJson, writeJson } from "@/lib/store";
import { SUPABASE_KEYS, SHIPPING } from "@/lib/constants";
import type { Product } from "@/lib/types";

export async function POST(request: NextRequest) {
  // Verify admin session via header (simple check)
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.includes("admin")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await readJson<Product[]>(SUPABASE_KEYS.PRODUCTS, []);

    let updated = 0;
    const updatedProducts = products.map((product) => {
      let changed = false;

      // Set default weight if missing
      if (!product.weightKg) {
        product.weightKg = SHIPPING.DEFAULT_WEIGHT_KG;
        changed = true;
      }

      // Set default dimensions if missing
      if (!product.dimensionsCm) {
        product.dimensionsCm = {
          width: SHIPPING.DEFAULT_DIMENSION_W,
          height: SHIPPING.DEFAULT_DIMENSION_H,
          depth: SHIPPING.DEFAULT_DIMENSION_L,
        };
        changed = true;
      }

      if (changed) {
        updated++;
      }

      return product;
    });

    // Write back all products
    await writeJson(SUPABASE_KEYS.PRODUCTS, updatedProducts);

    return Response.json({
      success: true,
      message: `Backfilled ${updated} products with default dimensions and weight`,
      total: products.length,
      updated,
    });
  } catch (error) {
    console.error("Backfill error:", error);
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
