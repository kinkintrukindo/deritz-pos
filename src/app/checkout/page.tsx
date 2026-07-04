"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useCurrency } from "@/components/CurrencyProvider";
import { useAuth } from "@/components/AuthProvider";
import { Price } from "@/components/Price";
import { submitOrderAction, confirmPaymentAction, submitOrderBypassAction, type CheckoutResponse } from "@/app/checkout/actions";
import { estimateShipping, type ShippingRate } from "@/lib/shipping-real";
import { COUNTRY_CODES } from "@/lib/countries";
import { isValidEmail, isValidPhone, isValidName, isValidAddress, isValidCity, isValidCountry } from "@/lib/validation";

interface LocationOption {
  code?: string;
  name: string;
}

interface DestinationResult {
  id?: string | number;
  label?: string;
  subdistrict_name?: string;
  district_name?: string;
  city_name?: string;
  province_name?: string;
  zip_code?: string;
  [key: string]: unknown;
}

function formatDestinationLabel(item: DestinationResult): string {
  if (item.label) return item.label;
  const parts = [item.subdistrict_name, item.district_name, item.city_name, item.province_name].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');
  return JSON.stringify(item);
}

function getDestinationId(item: DestinationResult): string {
  const id = item.id ?? (item as Record<string, unknown>).subdistrict_id ?? (item as Record<string, unknown>).district_id;
  return id !== undefined && id !== null ? String(id) : '';
}

