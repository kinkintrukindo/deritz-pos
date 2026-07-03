"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useCurrency } from "@/components/CurrencyProvider";
import { Price } from "@/components/Price";
import { submitOrderAction, type CheckoutResponse } from "@/app/checkout/actions";

const SHIPPING_ZONES = [
  { id: "id-domestic", label: "Indonesia (domestic)", flatRateIdr: 150000 },
  { id: "intl", label: "International", flatRateIdr: 750000 },
];

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks: { onSuccess: (result: unknown) => void; onError: (error: unknown) => void }) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { currency } = useCurrency();
  const [zoneId, setZoneId] = useState(SHIPPING_ZONES[0].id);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", country: "Indonesia" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    document.body.appendChild(script);
  }, []);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.unitPriceIdr + l.surchargeIdr) * l.qty,
    0
  );
  const shipping = SHIPPING_ZONES.find((z) => z.id === zoneId)?.flatRateIdr ?? 0;
  const total = subtotal + shipping;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">Your Bag is Empty</h1>
      </div>
    );
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response: CheckoutResponse = await submitOrderAction({
        customer: form,
        items: lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          image: l.image,
          unitPriceIdr: l.unitPriceIdr,
          surchargeIdr: l.surchargeIdr,
          sizeMode: l.sizeMode,
          sizePreset: l.sizePreset,
          measurements: l.measurements,
          qty: l.qty,
        })),
        currency,
        subtotalIdr: subtotal,
        shippingIdr: shipping,
        totalIdr: total,
      });

      if (window.snap) {
        window.snap.pay(response.snapToken, {
          onSuccess: () => {
            clear();
            router.push(`/order-confirmation/${response.orderId}`);
          },
          onError: () => {
            setSubmitting(false);
            alert("Payment failed. Please try again.");
          },
        });
      }
    } catch (error) {
      setSubmitting(false);
      alert("Error creating order. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-16 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14">
      <form onSubmit={handlePay} className="space-y-8">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-ink mb-5">Shipping Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} full />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} full type="email" />
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} full />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight text-ink mb-5">Shipping Estimate</h2>
          <div className="space-y-2">
            {SHIPPING_ZONES.map((zone) => (
              <label
                key={zone.id}
                className={`flex items-center justify-between border px-4 py-3 cursor-pointer text-sm ${
                  zoneId === zone.id ? "border-ink" : "border-mist"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="zone"
                    checked={zoneId === zone.id}
                    onChange={() => setZoneId(zone.id)}
                  />
                  {zone.label}
                </span>
                <Price amountIdr={zone.flatRateIdr} className="text-graphite" />
              </label>
            ))}
          </div>
          <p className="text-xs text-graphite mt-2">
            Flat-rate placeholder — production will call a live courier rate
            API for domestic shipments.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-4 hover:bg-gold transition-colors disabled:opacity-60"
        >
          {submitting ? "Processing…" : "Pay with Midtrans"}
        </button>
        <p className="text-xs text-graphite text-center">
          Powered by Midtrans. You'll be redirected to payment portal.
        </p>
      </form>

      <div className="border border-mist p-6 h-fit">
        <h2 className="text-xl font-medium tracking-tight text-ink mb-5">Order Summary</h2>
        <div className="space-y-3 text-sm">
          {lines.map((l) => (
            <div key={l.lineId} className="flex justify-between text-graphite">
              <span>{l.name}</span>
              <Price amountIdr={(l.unitPriceIdr + l.surchargeIdr) * l.qty} />
            </div>
          ))}
        </div>
        <div className="border-t border-mist mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-graphite">
            <span>Subtotal</span>
            <Price amountIdr={subtotal} />
          </div>
          <div className="flex justify-between text-graphite">
            <span>Shipping</span>
            <Price amountIdr={shipping} />
          </div>
          <div className="flex justify-between text-ink font-medium text-base pt-2">
            <span>Total</span>
            <Price amountIdr={total} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  full,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
  type?: string;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
      />
    </label>
  );
}
