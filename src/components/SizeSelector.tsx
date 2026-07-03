'use client';

import { useState } from 'react';
import { SIZE_PRESETS } from '@/lib/sizes';

export interface SizeSelection {
  sizeMode: 'preset' | 'custom';
  sizePreset?: 'XS' | 'S' | 'M' | 'L';
  measurements: {
    bust: number;
    waist: number;
    hip: number;
    unit: string;
  };
}

interface SizeSelectorProps {
  onSizeChange: (selection: SizeSelection) => void;
  defaultSize?: 'XS' | 'S' | 'M' | 'L' | 'custom';
}

export function SizeSelector({ onSizeChange, defaultSize = 'S' }: SizeSelectorProps) {
  const [mode, setMode] = useState<'preset' | 'custom'>(defaultSize === 'custom' ? 'custom' : 'preset');
  const [selectedPreset, setSelectedPreset] = useState<'XS' | 'S' | 'M' | 'L'>(
    (defaultSize !== 'custom' ? defaultSize : 'S') as any
  );
  const [bust, setBust] = useState(SIZE_PRESETS.S.bust[0]);
  const [waist, setWaist] = useState(SIZE_PRESETS.S.waist[0]);
  const [hip, setHip] = useState(SIZE_PRESETS.S.hip[0]);

  const handlePresetSelect = (preset: 'XS' | 'S' | 'M' | 'L') => {
    setSelectedPreset(preset);
    setMode('preset');
    const presetData = SIZE_PRESETS[preset];
    setBust(presetData.bust[0]);
    setWaist(presetData.waist[0]);
    setHip(presetData.hip[0]);
    onSizeChange({
      sizeMode: 'preset',
      sizePreset: preset,
      measurements: {
        bust: presetData.bust[0],
        waist: presetData.waist[0],
        hip: presetData.hip[0],
        unit: 'cm',
      },
    });
  };

  const handleCustomChange = (field: 'bust' | 'waist' | 'hip', value: number) => {
    if (field === 'bust') setBust(value);
    if (field === 'waist') setWaist(value);
    if (field === 'hip') setHip(value);

    onSizeChange({
      sizeMode: 'custom',
      measurements: {
        bust: field === 'bust' ? value : bust,
        waist: field === 'waist' ? value : waist,
        hip: field === 'hip' ? value : hip,
        unit: 'cm',
      },
    });
  };

  const currentPreset = mode === 'preset' ? SIZE_PRESETS[selectedPreset] : null;

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={mode === 'custom'}
            onChange={(e) => {
              if (e.target.checked) {
                setMode('custom');
              } else {
                setMode('preset');
              }
            }}
          />
          <span className="text-sm text-graphite">Custom measurements</span>
        </label>
      </div>

      {mode === 'preset' ? (
        <div>
          <p className="text-sm tracking-wide-label uppercase text-graphite mb-3">
            Choose Your Size
          </p>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key as any)}
                className={`py-3 text-sm font-medium transition-colors ${
                  selectedPreset === key
                    ? 'bg-ink text-white'
                    : 'border border-mist text-ink hover:border-ink'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {currentPreset && (
            <div className="border border-mist p-4 space-y-3">
              <div>
                <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                  Bust: {bust}cm
                </label>
                <input
                  type="range"
                  min={currentPreset.bust[0]}
                  max={currentPreset.bust[1]}
                  value={bust}
                  onChange={(e) => handleCustomChange('bust', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                  Waist: {waist}cm
                </label>
                <input
                  type="range"
                  min={currentPreset.waist[0]}
                  max={currentPreset.waist[1]}
                  value={waist}
                  onChange={(e) => handleCustomChange('waist', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                  Hip: {hip}cm
                </label>
                <input
                  type="range"
                  min={currentPreset.hip[0]}
                  max={currentPreset.hip[1]}
                  value={hip}
                  onChange={(e) => handleCustomChange('hip', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-mist p-4 space-y-3">
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
              Bust: {bust}cm
            </label>
            <input
              type="range"
              min="60"
              max="120"
              value={bust}
              onChange={(e) => handleCustomChange('bust', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
              Waist: {waist}cm
            </label>
            <input
              type="range"
              min="50"
              max="110"
              value={waist}
              onChange={(e) => handleCustomChange('waist', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
              Hip: {hip}cm
            </label>
            <input
              type="range"
              min="70"
              max="130"
              value={hip}
              onChange={(e) => handleCustomChange('hip', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
