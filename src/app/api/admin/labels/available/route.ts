import { getSupabase } from '@/lib/supabase';

export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('product_labels')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const labels = (data || []).map(row => ({
    id: row.id,
    name: row.name,
    color: row.color,
    style: row.style,
    sortOrder: row.sort_order,
    active: row.active,
  }));

  return Response.json(labels);
}
