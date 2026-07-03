import { getAllOrders } from "@/lib/orders";
import {
  requireAdminSession,
  markProcessedAction,
  markShippedAction,
  markDeliveredAction,
  logout,
} from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";

const STATUS_LABEL: Record<string, string> = {
  received: "Received",
  processed: "Processed",
  shipped: "Shipped",
  delivered: "Delivered",
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

      <div className="border border-mist divide-y divide-mist">
        {orders.map((order) => (
          <div key={order.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-ink font-medium">
                  {order.id} · {order.customer.name}
                </p>
                <p className="text-xs text-graphite mt-0.5">
                  {new Date(order.createdAt).toLocaleString()} · Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(order.totalIdr)} · {order.items.length}{" "}
                  item{order.items.length === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-graphite mt-0.5">
                  {order.customer.email} · {order.customer.address}, {order.customer.city},{" "}
                  {order.customer.country}
                </p>
                {order.deliveryId && (
                  <p className="text-xs text-graphite mt-0.5">Tracking: {order.deliveryId}</p>
                )}
              </div>
              <span className="text-[10px] tracking-wide-label uppercase px-2.5 py-1 bg-surface text-ink shrink-0">
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <ul className="text-xs text-graphite mt-3 space-y-0.5">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} —{" "}
                  {item.sizeMode === "preset"
                    ? `Size ${item.sizePreset}`
                    : `Custom (Bust ${item.measurements.bust}, Waist ${item.measurements.waist}, Hip ${item.measurements.hip} ${item.measurements.unit})`}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center gap-3">
              {order.status === "received" && (
                <form action={markProcessedAction.bind(null, order.id)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
                    Mark Processed
                  </button>
                </form>
              )}
              {order.status === "processed" && (
                <form
                  action={markShippedAction.bind(null, order.id)}
                  className="flex items-center gap-2"
                >
                  <input
                    name="deliveryId"
                    placeholder="Courier tracking / delivery ID"
                    required
                    className="border border-mist px-2 py-1.5 text-xs bg-paper focus:outline-none focus:border-ink"
                  />
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
                    Mark Shipped
                  </button>
                </form>
              )}
              {order.status === "shipped" && (
                <form action={markDeliveredAction.bind(null, order.id)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
                    Mark Delivered
                  </button>
                </form>
              )}
              {order.status === "delivered" && (
                <span className="text-xs text-graphite">Completed</span>
              )}
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="p-4 text-sm text-graphite">No orders yet.</p>}
      </div>
    </div>
  );
}
