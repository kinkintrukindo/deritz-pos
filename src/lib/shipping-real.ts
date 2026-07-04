import { SHIPPING, API_ENDPOINTS } from './constants';

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
    // RajaOngkir API - domestic shipping
    const params = new URLSearchParams();
    params.append('origin', SHIPPING.ORIGIN_CITY_CODE);
    params.append('destination', destinationPostalCode);
    params.append('weight', Math.round(weight / 1000).toString()); // Convert grams to kg
    params.append('courier', 'jne:tiki:pos');

    console.log('📦 RajaOngkir request:', { origin: SHIPPING.ORIGIN_CITY_CODE, destination: destinationPostalCode, weight: Math.round(weight / 1000), courier: 'jne:tiki:pos' });

    const response = await fetch(API_ENDPOINTS.RAJAONGKIR_BASIC, {
      method: 'POST',
      headers: {
        'key': process.env.SHIPPING_COST_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log('🔍 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ RajaOngkir API error:', response.status, errorText);
      return getFallbackDomesticRates();
    }

    const data = await response.json();
    console.log('📋 API Response data:', JSON.stringify(data).substring(0, 500));

    if (data.status?.code === 200 && data.results && Array.isArray(data.results)) {
      const allRates: ShippingRate[] = [];

      for (const result of data.results) {
        if (result.costs && Array.isArray(result.costs)) {
          for (const cost of result.costs) {
            allRates.push({
              id: `${result.code}-${cost.service}`,
              courier: result.code?.toUpperCase() || 'Unknown',
              service: cost.service || 'Standard',
              description: `${cost.service} (${cost.cost[0]?.etd || '?'} days)`,
              cost: cost.cost[0]?.value || 150000,
              etaText: `${cost.cost[0]?.etd || '?'} business days`,
              type: 'domestic',
            });
          }
        }
      }

      console.log('✅ Real API rates returned:', allRates.length, 'options');
      return allRates.length > 0 ? allRates : getFallbackDomesticRates();
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackDomesticRates();
  } catch (error) {
    console.error('❌ RajaOngkir API error:', error);
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
      cost: SHIPPING.DOMESTIC.JNE_OKE,
      etaText: '3-5 business days',
      type: 'domestic',
    },
    {
      id: 'fallback-tiki',
      courier: 'TIKI',
      service: 'Regular',
      description: 'Regular shipping (4-6 days)',
      cost: SHIPPING.DOMESTIC.TIKI_REGULAR,
      etaText: '4-6 business days',
      type: 'domestic',
    },
    {
      id: 'fallback-pos',
      courier: 'POS Indonesia',
      service: 'Paket Reguler',
      description: 'Economy shipping (5-7 days)',
      cost: SHIPPING.DOMESTIC.POS_REGULAR,
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
    // RajaOngkir International API
    const params = new URLSearchParams();
    params.append('origin', SHIPPING.ORIGIN_CITY_CODE);
    params.append('destination', destination);
    params.append('weight', Math.round(weight / 1000).toString()); // Convert grams to kg
    params.append('courier', 'pos:tiki:jne');

    console.log('🌍 RajaOngkir international request:', { origin: SHIPPING.ORIGIN_CITY_CODE, destination, weight: Math.round(weight / 1000), courier: 'pos:tiki:jne' });

    const response = await fetch(API_ENDPOINTS.RAJAONGKIR_BASIC_INTL, {
      method: 'POST',
      headers: {
        'key': process.env.SHIPPING_COST_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log('🔍 API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ RajaOngkir International API error:', response.status, errorText);
      return getFallbackInternationalRates();
    }

    const data = await response.json();
    console.log('📋 API Response data:', JSON.stringify(data).substring(0, 500));

    if (data.status?.code === 200 && data.results && Array.isArray(data.results)) {
      const allRates: ShippingRate[] = [];

      for (const result of data.results) {
        if (result.costs && Array.isArray(result.costs)) {
          for (const cost of result.costs) {
            allRates.push({
              id: `${result.code}-${cost.service}`,
              courier: result.code?.toUpperCase() || 'Express',
              service: cost.service || 'Express',
              description: `${cost.service} (${cost.cost[0]?.etd || '?'} days)`,
              cost: cost.cost[0]?.value || 1200000,
              etaText: `${cost.cost[0]?.etd || '?'} business days`,
              type: 'international' as const,
            });
          }
        }
      }

      console.log('✅ Real API rates returned:', allRates.length, 'options');
      return allRates.length > 0 ? allRates : getFallbackInternationalRates();
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackInternationalRates();
  } catch (error) {
    console.error('❌ RajaOngkir International API error:', error);
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
      cost: SHIPPING.INTERNATIONAL.USA,
      etaText: '3-5 business days',
      type: 'international',
    },
    {
      id: 'fedex-intl',
      courier: 'FedEx',
      service: 'International Economy',
      description: 'Economy worldwide (5-7 days)',
      cost: SHIPPING.INTERNATIONAL.UK,
      etaText: '5-7 business days',
      type: 'international',
    },
    {
      id: 'ups-express',
      courier: 'UPS',
      service: 'Worldwide Express',
      description: 'Fast worldwide (4-6 days)',
      cost: SHIPPING.INTERNATIONAL.AUSTRALIA,
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
