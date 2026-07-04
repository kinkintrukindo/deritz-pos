import type { Order, OrderCustomer, OrderItem } from "@/lib/types";
import { SUPABASE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/store";

async function readAll(): Promise<Order[]> {
  return readJson<Order[]>(SUPABASE_KEYS.ORDERS, []);
}

async function writeAll(orders: Order[]): Promise<void> {
  await writeJson(SUPABASE_KEYS.ORDERS, orders);
}

export async function getAllOrders(): Promise<Order[]> {
  const orders = await readAll();
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await readAll();
  return orders.find((o) => o.id === id);
}

function generateOrderId(existing: Order[]): string {
  let n = existing.length + 1;
  let id = `DR-${String(n).padStart(5, "0")}`;
  while (existing.some((o) => o.id === id)) {
    n += 1;
    id = `DR-${String(n).padStart(5, "0")}`;
  }
  return id;
}

export type NewOrderInput = {
  customer: OrderCustomer;
  items: OrderItem[];
  currency: string;
  subtotalIdr: number;
  shippingIdr: number;
  totalIdr: number;
};

export async function createOrder(input: NewOrderInput): Promise<Order> {
  const orders = await readAll();
  const id = generateOrderId(orders);
  const now = new Date().toISOString();

  const order: Order = {
    id,
    createdAt: now,
    status: "received",
    receivedAt: now,
    customer: input.customer,
    items: input.items,
    currency: input.currency,
    subtotalIdr: input.subtotalIdr,
    shippingIdr: input.shippingIdr,
    totalIdr: input.totalIdr,
  };

  orders.push(order);
  await writeAll(orders);
  return order;
}

export async function markOrderProcessed(id: string): Promise<void> {
  const orders = await readAll();
  const now = new Date().toISOString();
  await writeAll(
    orders.map((o) => (o.id === id ? { ...o, status: "processed" as const, processedAt: now } : o))
  );
}

export async function markOrderShipped(id: string, deliveryId: string): Promise<void> {
  const orders = await readAll();
  const now = new Date().toISOString();
  await writeAll(
    orders.map((o) =>
      o.id === id ? { ...o, status: "shipped" as const, shippedAt: now, deliveryId } : o
    )
  );
}

export async function markOrderDelivered(id: string): Promise<void> {
  const orders = await readAll();
  const now = new Date().toISOString();
  await writeAll(
    orders.map((o) => (o.id === id ? { ...o, status: "delivered" as const, deliveredAt: now } : o))
  );
}

export async function deleteOrder(id: string): Promise<void> {
  const orders = await readAll();
  await writeAll(orders.filter((o) => o.id !== id));
}

export async function markOrderRefunded(id: string): Promise<void> {
  const orders = await readAll();
  const now = new Date().toISOString();
  await writeAll(
    orders.map((o) => (o.id === id ? { ...o, status: "refunded" as const, refundedAt: now } : o))
  );
}
