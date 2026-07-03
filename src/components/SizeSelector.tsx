"use client";

import { useState } from "react";
import type { MeasurementRange, SizePresetKey } from "@/lib/types";

const CM_TO_IN = 0.3937007874;

export type SizeSelection = {
  sizeMode: "preset" | "custom";
  sizePreset?: SizePresetKey;
  measurements: { bust: number; waist: number; hip: number; unit: "cm" | "in" };
};

export function SizeSelector({
  sizePresets,
  measurementRanges,
  onChange,
}: {
  sizePresets: Record<SizePresetKey, { bust: number; waist: number; hip: number }>;
  measurementRanges: { bust: MeasurementRange; waist: MeasurementRange; hip: MeasurementRange };
  onChange: (selection: SizeSelection) => void;
}) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [preset, setPreset] = useState<SizePresetKey>("S");
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [custom, setCustom] = useState({
    bust: sizePresets.S.bust,
    waist: sizePresets.S.waist,
    hip: sizePresets.S.hip,
  });

  function selectPreset(key: SizePresetKey) {
    setPreset(key);
    setMode("preset");
    onChange({ sizeMode: "preset", sizePreset: key, measurements: { ...sizePresets[key], unit: "cm" } });
  }

  function selectCustom() {
    setMode("custom");
    onChange({ sizeMode: "custom", measurements: { ...custom, unit } });
  }

  function updateCustom(field: "bust" | "waist" | "hip", cmValue: number) {
    const next = { ...custom, [field]: cmValue };
    setCustom(next);
    onChange({ sizeMode: "custom", measurements: { ...next, unit } });
  }

  function toDisplay(cmValue: number) {
    return unit === "cm" ? cmValue : Math.round(cmValue * CM_TO_IN * 10) / 10;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        {(["XS", "S", "M"] as SizePresetKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectPreset(key)}
            className={`h-11 w-11 border text-sm transition-colors ${
              mode === "preset" && preset === key
                ? "bg-ink text-white border-ink"
                : "border-mist text-ink hover:border-ink"
            }`}
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          onClick={selectCustom}
          className={`h-11 px-5 border text-xs tracking-wide-label uppercase transition-colors ${
            mode === "custom"
              ? "bg-ink text-white border-ink"
              : "border-mist text-ink hover:border-ink"
          }`}
        >
          Custom
        </button>
      </div>

      {mode === "custom" && (
        <div className="border border-mist p-5 space-y-5">
          <div className="flex justify-end">
            <div className="flex gap-2 text-xs text-graphite">
              <button
                type="button"
                onClick={() => setUnit("cm")}
                className={unit === "cm" ? "text-gold underline" : ""}
              >
                cm
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setUnit("in")}
                className={unit === "in" ? "text-gold underline" : ""}
              >
                in
              </button>
            </div>
          </div>

          {(["bust", "waist", "hip"] as const).map((field) => (
            <div key={field}>
              <div className="flex justify-between text-xs tracking-wide-label uppercase text-graphite mb-2">
                <span>{field}</span>
                <span className="text-ink">
                  {toDisplay(custom[field])} {unit}
                </span>
              </div>
              <input
                type="range"
                min={measurementRanges[field].min}
                max={measurementRanges[field].max}
                value={custom[field]}
                onChange={(e) => updateCustom(field, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
          <p className="text-xs text-graphite leading-relaxed pt-1">
            Custom measurements incur a made-to-measure finishing fee and a
            slightly longer lead time — shown in the summary below.
          </p>
        </div>
      )}
    </div>
  );
}
