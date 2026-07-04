"use client";

import { useState } from "react";
import type { OrderStatus } from "@/lib/types";

interface OrderStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  deliveryId?: string;
  statusLabel: Record<string, string>;
  statusColor: Record<string, string>;
  action: (id: string, formData: FormData) => Promise<void>;
}

const ALL_STATUSES: OrderStatus[] = ["received", "processed", "shipped", "delivered", "refunded"];

export function OrderStatusDropdown({
  orderId,
  currentStatus,
  deliveryId,
  statusLabel,
  statusColor,
  action,
}: OrderStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [tempDeliveryId, setTempDeliveryId] = useState(deliveryId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const needsDeliveryId = (status: OrderStatus) => status === "delivered" || status === "shipped";
  const showDeliveryInput = selectedStatus && needsDeliveryId(selectedStatus);

  const handleStatusSelect = (status: OrderStatus) => {
    if (status === currentStatus) {
      setIsOpen(false);
      return;
    }
    setSelectedStatus(status);
    if (!needsDeliveryId(status)) {
      handleSubmit(status, "");
    }
  };

  const handleSubmit = async (status: OrderStatus, dId: string) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("status", status);
      if (needsDeliveryId(status)) {
        formData.append("deliveryId", dId);
      }
      await action(orderId, formData);
      setIsOpen(false);
      setSelectedStatus(null);
      setTempDeliveryId("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-[10px] tracking-wide-label uppercase px-2.5 py-1 border rounded cursor-pointer hover:opacity-80 transition-opacity ${
          statusColor[currentStatus]
        }`}
      >
        {statusLabel[currentStatus]}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-mist shadow-lg z-50 min-w-max">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              disabled={status === currentStatus || isSubmitting}
              className={`block w-full text-left px-3 py-2 text-xs border-b border-mist last:border-b-0 ${
                status === currentStatus
                  ? "bg-paper text-graphite/50 cursor-not-allowed"
                  : "hover:bg-paper text-graphite hover:text-ink transition-colors"
              }`}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
      )}

      {showDeliveryInput && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className="bg-white border border-mist p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-medium text-ink mb-4">
              Delivery ID Required for {statusLabel[selectedStatus!]}
            </h3>
            <input
              type="text"
              value={tempDeliveryId}
              onChange={(e) => setTempDeliveryId(e.target.value)}
              placeholder="Enter courier tracking or delivery ID"
              className="w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedStatus(null);
                  setTempDeliveryId(deliveryId || "");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs text-graphite hover:text-ink border border-mist rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(selectedStatus!, tempDeliveryId)}
                disabled={!tempDeliveryId.trim() || isSubmitting}
                className="px-4 py-2 text-xs bg-ink text-white rounded hover:bg-graphite transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
