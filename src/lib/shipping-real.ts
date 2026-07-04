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
  destinationId: string; // RajaOngkir V2: subdistrict_id for domestic, country_id for international
  weight: number;
  type: 'domestic' | 'international';
}

async function getDomesticRates(destinationId: string, weight: number): Promise<ShippingRate[]> {
  try {
    // Use origin city code from constants (in V2, need to search for actual ID, but using code as-is for now)
    // In production, this would be the subdistrict_id from the destination search result
    const response = await fetch('/api/shipping/calculate-cost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: SHIPPING.ORIGIN_CITY_CODE, // TODO: replace with actual origin subdistrict_id
        destination: destinationId, // RajaOngkir V2 subdistrict_id from search
        weight: Math.round(weight), // Already in grams
        courier: 'jne,tiki,pos',
        type: 'domestic',
        price: true, // lowest price
      }),
    });

    console.log('🔍 Domestic cost API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Domestic cost API error:', response.status, errorText);
      return getFallbackDomesticRates();
    }

    const data = await response.json();
    console.log('📋 Domestic cost API Response:', data?.costs?.length || 0, 'options');

    if (data.success && data.costs && Array.isArray(data.costs)) {
      const allRates: ShippingRate[] = data.costs.map((cost: any) => ({
        id: `${cost.code}-${cost.service}`,
        courier: cost.name || cost.code?.toUpperCase() || 'Unknown',
        service: cost.service || 'Standard',
        description: `${cost.service} (${cost.etd || '?'} days)`,
        cost: cost.cost || 150000,
        etaText: `${cost.etd || '?'} business days`,
        type: 'domestic',
      }));

      console.log('✅ Real API rates returned:', allRates.length, 'options');
      return allRates.length > 0 ? allRates : getFallbackDomesticRates();
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackDomesticRates();
  } catch (error) {
    console.error('❌ Domestic cost calculation error:', error);
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
  try {
    // destination should be the country_id from the international destination search
    const response = await fetch('/api/shipping/calculate-cost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: SHIPPING.ORIGIN_CITY_CODE, // TODO: replace with actual origin subdistrict_id
        destination: destination, // This should be the country_id from search
        weight: Math.round(weight), // Already in grams
        courier: 'pos,tiki,jne',
        type: 'international',
        price: true, // lowest price
      }),
    });

    console.log('🔍 International cost API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ International cost API error:', response.status, errorText);
      return getFallbackInternationalRates();
    }

    const data = await response.json();
    console.log('📋 International cost API Response:', data?.costs?.length || 0, 'options');

    if (data.success && data.costs && Array.isArray(data.costs)) {
      const allRates: ShippingRate[] = data.costs.map((cost: any) => ({
        id: `${cost.code}-${cost.service}`,
        courier: cost.name || cost.code?.toUpperCase() || 'Express',
        service: cost.service || 'Express',
        description: `${cost.service} (${cost.etd || '?'} days)`,
        cost: cost.cost || 1200000,
        etaText: `${cost.etd || '?'} business days`,
        type: 'international' as const,
      }));

      console.log('✅ Real API rates returned:', allRates.length, 'options');
      return allRates.length > 0 ? allRates : getFallbackInternationalRates();
    }

    console.warn('⚠️ No results in API response, using fallback');
    return getFallbackInternationalRates();
  } catch (error) {
    console.error('❌ International cost calculation error:', error);
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
    return getDomesticRates(params.destinationId, params.weight);
  } else {
    return getInternationalRates(params.destinationId, params.weight);
  }
}
