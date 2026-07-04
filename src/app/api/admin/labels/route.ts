import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, color, sortOrder } = await request.json();

  const sbAdmin = getSupabase();
  const { data, error } = await sbAdmin
    .from('product_labels')
    .insert({
      name,
      color,
      sort_order: sortOrder,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    id: data.id,
    name: data.name,
    color: data.color,
    sortOrder: data.sort_order,
    active: data.active,
  });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name, color } = await request.json();

  const sbAdmin = getSupabase();
  const { data, error } = await sbAdmin
    .from('product_labels')
    .update({ name, color })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    id: data.id,
    name: data.name,
    color: data.color,
    sortOrder: data.sort_order,
    active: data.active,
  });
}
