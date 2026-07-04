import Image from "next/image";
import { getAllOrders } from "@/lib/orders";
import {
  requireAdminSession,
  markProcessedAction,
  markShippedAction,
  markDeliveredAction,
  deleteOrderAction,
  markRefundedAction,
  logout,
} from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { OrderDeleteButton } from "@/components/OrderDeleteButton";
import { OrdersListClient } from "@/components/OrdersListClient";

const STATUS_LABEL: Record<string, string> = {
  received: "Received",
  processed: "Processed",
  shipped: "Shipped",
  delivered: "Delivered",
  refunded: "Refunded",
};

const STATUS_COLOR: Record<string, string> = {
  received: "bg-blue-100 text-blue-900 border-blue-300",
  processed: "bg-yellow-100 text-yellow-900 border-yellow-300",
  shipped: "bg-purple-100 text-purple-900 border-purple-300",
  delivered: "bg-green-100 text-green-900 border-green-300",
  refunded: "bg-red-100 text-red-900 border-red-300",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdminSession();
  const { error } = await searchParams;
  const orders = await getAllOrders();

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Orders</h1>
        </div>
        <form action={logout}>
          <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
            Log out
          </button>
        </form>
      </div>

      <AdminNav active="orders" />

      {error === "missing-delivery-id" && (
        <p className="text-xs text-red-600 mb-4">
          Enter a delivery / tracking ID before marking an order as shipped.
        </p>
      )}

      <OrdersListClient
        orders={orders}
        statusLabel={STATUS_LABEL}
        statusColor={STATUS_COLOR}
        markProcessedAction={markProcessedAction}
        markShippedAction={markShippedAction}
        markDeliveredAction={markDeliveredAction}
        markRefundedAction={markRefundedAction}
        deleteOrderAction={deleteOrderAction}
      />
    </div>
  );
}
