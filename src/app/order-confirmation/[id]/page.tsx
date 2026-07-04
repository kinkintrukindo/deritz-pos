import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import type { OrderStatus } from "@/lib/types";

export const revalidate = 30;

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "received", label: "Received" },
  { key: "processed", label: "Processed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const activeIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 py-24 text-center">
      <p className="text-xs tracking-wide-label uppercase text-graphite mb-3">
        Order Confirmed
      </p>
      <h1 className="text-3xl font-medium tracking-tight text-ink mb-3">Thank you</h1>
      <p className="text-graphite mb-10">
        Order <span className="text-ink">{order.id}</span> has been received. A
        confirmation has been sent to your email.
      </p>

      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            <div className={`h-2.5 w-2.5 ${i <= activeIndex ? "bg-gold" : "bg-mist"}`} />
            <p className="text-[11px] tracking-wide-label uppercase text-graphite mt-3 text-center">
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {order.deliveryId && (
        <p className="text-sm text-ink mt-8">
          Tracking / delivery ID: <span className="font-medium">{order.deliveryId}</span>
        </p>
      )}

      <div className="text-left border border-mist mt-12 p-6">
        <p className="text-xs tracking-wide-label uppercase text-graphite mb-4">
          Order Summary
        </p>
        <div className="space-y-2 text-sm">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-graphite">
              <span>
                {item.name}
                {item.sizeMode === "preset"
                  ? ` — Size ${item.sizePreset}`
                  : ` — Custom Fit`}
              </span>
              <span>
                Rp{" "}
                {new Intl.NumberFormat("id-ID").format(
                  (item.unitPriceIdr + item.surchargeIdr) * item.qty
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-mist mt-4 pt-4 flex justify-between text-ink font-medium">
          <span>Total</span>
          <span>Rp {new Intl.NumberFormat("id-ID").format(order.totalIdr)}</span>
        </div>
      </div>

      <p className="text-xs text-graphite mt-12">
        Order tracking will be linked to your account once accounts are live.
        For now, save this order number for reference.
      </p>

      <div className="mt-12 pt-12 border-t border-mist">
        <p className="text-sm text-graphite mb-4">Have questions about your order?</p>
        <Link
          href={`/messages?order=${order.id}`}
          className="inline-block px-6 py-2 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite transition-colors"
        >
          Message Us
        </Link>
      </div>
    </div>
  );
}
