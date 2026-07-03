import { NextRequest } from 'next/server';
import { getProductById } from '@/lib/products';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return Response.json({ error: 'Product not found' }, { status: 404 });
  }

  return Response.json(product);
}