function getDestinationZip(item: DestinationResult): string {
  const zip = item.zip_code ?? (item as Record<string, unknown>).postal_code ?? (item as Record<string, unknown>).zipcode;
  return zip ? String(zip) : '';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const { currency } = useCurrency();
  const { user, loading: authLoading } = useAuth();

  const [shippingType, setShippingType] = useState<'domestic' | 'international'>('domestic');
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>('');
  const [loadingRates, setLoadingRates] = useState(false);

  // Location dropdowns
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Live destination search (RajaOngkir domestic-destination)
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationResults, setDestinationResults] = useState<DestinationResult[]>([]);
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [searchingDestination, setSearchingDestination] = useState(false);
  const [destinationId, setDestinationId] = useState<string>('');

  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    country: 'ID',
    state: '',
    city: '',
    postalCode: ''
  });

  const [phoneCountryCode, setPhoneCountryCode] = useState('+62');
  const [specialCode, setSpecialCode] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateCheckoutForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!form.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!form.city.trim()) {
      errors.city = 'City is required';
    }
    if (!form.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }
    if (shippingType === 'international' && !form.country) {
      errors.country = 'Country is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Define API loading functions first (before useEffect)
  const loadCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch('/api/shipping/locations?type=countries');
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Failed to load countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadStates = async (countryCode: string) => {
    if (!countryCode) return;
    setLoadingStates(true);
    try {
      const response = await fetch(`/api/shipping/locations?type=states&countryCode=${countryCode}`);
      if (response.ok) {
        const data = await response.json();
        setStates(data);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    if (!countryCode) return;
    setLoadingCities(true);
    try {
      let url = `/api/shipping/locations?type=cities&countryCode=${countryCode}`;
      if (stateCode) {
        url += `&stateCode=${stateCode}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error('Failed to load cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (form.country && shippingType === 'international') {
      loadStates(form.country);
      setCities([]);
      setForm(prev => ({ ...prev, state: '', city: '' }));
    } else if (shippingType === 'domestic') {
      setStates([]);
      setCities([]);
      setForm(prev => ({ ...prev, state: '', city: '' }));
    }
  }, [form.country, shippingType]);

  // Load cities when state changes
  useEffect(() => {
    if (form.country && form.state && shippingType === 'international') {
      loadCities(form.country, form.state);
      setForm(prev => ({ ...prev, city: '' }));
    }
  }, [form.state, shippingType]);

  // Live destination search (debounced) for the domestic city field
  useEffect(() => {
    if (shippingType !== 'domestic' || destinationQuery.trim().length < 3) {
      setDestinationResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchingDestination(true);
      try {
        const response = await fetch(`/api/shipping/search-destination?search=${encodeURIComponent(destinationQuery.trim())}`);
        const data = await response.json();
        setDestinationResults(data.results ?? []);
      } catch (error) {
        console.error('Destination search failed:', error);
        setDestinationResults([]);
      } finally {
        setSearchingDestination(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [destinationQuery, shippingType]);

  const handleSelectDestination = (item: DestinationResult) => {
    const label = formatDestinationLabel(item);
    const zip = getDestinationZip(item);
    setDestinationQuery(label);
    setForm((prev) => ({ ...prev, city: label, ...(zip ? { postalCode: zip } : {}) }));
    setDestinationId(getDestinationId(item));
    setDestinationDropdownOpen(false);
    setDestinationResults([]);
  };

  // Auto-calculate shipping when postal code changes
  useEffect(() => {
    if (form.postalCode.trim().length >= 4) {
      handleEstimateShipping(form.postalCode);
    } else {
      setShippingRates([]);
      setSelectedRateId('');
    }
  }, [form.postalCode, shippingType]);

  const [submitting, setSubmitting] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<CheckoutResponse | null>(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'card' | 'bank_transfer'>('qris');

  useEffect(() => {
    if (user?.email) {
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        name: user.user_metadata?.full_name || prev.name
      }));
    }
  }, [user]);

  const subtotal = lines.reduce((sum, l) => {
    const basePrice = l.discountPercent
      ? Math.round(l.unitPriceIdr * (1 - l.discountPercent / 100))
      : l.unitPriceIdr;
    return sum + (basePrice + l.surchargeIdr) * l.qty;
  }, 0);

  const selectedRate = shippingRates.find(r => r.id === selectedRateId);
  const shipping = selectedRate?.cost || 0;
  const total = subtotal + shipping;

  const handleEstimateShipping = async (postalCode?: string) => {
    const destPostal = postalCode || form.postalCode;

    if (!destPostal.trim()) {
      return;
    }

    setLoadingRates(true);
    try {
      // Calculate total weight from cart items
      let totalWeightKg = 0;
      for (const line of lines) {
        try {
          const response = await fetch(`/api/products/${line.productId}`);
          if (response.ok) {
            const product = await response.json();
            totalWeightKg += (product.weightKg || 5) * line.qty;
          }
        } catch (error) {
          console.warn(`Failed to fetch weight for product ${line.productId}`, error);
          totalWeightKg += 5 * line.qty; // Fallback to 5kg default
        }
      }

      const weightInGrams = Math.round(totalWeightKg * 1000);
      console.log('Shipping estimate:', {
        postal: destPostal,
        weight: `${totalWeightKg}kg (${weightInGrams}g)`,
        type: shippingType,
        items: lines.length,
      });

      const rates = await estimateShipping({
        destinationPostalCode: destPostal,
        weight: weightInGrams, // Convert kg to grams
        type: shippingType,
      });
      console.log('Shipping rates received:', rates);
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedRateId(rates[0].id);
      }
    } catch (error) {
      console.error('Shipping estimation failed:', error);
    } finally {
      setLoadingRates(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
        <p className="text-graphite">Loading...</p>
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

    // Validate all required fields
    if (!validateCheckoutForm()) {
      return;
    }

    // Check for special code
    if (specialCode === 'LILYYANG') {
      // Bypass payment gateway entirely and create a pre-confirmed order
      setSubmitting(true);
      try {
        // Combine country code + phone
        const fullPhone = phoneCountryCode + form.phone;
        const { orderId } = await submitOrderBypassAction({
          customer: { ...form, phone: fullPhone },
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            image: l.image,
            unitPriceIdr: l.discountPercent
              ? Math.round(l.unitPriceIdr * (1 - l.discountPercent / 100))
              : l.unitPriceIdr,
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

        clear();
        router.push(`/order-confirmation/${orderId}`);
      } catch (error) {
        setSubmitting(false);
        alert("Error creating order with special code. Please try again.");
        console.error(error);
      }
      return;
    }

    if (!selectedRate) {
      alert('Please select a shipping option');
      return;
    }

    setSubmitting(true);

    try {
      // Combine country code + phone
      const fullPhone = phoneCountryCode + form.phone;
      const response: CheckoutResponse = await submitOrderAction(
        {
          customer: { ...form, phone: fullPhone },
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            image: l.image,
            unitPriceIdr: l.discountPercent
              ? Math.round(l.unitPriceIdr * (1 - l.discountPercent / 100))
              : l.unitPriceIdr,
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
        },
        paymentMethod
      );

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
      await confirmPaymentAction(paymentResponse.orderId);
      clear();
      router.push(`/order-confirmation/${paymentResponse.orderId}`);
    } catch (error) {
      setConfirmingPayment(false);
      alert("Error confirming payment. Please try again.");
      console.error(error);
    }
  }

  if (paymentResponse) {
    const isQris = paymentResponse.paymentMethod === 'qris';
    const isCard = paymentResponse.paymentMethod === 'card';

    return (
      <div className="mx-auto max-w-3xl px-6 lg:px-10 py-16">
        <div className="border border-mist p-8 space-y-6">
          <div>
            <p className="text-xs tracking-wide-label uppercase text-gold mb-2">
              {paymentResponse.paymentMethod.toUpperCase()} Payment
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-ink">Payment Summary</h1>
          </div>

          <div className="bg-paper border border-mist p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-ink">Total Amount</span>
              <Price amountIdr={total} className="text-2xl font-medium text-gold" />
            </div>
          </div>

          {isQris && paymentResponse.qrisCode && (
            <div className="border-t border-mist pt-6 text-center">
              <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Scan to Pay</h2>
              <div className="bg-white p-6 border border-mist rounded inline-block">
                <div className="text-sm text-graphite mb-2">QRIS Code</div>
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-graphite">QR Code Image</span>
                </div>
              </div>
              <p className="text-xs text-graphite mt-4">
                Scan with your mobile banking or e-wallet app (GCash, Gcash, Dana, OVO, etc.)
              </p>
            </div>
          )}

          {isCard && paymentResponse.paymentUrl && (
            <div className="border-t border-mist pt-6">
              <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Card Payment</h2>
              <p className="text-sm text-graphite mb-4">
                You will be redirected to the secure payment gateway to enter your card details.
              </p>
              <a
                href={paymentResponse.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-gold text-white text-xs tracking-wide-label uppercase py-3 hover:bg-ink transition-colors"
              >
                Go to Payment Gateway
              </a>
            </div>
          )}

          {paymentResponse.paymentMethod === 'bank_transfer' && (
            <div className="border-t border-mist pt-6">
              <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Bank Transfer Details</h2>
              <div className="bg-surface p-4 space-y-3 text-sm">
                <div>
                  <p className="text-graphite">Bank Name</p>
                  <p className="font-medium text-ink">Bank BCA</p>
                </div>
                <div>
                  <p className="text-graphite">Account Number</p>
                  <p className="font-medium text-ink font-mono">1234567890</p>
                </div>
                <div>
                  <p className="text-graphite">Account Name</p>
                  <p className="font-medium text-ink">PT DE RITZ</p>
                </div>
                <div>
                  <p className="text-graphite">Amount to Transfer</p>
                  <p className="font-medium text-ink"><Price amountIdr={total} /></p>
                </div>
              </div>
              <p className="text-xs text-graphite mt-4">
                Please include your Order ID ({paymentResponse.orderId}) in the transfer reference/note.
              </p>
            </div>
          )}

          <div className="border-t border-mist pt-6">
            <h2 className="text-xl font-medium tracking-tight text-ink mb-4">Order Details</h2>
            <div className="space-y-2 text-sm text-graphite">
              <p><strong>Order ID:</strong> {paymentResponse.orderId}</p>
              <p><strong>Transaction ID:</strong> {paymentResponse.transactionId}</p>
              <p><strong>Payment Method:</strong> {paymentResponse.paymentMethod.toUpperCase().replace('_', ' ')}</p>
            </div>
          </div>

          <div className="border-t border-mist pt-6">
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
                {confirmingPayment ? "Processing…" : "Confirm & Continue"}
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
            <Field
              label="Full name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              full
              error={validationErrors.name}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              full
              type="email"
              error={validationErrors.email}
            />

            {/* Phone field with country code dropdown */}
            <div className="col-span-2">
              <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  className="border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink min-w-fit"
                >
                  {Object.entries(COUNTRY_CODES).map(([code, country]) => (
                    <option key={code} value={code}>
                      {country} {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className={`flex-1 border px-3 py-2.5 text-sm bg-paper focus:outline-none ${
                    validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-mist focus:border-ink'
                  }`}
                />
              </div>
              {validationErrors.phone && <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>}
            </div>

            <Field
              label="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
              full
              error={validationErrors.address}
            />

            {shippingType === 'domestic' ? (
              <div className="col-span-2 relative">
                <label className="block">
                  <span className="text-xs tracking-wide-label uppercase text-graphite">City / District</span>
                  <input
                    required
                    type="text"
                    value={destinationQuery}
                    onChange={(e) => {
                      setDestinationQuery(e.target.value);
                      setDestinationDropdownOpen(true);
                      setDestinationId('');
                      setForm((prev) => ({ ...prev, city: '' }));
                    }}
                    onFocus={() => setDestinationDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDestinationDropdownOpen(false), 150)}
                    placeholder="Search by district or subdistrict (e.g. Gubeng, Wonokromo)"
                    className={`mt-1.5 w-full border px-3 py-2.5 text-sm bg-paper focus:outline-none ${
                      validationErrors.city ? 'border-red-500 focus:border-red-500' : 'border-mist focus:border-ink'
                    }`}
                  />
                  {validationErrors.city && <p className="text-xs text-red-500 mt-1">{validationErrors.city}</p>}
                </label>

                {destinationDropdownOpen && destinationQuery.trim().length >= 3 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-mist shadow-lg max-h-64 overflow-y-auto">
                    {searchingDestination && (
                      <p className="px-3 py-2.5 text-sm text-graphite">Searching…</p>
                    )}
                    {!searchingDestination && destinationResults.length === 0 && (
                      <p className="px-3 py-2.5 text-sm text-graphite">No matches found.</p>
                    )}
                    {!searchingDestination &&
                      destinationResults.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectDestination(item)}
                          className="block w-full text-left px-3 py-2.5 text-sm text-ink hover:bg-paper border-b border-mist last:border-b-0"
                        >
                          {formatDestinationLabel(item)}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <DropdownField
                  label="Country"
                  value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })}
                  options={countries}
                  loading={loadingCountries}
                  error={validationErrors.country}
                />
                {needsStateDropdown(form.country) && (
                  <DropdownField
                    label="State/Region"
                    value={form.state}
                    onChange={(v) => setForm({ ...form, state: v })}
                    options={states}
                    loading={loadingStates}
                  />
                )}
                <DropdownField
                  label="City"
                  value={form.city}
                  onChange={(v) => setForm({ ...form, city: v })}
                  options={cities}
                  loading={loadingCities}
                  error={validationErrors.city}
                />
              </>
            )}

            <Field
              label="Postal Code"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
              error={validationErrors.postalCode}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight text-ink mb-5">Shipping Type</h2>

          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3">
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

          {loadingRates && (
            <p className="text-sm text-graphite mb-4">Calculating shipping options...</p>
          )}

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
        </div>

        <div>
          <h2 className="text-2xl font-medium tracking-tight text-ink mb-5">Payment Method</h2>
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-3 p-3 border border-mist cursor-pointer hover:bg-surface">
              <input
                type="radio"
                checked={paymentMethod === 'qris'}
                onChange={() => setPaymentMethod('qris')}
              />
              <div>
                <div className="font-medium text-sm text-ink">QRIS</div>
                <div className="text-xs text-graphite">Quick Response Code Indonesian Standard</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-mist cursor-pointer hover:bg-surface">
              <input
                type="radio"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
              />
              <div>
                <div className="font-medium text-sm text-ink">Bank Transfer</div>
                <div className="text-xs text-graphite">Direct bank transfer to De Ritz account</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border border-mist cursor-pointer hover:bg-surface">
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <div>
                <div className="font-medium text-sm text-ink">Credit/Debit Card</div>
                <div className="text-xs text-graphite">Visa, Mastercard, and other cards</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block">
            <span className="text-xs tracking-wide-label uppercase text-graphite">Special Code (Optional)</span>
            <input
              type="text"
              value={specialCode}
              onChange={(e) => setSpecialCode(e.target.value)}
              placeholder="Enter special code if you have one"
              className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || (!specialCode && !selectedRate)}
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-4 hover:bg-gold transition-colors disabled:opacity-60"
        >
          {submitting ? "Processing…" : specialCode ? "Complete Order with Special Code" : "Review Payment"}
        </button>
        <p className="text-xs text-graphite text-center">
          Secure payment processing with {paymentMethod === 'qris' ? 'QRIS' : paymentMethod === 'bank_transfer' ? 'bank transfer' : 'card'}.
        </p>
      </form>

      <div className="border border-mist p-6 h-fit">
        <h2 className="text-xl font-medium tracking-tight text-ink mb-5">Order Summary</h2>
        <div className="space-y-3 text-sm">
          {lines.map((l) => {
            const basePrice = l.discountPercent
              ? Math.round(l.unitPriceIdr * (1 - l.discountPercent / 100))
              : l.unitPriceIdr;
            return (
              <div key={l.lineId} className="flex justify-between text-graphite">
                <span>{l.name}</span>
                <Price amountIdr={(basePrice + l.surchargeIdr) * l.qty} />
              </div>
            );
          })}
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

function needsStateDropdown(countryCode: string): boolean {
  // Countries that have state/region subdivisions
  const stateCountries = ['US', 'IN', 'AU', 'BR', 'CA', 'MX', 'DE', 'GB', 'FR', 'RU'];
  return stateCountries.includes(countryCode);
}

function Field({
  label,
  value,
  onChange,
  full,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
  type?: string;
  error?: string;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : ""}`}>
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full border px-3 py-2.5 text-sm bg-paper focus:outline-none ${
          error ? 'border-red-500 focus:border-red-500' : 'border-mist focus:border-ink'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}

function DropdownField({
  label,
  value,
  onChange,
  options,
  loading,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: LocationOption[];
  loading?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || options.length === 0}
        className={`mt-1.5 w-full border px-3 py-2.5 text-sm bg-paper focus:outline-none disabled:opacity-60 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-mist focus:border-ink'
        }`}
      >
        <option value="">{loading ? 'Loading...' : `Select ${label.toLowerCase()}`}</option>
        {options.map((option) => (
          <option key={option.code || option.name} value={option.code || option.name}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}
