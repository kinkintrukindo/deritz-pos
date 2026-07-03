export interface SizePreset {
  name: 'XS' | 'S' | 'M' | 'L';
  bust: [number, number];
  waist: [number, number];
  hip: [number, number];
}

export const SIZE_PRESETS: Record<string, SizePreset> = {
  XS: {
    name: 'XS',
    bust: [78, 82],
    waist: [62, 65],
    hip: [84, 88],
  },
  S: {
    name: 'S',
    bust: [83, 86],
    waist: [66, 70],
    hip: [89, 93],
  },
  M: {
    name: 'M',
    bust: [87, 90],
    waist: [71, 74],
    hip: [94, 98],
  },
  L: {
    name: 'L',
    bust: [91, 94],
    waist: [75, 79],
    hip: [99, 105],
  },
};

export function getPresetLabel(preset: SizePreset): string {
  return `${preset.name} (Bust ${preset.bust[0]}-${preset.bust[1]}cm)`;
}
