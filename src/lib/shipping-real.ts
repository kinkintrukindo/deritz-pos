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
  destinationPostalCode: string;
  weight: number;
  type: 'domestic' | 'international';
}

async function getDomesticRates(destinationPostalCode: string, weight: number): Promise<ShippingRate[]> {
  if (!process.env.SHIPPING_COST_API_KEY) {
    console.warn('❌ SHIPPING_COST_API_KEY not set, using fallback rates');
    return getFallbackDomesticRates();
  }

  try {
    // Call shipping cost API with postal codes for more accuracy
    // Origin is hardcoded to 60134 (Surabaya) on backend
    const payload = {
      originPostalCode: '60134',
      destinationPostalCode: destinationPostalCode,
      weight: weight, // Use actual product weight in grams
      couriers: ['jne', 'tiki', 'pos'],
    };
    console.log('📦 Domestic shipping request:', payload);

    const response = await fetch('https://api.shippingcost.co.id/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SHIPPING_COST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('🔍 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Shipping API error:', response.status, errorText);
      return getFallbackDomesticRates();
    }

    const data = await response.json();
    console.log('📋 API Response data:', data);

    if (data.results && Array.isArray(data.results)) {
      const rates: ShippingRate[] = data.results.map((result: any, idx: number) => ({
        id: `${result.courier}-${result.service}-${idx}`,
        courier: result.courier?.toUpperCase() || 'Unknown',
        service: result.service || 'Standard',
        description: `${result.service} (${result.etd} days)`,
        cost: result.cost || 150000,
        etaText: `${result.etd} business days`,
        type: 'domestic',
      }));

      console.log('✅ Real API rates returned:', rates.length, 'options');
      return rates.length > 0 ? rates : getFallbackDomesticRates();
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackDomesticRates();
  } catch (error) {
    console.error('❌ Shipping API error:', error);
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

async function getInternationalRates(destination: string, weight: number): Promise<ShippingRate[]> {
  if (!process.env.SHIPPING_COST_API_KEY) {
    console.warn('❌ SHIPPING_COST_API_KEY not set, using fallback rates');
    return getFallbackInternationalRates();
  }

  try {
    const payload = {
      originPostalCode: '60134',
      destination: destination,
      weight: weight, // Use actual product weight in grams
      couriers: ['dhl', 'fedex', 'ups'],
    };
    console.log('🌍 International shipping request:', payload);

    const response = await fetch('https://api.shippingcost.co.id/international-rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SHIPPING_COST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('🔍 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ International API error:', response.status, errorText);
      return getFallbackInternationalRates();
    }

    const data = await response.json();
    console.log('📋 API Response data:', data);

    if (data.results && Array.isArray(data.results)) {
      const rates = data.results.map((result: any, idx: number) => ({
        id: `${result.courier}-${result.service}-${idx}`,
        courier: result.courier?.toUpperCase() || 'Express',
        service: result.service || 'Express',
        description: `${result.service} (${result.etd} days)`,
        cost: result.cost || 1200000,
        etaText: `${result.etd} business days`,
        type: 'international' as const,
      }));
      console.log('✅ Real API rates returned:', rates.length, 'options');
      return rates;
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackInternationalRates();
  } catch (error) {
    console.error('❌ International shipping API error:', error);
    return getFallbackInternationalRates();
  }
}

function getFallbackInternationalRates(): ShippingRate[] {
  return [
    {
      id: 'dhl-express',
      courier: 'DHL',
      service: 'Express',
      description: 'Express worldwide (3-5 days)',
      cost: 1200000,
      etaText: '3-5 business days',
      type: 'international',
    },
    {
      id: 'fedex-intl',
      courier: 'FedEx',
      service: 'International Economy',
      description: 'Economy worldwide (5-7 days)',
      cost: 850000,
      etaText: '5-7 business days',
      type: 'international',
    },
    {
      id: 'ups-express',
      courier: 'UPS',
      service: 'Worldwide Express',
      description: 'Fast worldwide (4-6 days)',
      cost: 1100000,
      etaText: '4-6 business days',
      type: 'international',
    },
  ];
}

export async function estimateShipping(
  params: ShippingEstimateParams
): Promise<ShippingRate[]> {
  if (params.type === 'domestic') {
    return getDomesticRates(params.destinationPostalCode, params.weight);
  } else {
    return getInternationalRates(params.destinationPostalCode, params.weight);
  }
}
