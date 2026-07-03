"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useCurrency } from "@/components/CurrencyProvider";
import { useAuth } from "@/components/AuthProvider";
import { Price } from "@/components/Price";
import { submitOrderAction, confirmMockPaymentAction, type CheckoutResponse } from "@/app/checkout/actions";
import { estimateShipping, type ShippingRate } from "@/lib/shipping";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { currency } = useCurrency();
  const { user, loading: authLoading } = useAuth();

  const [shippingType, setShippingType] = useState<'domestic' | 'international'>('domestic');
  const [destination, setDestination] = useState('');
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>('');
  const [loadingRates, setLoadingRates] = useState(false);
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: 'Indonesia'
  });
  const [submitting, setSubmitting] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<CheckoutResponse | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    if (user?.email && !form.email) {
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        name: user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.unitPriceIdr + l.surchargeIdr) * l.qty,
    0
  );

  const selectedRate = shippingRates.find(r => r.id === selectedRateId);
  const shipping = selectedRate?.cost || 0;
  const total = subtotal + shipping;

  async function handleEstimateShipping() {
    if (!destination.trim()) {
      alert('Please enter a destination');
      return;
    }

    setLoadingRates(true);
    try {
      const rates = await estimateShipping({
        origin: 'surabaya',
        destination,
        weight: 2000,
        type: shippingType,
      });
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedRateId(rates[0].id);
      }
    } catch (error) {
      alert('Failed to estimate shipping. Please try again.');
      console.error(error);
    } finally {
      setLoadingRates(false);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <p className="text-graphite">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">Sign in to Checkout</h1>
        <p className="text-graphite mb-6">Please sign in or create an account to proceed</p>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="inline-block bg-ink text-white text-xs tracking-wide-label uppercase py-3 px-6 hover:bg-gold transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="inline-block border border-ink text-ink text-xs tracking-wide-label uppercase py-3 px-6 hover:bg-ink hover:text-white transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">Your Bag is Empty</h1>
      </div>
    );
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRate) {
      alert('Please select a shipping option');
      return;
    }

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

      setPaymentResponse(response);
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      alert("Error creating order. Please try again.");
      console.error(error);
    }
  }

  async function handleConfirmPayment() {
    if (!paymentResponse) return;
    setConfirmingPayment(true);

    try {
      await confirmMockPaymentAction(paymentResponse.orderId);
      clear();
      router.push(`/order-confirmation/${paymentResponse.orderId}`);
    } catch (error) {
      setConfirmingPayment(false);
      alert("Error confirming payment. Please try again.");
      console.error(error);
    }
  }

  if (paymentResponse) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
        <div className="border border-mist p-8 space-y-6">
          <div>
            <p className="text-xs tracking-wide-label uppercase text-gold mb-2">Demo Mode</p>
            <h1 className="text-3xl font-medium tracking-tight text-ink">Payment Summary</h1>
          </div>

          <div className="border-t border-mist pt-6">
            <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Order Details</h2>
            <div className="space-y-3 text-sm mb-6">
              {paymentResponse.paymentToken.items.map((item) => (
                <div key={item.id} className="flex justify-between text-graphite">
                  <span>{item.name} {item.quantity > 1 && `(x${item.quantity})`}</span>
                  <Price amountIdr={item.price * item.quantity} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-paper border border-mist p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-ink">Total Amount</span>
              <Price amountIdr={paymentResponse.paymentToken.amount} className="text-2xl font-medium" />
            </div>
          </div>

          <div className="border-t border-mist pt-6">
            <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Customer Information</h2>
            <div className="space-y-2 text-sm text-graphite">
              <p><strong>Name:</strong> {paymentResponse.paymentToken.customer.name}</p>
              <p><strong>Email:</strong> {paymentResponse.paymentToken.customer.email}</p>
              <p><strong>Order ID:</strong> {paymentResponse.orderId}</p>
            </div>
          </div>

          <div className="border-t border-mist pt-6">
            <p className="text-xs text-graphite mb-4">
              This is a demo payment. In production, this would redirect to Midtrans payment gateway. Click "Confirm Payment" to proceed with the order.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentResponse(null)}
                className="flex-1 border border-ink text-ink text-xs tracking-wide-label uppercase py-3 hover:bg-ink hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={confirmingPayment}
                className="flex-1 bg-ink text-white text-xs tracking-wide-label uppercase py-3 hover:bg-gold transition-colors disabled:opacity-60"
              >
                {confirmingPayment ? "Processing…" : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

          <div className="space-y-4 mb-4">
            <div>
              <label className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  checked={shippingType === 'domestic'}
                  onChange={() => {
                    setShippingType('domestic');
                    setShippingRates([]);
                    setSelectedRateId('');
                  }}
                />
                <span className="text-sm text-ink">Indonesia (Domestic)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={shippingType === 'international'}
                  onChange={() => {
                    setShippingType('international');
                    setShippingRates([]);
                    setSelectedRateId('');
                  }}
                />
                <span className="text-sm text-ink">International</span>
              </label>
            </div>

            <div>
              <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1.5">
                Destination {shippingType === 'domestic' ? '(City Name)' : '(Country Name)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={shippingType === 'domestic' ? 'Jakarta, Surabaya, Bandung...' : 'Singapore, Australia, USA...'}
                  className="flex-1 border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
                />
                <button
                  type="button"
                  onClick={handleEstimateShipping}
                  disabled={loadingRates || !destination.trim()}
                  className="bg-ink text-white text-xs tracking-wide-label uppercase px-4 py-2.5 hover:bg-gold transition-colors disabled:opacity-60"
                >
                  {loadingRates ? 'Loading...' : 'Estimate'}
                </button>
              </div>
            </div>
          </div>

          {shippingRates.length > 0 && (
            <div className="space-y-2">
              {shippingRates.map((rate) => (
                <label
                  key={rate.id}
                  className={`flex items-start gap-3 border px-4 py-3 cursor-pointer text-sm ${
                    selectedRateId === rate.id ? 'border-ink' : 'border-mist'
                  }`}
                >
                  <input
                    type="radio"
                    checked={selectedRateId === rate.id}
                    onChange={() => setSelectedRateId(rate.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-ink">{rate.courier} - {rate.service}</div>
                    <div className="text-xs text-graphite">{rate.description}</div>
                    <div className="text-xs text-graphite">{rate.etaText}</div>
                  </div>
                  <Price amountIdr={rate.cost} className="font-medium text-ink flex-shrink-0" />
                </label>
              ))}
            </div>
          )}

          {shippingRates.length === 0 && destination && !loadingRates && (
            <p className="text-xs text-graphite">Enter destination and click "Estimate" to see shipping options</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedRate}
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-4 hover:bg-gold transition-colors disabled:opacity-60"
        >
          {submitting ? "Processing…" : "Review Payment"}
        </button>
        <p className="text-xs text-graphite text-center">
          Demo mode: Review your order details and confirm payment.
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
