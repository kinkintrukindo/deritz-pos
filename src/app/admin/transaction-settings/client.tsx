"use client";

import { useState } from "react";
import { updateTransactionSettingsAction } from "@/app/admin/actions";
import type { TransactionSettings, FeeConfig } from "@/lib/types-settings";
import { COUNTRY_CODES } from "@/lib/countries";

interface Props {
  initialSettings: TransactionSettings;
}

export function TransactionSettingsClient({ initialSettings }: Props) {
  const [settings, setSettings] = useState<TransactionSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<"shipping" | "fees">("shipping");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set("settings", JSON.stringify(settings));
      const result = await updateTransactionSettingsAction(formData);

      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateDomesticFee = (fee: FeeConfig) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        domestic: fee,
      },
    });
  };

  const updateInternationalDefault = (fee: FeeConfig) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        international: {
          ...settings.shipping.international,
          default: fee,
        },
      },
    });
  };

  const updateTransactionFee = (fee: FeeConfig) => {
    setSettings({
      ...settings,
      transactionFee: {
        ...settings.transactionFee,
        fee,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-mist">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 text-xs tracking-wide-label uppercase border-b-2 -mb-px transition-colors ${
              activeTab === "shipping"
                ? "border-ink text-ink"
                : "border-transparent text-graphite hover:text-ink"
            }`}
          >
            Shipping Configuration
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`pb-3 text-xs tracking-wide-label uppercase border-b-2 -mb-px transition-colors ${
              activeTab === "fees"
                ? "border-ink text-ink"
                : "border-transparent text-graphite hover:text-ink"
            }`}
          >
            Transaction Fee
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "shipping" && (
        <ShippingSettings settings={settings.shipping} onUpdate={(shipping) => setSettings({ ...settings, shipping })} />
      )}

      {activeTab === "fees" && (
        <TransactionFeeSettings
          config={settings.transactionFee}
          onUpdate={(transactionFee) => setSettings({ ...settings, transactionFee })}
        />
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-6 border-t border-mist">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-ink text-white text-xs tracking-wide-label uppercase px-6 py-3 hover:bg-gold disabled:opacity-60 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && <p className="text-xs text-green-600">✓ Saved successfully</p>}
      </div>

      <p className="text-xs text-graphite">
        Last updated: {new Date(settings.lastUpdated).toLocaleString()} by {settings.updatedBy}
      </p>
    </div>
  );
}

function AddCountryExceptionButton({
  exceptions,
  onAdd,
}: {
  exceptions: Array<{ countryId: string; countryName: string }>;
  onAdd: (country: { id: string; name: string }) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const usedCountries = new Set(exceptions.map(e => e.countryId));
  const availableCountries = Object.entries(COUNTRY_CODES)
    .filter(([code]) => !usedCountries.has(code))
    .map(([code, name]) => ({ id: code, name }));

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-xs tracking-wide-label uppercase px-3 py-2 border border-mist hover:bg-surface transition-colors"
      >
        + Add Country
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-mist shadow-lg z-50 max-h-96 overflow-y-auto">
          {availableCountries.length === 0 ? (
            <div className="p-3 text-xs text-graphite">All countries already added</div>
          ) : (
            availableCountries.map(country => (
              <button
                key={country.id}
                onClick={() => {
                  onAdd(country);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-surface border-b border-mist last:border-b-0 transition-colors"
              >
                {country.name} ({country.id})
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ShippingSettings({
  settings,
  onUpdate,
}: {
  settings: TransactionSettings["shipping"];
  onUpdate: (settings: TransactionSettings["shipping"]) => void;
}) {
  return (
    <div className="space-y-8">
      {/* RajaOngkir Auto Recalculation Toggle */}
      <div className="p-6 border border-mist space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-ink mb-1">Auto Recalculate RajaOngkir</h3>
            <p className="text-xs text-graphite">If enabled, shipping costs calculated via RajaOngkir API. If disabled, use manual settings below.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => onUpdate({ ...settings, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-graphite">{settings.enabled ? "Enabled" : "Disabled"}</span>
          </label>
        </div>
      </div>

      {!settings.enabled && (
        <>
          {/* Domestic Shipping */}
          <div className="p-6 border border-mist space-y-4">
            <h3 className="font-medium text-ink">Domestic Shipping</h3>
            <FeeConfigEditor
              config={settings.domestic}
              onChange={(fee) => onUpdate({ ...settings, domestic: fee })}
              label="Domestic Shipping Fee"
              description="Applied to all domestic shipments"
            />
          </div>

          {/* International Shipping */}
          <div className="p-6 border border-mist space-y-4">
            <h3 className="font-medium text-ink">International Shipping</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-ink">Default (all countries)</label>
              <p className="text-xs text-graphite">For fixed fees, specify currency (USD, SGD, etc). For percentage, applies to subtotal.</p>
              <FeeConfigEditor
                config={settings.international.default}
                onChange={(fee) => {
                  // Keep currency for fixed fees, remove for percentage
                  const updated = fee.type === 'fixed'
                    ? { ...fee, currency: fee.currency || 'USD' }
                    : { ...fee, currency: undefined };
                  onUpdate({
                    ...settings,
                    international: { ...settings.international, default: updated },
                  });
                }}
                label="Default International Shipping Fee"
                isInternational
              />
            </div>

            {/* Exceptions */}
            <div className="mt-6 pt-6 border-t border-mist space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-ink">Country Exceptions</label>
                <AddCountryExceptionButton
                  exceptions={settings.international.exceptions}
                  onAdd={(country) => {
                    const newException = {
                      countryId: country.id,
                      countryName: country.name,
                      fee: { type: "fixed" as const, value: 0 },
                    };
                    onUpdate({
                      ...settings,
                      international: {
                        ...settings.international,
                        exceptions: [...settings.international.exceptions, newException],
                      },
                    });
                  }}
                />
              </div>

              {settings.international.exceptions.length > 0 && (
                <div className="space-y-3">
                  {settings.international.exceptions.map((exc, idx) => (
                    <div key={idx} className="p-3 bg-surface border border-mist rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ink font-medium">{exc.countryName}</span>
                        <button
                          onClick={() => {
                            const updated = settings.international.exceptions.filter((_, i) => i !== idx);
                            onUpdate({
                              ...settings,
                              international: { ...settings.international, exceptions: updated },
                            });
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <FeeConfigEditor
                        config={exc.fee}
                        onChange={(fee) => {
                          const updated = [...settings.international.exceptions];
                          updated[idx].fee = fee;
                          onUpdate({
                            ...settings,
                            international: { ...settings.international, exceptions: updated },
                          });
                        }}
                        compact
                      />
                    </div>
                  ))}
                </div>
              )}
              {settings.international.exceptions.length === 0 && (
                <p className="text-xs text-graphite italic">No country exceptions yet. Add one with the + button.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TransactionFeeSettings({
  config,
  onUpdate,
}: {
  config: TransactionSettings["transactionFee"];
  onUpdate: (config: TransactionSettings["transactionFee"]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Enable Toggle */}
      <div className="p-6 border border-mist space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-ink mb-1">Charge Transaction Fee</h3>
            <p className="text-xs text-graphite">Apply an additional fee on top of order total</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => onUpdate({ ...config, enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-graphite">{config.enabled ? "Enabled" : "Disabled"}</span>
          </label>
        </div>
      </div>

      {config.enabled && (
        <div className="p-6 border border-mist">
          <FeeConfigEditor
            config={config.fee}
            onChange={(fee) => onUpdate({ ...config, fee })}
            label="Transaction Fee Configuration"
            description="Fee applied to all transactions"
          />
        </div>
      )}
    </div>
  );
}

function FeeConfigEditor({
  config,
  onChange,
  label,
  description,
  compact = false,
  isInternational = false,
}: {
  config: FeeConfig;
  onChange: (fee: FeeConfig) => void;
  label?: string;
  description?: string;
  compact?: boolean;
  isInternational?: boolean;
}) {
  return (
    <div className={`space-y-${compact ? 2 : 4}`}>
      {!compact && label && <label className="block text-sm font-medium text-ink">{label}</label>}
      {!compact && description && <p className="text-xs text-graphite">{description}</p>}

      <div className={`grid grid-cols-${compact ? 2 : 3} gap-3`}>
        {/* Type Selection */}
        <div>
          <label className="text-xs text-graphite block mb-1">Type</label>
          <select
            value={config.type}
            onChange={(e) => onChange({ ...config, type: e.target.value as "percentage" | "fixed" })}
            className="w-full border border-mist px-3 py-2 text-sm"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed {isInternational ? "(Currency)" : "(IDR)"}</option>
          </select>
        </div>

        {/* Value */}
        <div>
          <label className="text-xs text-graphite block mb-1">
            {config.type === "percentage"
              ? "Percent (%)"
              : isInternational
                ? `Amount (${config.currency || 'USD'})`
                : "Amount (IDR)"
            }
          </label>
          <input
            type="number"
            value={config.value}
            onChange={(e) => onChange({ ...config, value: parseFloat(e.target.value) })}
            className="w-full border border-mist px-3 py-2 text-sm"
            step={config.type === "percentage" ? 0.1 : 1}
          />
        </div>

        {/* Currency (for international fixed fees) */}
        {isInternational && config.type === "fixed" && (
          <div>
            <label className="text-xs text-graphite block mb-1">Currency</label>
            <select
              value={config.currency || 'USD'}
              onChange={(e) => onChange({ ...config, currency: e.target.value })}
              className="w-full border border-mist px-3 py-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="SGD">SGD</option>
              <option value="CNY">CNY</option>
              <option value="JPY">JPY</option>
              <option value="KRW">KRW</option>
              <option value="AUD">AUD</option>
              <option value="MYR">MYR</option>
              <option value="THB">THB</option>
              <option value="VND">VND</option>
              <option value="PHP">PHP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        )}

        {/* Min Cap (only for percentage) */}
        {config.type === "percentage" && (
          <div>
            <label className="text-xs text-graphite block mb-1">Min Cap (IDR)</label>
            <input
              type="number"
              value={config.minCap ?? ""}
              onChange={(e) => onChange({ ...config, minCap: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full border border-mist px-3 py-2 text-sm"
              step="1000"
              placeholder="No minimum"
            />
          </div>
        )}
      </div>

      {/* Max Cap (only for percentage) */}
      {config.type === "percentage" && (
        <div>
          <label className="text-xs text-graphite block mb-1">Max Cap (IDR)</label>
          <input
            type="number"
            value={config.maxCap ?? ""}
            onChange={(e) => onChange({ ...config, maxCap: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full border border-mist px-3 py-2 text-sm"
            step="1000"
            placeholder="No maximum"
          />
        </div>
      )}

      {/* Preview */}
      <div className="p-3 bg-surface rounded text-xs text-graphite">
        {config.type === "percentage" ? (
          <p>
            {config.value}% of base fare
            {config.minCap && ` (min: ${isInternational ? config.currency || 'USD' : 'Rp'} ${config.minCap.toLocaleString(isInternational ? 'en-US' : 'id-ID')})`}
            {config.maxCap && ` (max: ${isInternational ? config.currency || 'USD' : 'Rp'} ${config.maxCap.toLocaleString(isInternational ? 'en-US' : 'id-ID')})`}
          </p>
        ) : isInternational ? (
          <p>Fixed: {config.currency || 'USD'} {config.value.toLocaleString('en-US')}</p>
        ) : (
          <p>Fixed: Rp {config.value.toLocaleString("id-ID")}</p>
        )}
      </div>
    </div>
  );
}
