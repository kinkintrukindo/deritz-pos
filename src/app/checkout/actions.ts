"use server";

import { createOrder, type NewOrderInput, markOrderProcessed } from "@/lib/orders";
import { createPaymentTransaction, verifyPaymentStatus } from "@/lib/payment-real";

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
  // SECURITY: never mark an order as paid just because this button was
  // clicked. Always verify the real payment status with Midtrans first —
  // otherwise anyone could reach this screen and get a free order by
  // clicking through without ever paying.
  const { status } = await verifyPaymentStatus(orderId);

  if (status !== 'success') {
    return {
      success: false,
      orderId,
      status,
      message:
        status === 'pending'
          ? 'Payment has not been received yet. If you already paid, this may take a moment to confirm — please check back shortly.'
          : 'Payment could not be verified as successful.',
    };
  }

  await markOrderProcessed(orderId);
  return { success: true, orderId, status };
}

export async function submitOrderBypassAction(input: NewOrderInput): Promise<{ orderId: string }> {
  const order = await createOrder(input);
  await markOrderProcessed(order.id);
  return { orderId: order.id };
}
