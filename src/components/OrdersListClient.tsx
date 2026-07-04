"use client";

import { useState } from "react";
import Image from "next/image";
import type { Order, OrderStatus } from "@/lib/types";
import { OrderDeleteButton } from "@/components/OrderDeleteButton";

interface OrdersListClientProps {
  orders: Order[];
  statusLabel: Record<string, string>;
  statusColor: Record<string, string>;
  markProcessedAction: (id: string, formData: FormData) => Promise<void>;
  markShippedAction: (id: string, formData: FormData) => Promise<void>;
  markDeliveredAction: (id: string, formData: FormData) => Promise<void>;
  markRefundedAction: (id: string, formData: FormData) => Promise<void>;
  deleteOrderAction: (id: string, formData: FormData) => Promise<void>;
}

const ALL_STATUSES: OrderStatus[] = ["received", "processed", "shipped", "delivered", "refunded"];

export function OrdersListClient({
  orders,
  statusLabel,
  statusColor,
  markProcessedAction,
  markShippedAction,
  markDeliveredAction,
  markRefundedAction,
  deleteOrderAction,
}: OrdersListClientProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<Set<OrderStatus>>(new Set(ALL_STATUSES));

  const toggleStatus = (status: OrderStatus) => {
    const newStatuses = new Set(selectedStatuses);
    if (newStatuses.has(status)) {
      newStatuses.delete(status);
    } else {
      newStatuses.add(status);
    }
    setSelectedStatuses(newStatuses);
  };

  const filteredOrders = orders.filter((order) => selectedStatuses.has(order.status));

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={`text-xs tracking-wide-label uppercase px-3 py-1.5 border rounded transition-colors ${
              selectedStatuses.has(status)
                ? `${statusColor[status]} border-current`
                : "bg-paper border-mist text-graphite/50 hover:text-graphite"
            }`}
          >
            {statusLabel[status]}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="border border-mist divide-y divide-mist">
        {filteredOrders.map((order) => (
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
                  {order.customer.email}
                  {order.customer.phone ? ` · ${order.customer.phone}` : ""} · {order.customer.address}, {order.customer.city},{" "}
                  {order.customer.country}
                </p>
                {order.deliveryId && (
                  <p className="text-xs text-graphite mt-0.5">Tracking: {order.deliveryId}</p>
                )}
              </div>
              <span
                className={`text-[10px] tracking-wide-label uppercase px-2.5 py-1 shrink-0 border rounded ${statusColor[order.status]}`}
              >
                {statusLabel[order.status]}
              </span>
            </div>

            <ul className="text-xs text-graphite mt-3 space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={80}
                      className="object-cover shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-medium text-graphite">{item.name}</p>
                    <p>
                      {item.sizeMode === "preset"
                        ? `Size ${item.sizePreset}`
                        : `Custom (Bust ${item.measurements.bust}, Waist ${item.measurements.waist}, Hip ${item.measurements.hip} ${item.measurements.unit})`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
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
              {order.status === "refunded" && (
                <span className="text-xs text-graphite">Refunded</span>
              )}

              {order.status !== "refunded" && (
                <form action={markRefundedAction.bind(null, order.id)}>
                  <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-red-600 underline">
                    Mark Refunded
                  </button>
                </form>
              )}

              <OrderDeleteButton
                orderId={order.id}
                action={deleteOrderAction.bind(null, order.id)}
              />
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="p-4 text-sm text-graphite">
            {orders.length === 0 ? "No orders yet." : "No orders matching the selected filters."}
          </p>
        )}
      </div>
    </div>
  );
}
