"use server";

import { createOrder, type NewOrderInput, markOrderProcessed } from "@/lib/orders";
import { createPaymentTransaction, getQrisCode } from "@/lib/payment-real";

export interface CheckoutResponse {
  orderId: string;
  transactionId: string;
  paymentUrl?: string;
  qrisUrl?: string;
  qrisCode?: string;
  paymentMethod: 'card' | 'bank_transfer' | 'qris';
}

export async function submitOrderAction(
  input: NewOrderInput,
  paymentMethod: 'card' | 'bank_transfer' | 'qris' = 'qris'
): Promise<CheckoutResponse> {
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

  try {
    // Create payment transaction with real API
    const paymentResponse = await createPaymentTransaction(
      {
        orderId: order.id,
        amount: order.totalIdr,
        customerEmail: order.customer.email,
        customerName: order.customer.name,
        items,
      },
      paymentMethod
    );

    // Generate QRIS code if payment method is QRIS
    let qrisCode: string | undefined;
    if (paymentMethod === 'qris') {
      const code = await getQrisCode(order.id);
      if (code) qrisCode = code;
    }

    return {
      orderId: order.id,
      transactionId: paymentResponse.transactionId,
      paymentUrl: paymentResponse.paymentUrl,
      qrisUrl: paymentResponse.qrisUrl,
      qrisCode,
      paymentMethod,
    };
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
}

export async function confirmPaymentAction(orderId: string) {
  // Mark order as processed
  await markOrderProcessed(orderId);
  return { success: true, orderId };
}
