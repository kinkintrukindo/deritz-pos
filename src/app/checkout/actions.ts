"use server";

import { createOrder, type NewOrderInput } from "@/lib/orders";

export async function submitOrderAction(input: NewOrderInput): Promise<string> {
  const order = await createOrder(input);
  return order.id;
}
