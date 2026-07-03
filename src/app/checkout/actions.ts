"use server";

import { createOrder, type NewOrderInput } from "@/lib/orders";
import { createSnapToken, type MidtransPaymentParams } from "@/lib/midtrans";

export interface CheckoutResponse {
  orderId: string;
  snapToken: string;
}

export async function submitOrderAction(input: NewOrderInput): Promise<CheckoutResponse> {
  const order = await createOrder(input);

  const paymentParams: MidtransPaymentParams = {
    orderId: order.id,
    amount: order.totalIdr,
    customerEmail: order.customer.email,
    customerName: order.customer.name,
    customerPhone: "",
    items: [
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
    ],
  };

  const snapToken = await createSnapToken(paymentParams);

  return {
    orderId: order.id,
    snapToken,
  };
}
