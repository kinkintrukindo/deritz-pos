// Hardcoded list of 29 supported countries for manual shipping mode
// Maps ISO code to country name and RajaOngkir V2 ID for reference

export interface Country {
  iso: string;
  name: string;
  rajaongkirId: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { iso: 'SG', name: 'Singapore', rajaongkirId: '152' },
  { iso: 'CN', name: 'China', rajaongkirId: '36' },
  { iso: 'AU', name: 'Australia', rajaongkirId: '9' },
  { iso: 'US', name: 'United States', rajaongkirId: '233' },
  { iso: 'CA', name: 'Canada', rajaongkirId: '30' },
  { iso: 'JP', name: 'Japan', rajaongkirId: '91' },
  { iso: 'KR', name: 'South Korea', rajaongkirId: '175' },
  { iso: 'DE', name: 'Germany', rajaongkirId: '66' },
  { iso: 'FR', name: 'France', rajaongkirId: '61' },
  { iso: 'IT', name: 'Italy', rajaongkirId: '89' },
  { iso: 'ES', name: 'Spain', rajaongkirId: '156' },
  { iso: 'NL', name: 'Netherlands', rajaongkirId: '125' },
  { iso: 'BE', name: 'Belgium', rajaongkirId: '16' },
  { iso: 'AT', name: 'Austria', rajaongkirId: '10' },
  { iso: 'CH', name: 'Switzerland', rajaongkirId: '223' },
  { iso: 'SE', name: 'Sweden', rajaongkirId: '189' },
  { iso: 'NO', name: 'Norway', rajaongkirId: '142' },
  { iso: 'DK', name: 'Denmark', rajaongkirId: '51' },
  { iso: 'FI', name: 'Finland', rajaongkirId: '54' },
  { iso: 'PL', name: 'Poland', rajaongkirId: '130' },
  { iso: 'CZ', name: 'Czech Republic', rajaongkirId: '39' },
  { iso: 'GR', name: 'Greece', rajaongkirId: '84' },
  { iso: 'PT', name: 'Portugal', rajaongkirId: '144' },
  { iso: 'PH', name: 'Philippines', rajaongkirId: '131' },
  { iso: 'MX', name: 'Mexico', rajaongkirId: '147' },
  { iso: 'VN', name: 'Vietnam', rajaongkirId: '241' },
  { iso: 'TH', name: 'Thailand', rajaongkirId: '214' },
  { iso: 'MY', name: 'Malaysia', rajaongkirId: '124' },
  { iso: 'ID', name: 'Indonesia', rajaongkirId: '103' },
];

// Quick lookup by ISO code
export const COUNTRY_BY_ISO: Record<string, Country> = Object.fromEntries(
  SUPPORTED_COUNTRIES.map((c) => [c.iso, c])
);

// Get country by ISO code
export function getCountryByISO(iso: string): Country | null {
  return COUNTRY_BY_ISO[iso] || null;
}

// Search countries by name (for filtering)
export function searchCountries(query: string): Country[] {
  if (!query.trim()) return SUPPORTED_COUNTRIES;
  const lowercaseQuery = query.toLowerCase();
  return SUPPORTED_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(lowercaseQuery)
  );
}
