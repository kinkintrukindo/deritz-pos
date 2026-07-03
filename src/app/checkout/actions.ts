"use server";

import { createOrder, type NewOrderInput } from "@/lib/orders";
import { createMockPaymentToken, type MockPaymentToken } from "@/lib/midtrans-mock";
import { markOrderProcessed } from "@/lib/orders";

export interface CheckoutResponse {
  orderId: string;
  paymentToken: MockPaymentToken;
  isMockPayment: true;
}

export async function submitOrderAction(input: NewOrderInput): Promise<CheckoutResponse> {
  const order = await createOrder(input);

  const items = [
    ...order.items.map((item) => ({
      id: item.productId,
      price: item.unitPriceIdr + item.surchargeIdr,
      quantity: item.qty,
      name: item.name,
    })),
    {
      id: "shipping",
      price: order.shippingIdr,
      quantity: 1,
      name: "Shipping",
    },
  ];

  const paymentToken = await createMockPaymentToken({
    orderId: order.id,
    amount: order.totalIdr,
    customerEmail: order.customer.email,
    customerName: order.customer.name,
    items,
  });

  return {
    orderId: order.id,
    paymentToken,
    isMockPayment: true,
  };
}

export async function confirmMockPaymentAction(orderId: string) {
  // Mark order as processed for demo purposes
  await markOrderProcessed(orderId);
  return { success: true, orderId };
}
