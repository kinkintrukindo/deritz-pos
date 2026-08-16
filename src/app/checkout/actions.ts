"use server";

import { createOrder, type NewOrderInput, markOrderProcessed } from "@/lib/orders";
import { createPaymentTransaction } from "@/lib/payment-real";

export interface CheckoutResponse {
  orderId: string;
  transactionId: string;
  paymentUrl?: string;
  qrisUrl?: string;
  vaNumber?: string;
  vaBank?: string;
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

  if (order.transactionFeeIdr && order.transactionFeeIdr > 0) {
    items.push({
      id: "transaction_fee",
      price: order.transactionFeeIdr,
      quantity: 1,
      name: "Transaction Fee",
    });
  }

  try {
    // Create payment transaction with real Midtrans API
    const paymentResponse = await createPaymentTransaction(
      {
        orderId: order.id,
        amount: order.totalIdr,
        customerEmail: order.customer.email,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        items,
      },
      paymentMethod
    );

    return {
      orderId: order.id,
      transactionId: paymentResponse.transactionId,
      paymentUrl: paymentResponse.paymentUrl,
      qrisUrl: paymentResponse.qrisUrl,
      vaNumber: paymentResponse.vaNumber,
      vaBank: paymentResponse.vaBank,
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

export async function submitOrderBypassAction(input: NewOrderInput): Promise<{ orderId: string }> {
  const order = await createOrder(input);
  await markOrderProcessed(order.id);
  return { orderId: order.id };
}
