import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export interface MidtransPaymentParams {
  orderId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export async function createSnapToken(params: MidtransPaymentParams): Promise<string> {
  const transactionDetails = {
    order_id: params.orderId,
    gross_amount: params.amount,
  };

  const customerDetails = {
    first_name: params.customerName,
    email: params.customerEmail,
    phone: params.customerPhone || "",
  };

  const itemDetails = params.items.map((item) => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
    name: item.name,
  }));

  const parameter = {
    transaction_details: transactionDetails,
    customer_details: customerDetails,
    item_details: itemDetails,
  };

  try {
    const token = await snap.createTransactionToken(parameter);
    return token;
  } catch (error) {
    console.error("Midtrans error:", error);
    throw new Error("Failed to create payment token");
  }
}

export async function getTransactionStatus(orderId: string) {
  try {
    const status = await snap.transaction.status(orderId);
    return status;
  } catch (error) {
    console.error("Midtrans status error:", error);
    throw new Error("Failed to get transaction status");
  }
}
