import { estimateShipping } from '@/lib/shipping-real';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postal') || '60225';
  const weight = searchParams.get('weight') || '5000';
  const type = (searchParams.get('type') as 'domestic' | 'international') || 'domestic';
  const verbose = searchParams.get('verbose') === 'true';

  console.log('\n=== SHIPPING DEBUG ===');
  console.log('Testing with:', { postalCode, weight, type });
  console.log('API Key set:', !!process.env.SHIPPING_COST_API_KEY);

  try {
    // Also try calling the API directly for debugging
    let apiResponse = null;
    if (process.env.SHIPPING_COST_API_KEY && verbose) {
      try {
        const res = await fetch('https://api.shippingcost.co.id/rates', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SHIPPING_COST_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originPostalCode: '60134',
            destinationPostalCode: postalCode,
            weight: parseInt(weight),
            couriers: ['jne', 'tiki', 'pos'],
          }),
        });
        const data = await res.json();
        apiResponse = {
          status: res.status,
          data: data,
        };
      } catch (e) {
        apiResponse = { error: String(e) };
      }
    }

    const rates = await estimateShipping({
      destinationId: postalCode, // For debug, treat postal code as destination ID
      weight: parseInt(weight),
      type,
    });

    return Response.json({
      success: true,
      query: { postalCode, weight, type },
      ratesCount: rates.length,
      rates: verbose ? rates : rates.slice(0, 2),
      hasApiKey: !!process.env.SHIPPING_COST_API_KEY,
      isFallback: rates.some(r => r.id.includes('fallback')),
      apiResponse: verbose ? apiResponse : undefined,
      note: 'Add ?verbose=true to see raw API response',
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: String(error),
        hasApiKey: !!process.env.SHIPPING_COST_API_KEY,
      },
      { status: 500 }
    );
  }
}
