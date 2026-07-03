export interface ShippingRate {
  id: string;
  courier: string;
  service: string;
  description: string;
  cost: number;
  etaText: string;
  type: 'domestic' | 'international';
}

export interface ShippingEstimateParams {
  origin: 'surabaya'; // Fixed origin for now
  destination: string; // City name or postal code
  weight: number; // in grams
  type: 'domestic' | 'international';
}

// International DHL/FedEx zone-based rates (hardcoded for now)
const INTERNATIONAL_RATES: Record<string, ShippingRate[]> = {
  'asia': [
    {
      id: 'dhl-asia',
      courier: 'DHL Express',
      service: 'Express',
      description: 'Fast delivery to Asia',
      cost: 1200000, // ~$80 USD
      etaText: '3-5 business days',
      type: 'international',
    },
    {
      id: 'fedex-asia',
      courier: 'FedEx International Economy',
      service: 'Economy',
      description: 'Economical shipping to Asia',
      cost: 800000, // ~$54 USD
      etaText: '5-7 business days',
      type: 'international',
    },
  ],
  'americas': [
    {
      id: 'dhl-americas',
      courier: 'DHL Express',
      service: 'Express',
      description: 'Fast delivery to Americas',
      cost: 1800000, // ~$120 USD
      etaText: '4-6 business days',
      type: 'international',
    },
    {
      id: 'fedex-americas',
      courier: 'FedEx International Economy',
      service: 'Economy',
      description: 'Economical shipping to Americas',
      cost: 1200000, // ~$80 USD
      etaText: '6-8 business days',
      type: 'international',
    },
  ],
  'europe': [
    {
      id: 'dhl-europe',
      courier: 'DHL Express',
      service: 'Express',
      description: 'Fast delivery to Europe',
      cost: 1500000, // ~$100 USD
      etaText: '3-5 business days',
      type: 'international',
    },
    {
      id: 'fedex-europe',
      courier: 'FedEx International Economy',
      service: 'Economy',
      description: 'Economical shipping to Europe',
      cost: 1000000, // ~$67 USD
      etaText: '5-7 business days',
      type: 'international',
    },
  ],
  'other': [
    {
      id: 'dhl-other',
      courier: 'DHL Express',
      service: 'Express',
      description: 'Express worldwide shipping',
      cost: 2000000, // ~$134 USD
      etaText: '5-7 business days',
      type: 'international',
    },
  ],
};

async function getInternationalRates(destination: string): Promise<ShippingRate[]> {
  // Simple zone detection based on country name
  const dest = destination.toLowerCase();

  if (
    dest.includes('usa') || dest.includes('canada') ||
    dest.includes('mexico') || dest.includes('brazil') ||
    dest.includes('argentina') || dest.includes('chile')
  ) {
    return INTERNATIONAL_RATES['americas'];
  } else if (
    dest.includes('uk') || dest.includes('united kingdom') ||
    dest.includes('france') || dest.includes('germany') ||
    dest.includes('italy') || dest.includes('spain') ||
    dest.includes('netherlands') || dest.includes('switzerland')
  ) {
    return INTERNATIONAL_RATES['europe'];
  } else if (
    dest.includes('singapore') || dest.includes('malaysia') ||
    dest.includes('thailand') || dest.includes('vietnam') ||
    dest.includes('philippines') || dest.includes('japan') ||
    dest.includes('south korea') || dest.includes('china')
  ) {
    return INTERNATIONAL_RATES['asia'];
  }

  return INTERNATIONAL_RATES['other'];
}

async function getDomesticRates(destination: string): Promise<ShippingRate[]> {
  // Call Raja Ongkir API for domestic Indonesia shipping
  if (!process.env.RAJAONGKIR_API_KEY) {
    // Fallback if API key not set
    return [
      {
        id: 'fallback-jne',
        courier: 'JNE',
        service: 'OKE',
        description: 'Standard shipping (3-5 days)',
        cost: 150000,
        etaText: '3-5 business days',
        type: 'domestic',
      },
      {
        id: 'fallback-pos',
        courier: 'POS Indonesia',
        service: 'Paket Reguler',
        description: 'Regular shipping (4-7 days)',
        cost: 120000,
        etaText: '4-7 business days',
        type: 'domestic',
      },
    ];
  }

  try {
    // Raja Ongkir API call
    const response = await fetch('https://api.rajaongkir.com/starter/cost', {
      method: 'POST',
      headers: {
        'key': process.env.RAJAONGKIR_API_KEY,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        origin: '444', // Surabaya city ID in Raja Ongkir
        destination: destination, // User's destination city ID (need to look up)
        weight: '2000', // 2kg estimate for bridal wear
        courier: 'jne:pos:tiki', // Multiple couriers
      }).toString(),
    });

    const data = await response.json();

    if (data.status?.code === 200 && data.results?.length > 0) {
      const result = data.results[0];
      const rates: ShippingRate[] = [];

      if (result.costs) {
        result.costs.forEach((cost: any, idx: number) => {
          cost.cost?.forEach((costOption: any, cidx: number) => {
            rates.push({
              id: `${result.code}-${cost.service}-${cidx}`,
              courier: result.code.toUpperCase(),
              service: cost.service,
              description: `${cost.service} (${costOption.etd} days)`,
              cost: costOption.value,
              etaText: `${costOption.etd} business days`,
              type: 'domestic',
            });
          });
        });
      }

      return rates.length > 0 ? rates : getFallbackDomesticRates();
    }

    return getFallbackDomesticRates();
  } catch (error) {
    console.error('Raja Ongkir API error:', error);
    return getFallbackDomesticRates();
  }
}

function getFallbackDomesticRates(): ShippingRate[] {
  return [
    {
      id: 'fallback-jne',
      courier: 'JNE',
      service: 'OKE',
      description: 'Standard shipping (3-5 days)',
      cost: 150000,
      etaText: '3-5 business days',
      type: 'domestic',
    },
    {
      id: 'fallback-tiki',
      courier: 'TIKI',
      service: 'Regular',
      description: 'Regular shipping (4-6 days)',
      cost: 140000,
      etaText: '4-6 business days',
      type: 'domestic',
    },
    {
      id: 'fallback-pos',
      courier: 'POS Indonesia',
      service: 'Paket Reguler',
      description: 'Economy shipping (5-7 days)',
      cost: 120000,
      etaText: '5-7 business days',
      type: 'domestic',
    },
  ];
}

export async function estimateShipping(
  params: ShippingEstimateParams
): Promise<ShippingRate[]> {
  if (params.type === 'domestic') {
    return getDomesticRates(params.destination);
  } else {
    return getInternationalRates(params.destination);
  }
}
