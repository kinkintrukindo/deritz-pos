import { getOrderById, markOrderProcessed } from "@/lib/orders";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function isValidSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) return false;

  const expected = crypto
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");

  return expected === signatureKey;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Verify this notification genuinely came from Midtrans, not a forged request
    if (!signature_key || !isValidSignature(order_id, status_code, gross_amount, signature_key)) {
      console.error("Invalid Midtrans webhook signature for order", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const order = await getOrderById(order_id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status based on transaction status
    if (transaction_status === "settlement" || transaction_status === "capture") {
      // Payment successful
      if (order.status === "received") {
        await markOrderProcessed(order_id);
      }
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
