import { estimateShipping } from '@/lib/shipping-real';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postal') || '12345';
  const weight = searchParams.get('weight') || '5000';
  const type = (searchParams.get('type') as 'domestic' | 'international') || 'domestic';

  console.log('\n=== SHIPPING DEBUG ===');
  console.log('Testing with:', { postalCode, weight, type });
  console.log('API Key set:', !!process.env.SHIPPING_COST_API_KEY);
  console.log('API Key value:', process.env.SHIPPING_COST_API_KEY ? 'SET' : 'NOT SET');

  try {
    const rates = await estimateShipping({
      destinationPostalCode: postalCode,
      weight: parseInt(weight),
      type,
    });

    return Response.json({
      success: true,
      query: { postalCode, weight, type },
      ratesCount: rates.length,
      rates,
      hasApiKey: !!process.env.SHIPPING_COST_API_KEY,
      isFallback: rates.some(r => r.id.includes('fallback')),
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
