import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserConversations } from '@/lib/chat';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: Request) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow guest access with email in headers
  const guestEmail = request.headers.get('X-Guest-Email');

  const userId = user?.id || guestEmail || 'guest';

  if (!user && !guestEmail) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversations = await getUserConversations(userId);
  return Response.json(conversations);
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow guest access with email in headers
  const guestEmail = request.headers.get('X-Guest-Email');

  const userId = user?.id || (guestEmail?.toLowerCase().trim());

  if (!user && !guestEmail) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userId) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { subject, orderId, productId, productName, productImage } = await request.json();

  if (!subject) {
    return Response.json({ error: 'Subject is required' }, { status: 400 });
  }

  const sbAdmin = getSupabase();
  const { data, error } = await sbAdmin
    .from('chat_conversations')
    .insert({
      user_id: userId,
      subject,
      order_id: orderId || null,
      product_id: productId || null,
      product_name: productName || null,
      product_image: productImage || null,
      archived: false,
      pinned: false,
      read: false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const conversation = {
    id: data.id,
    userId: data.user_id,
    orderId: data.order_id,
    productId: data.product_id,
    productName: data.product_name,
    productImage: data.product_image,
    subject: data.subject,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    archived: data.archived,
    pinned: data.pinned,
    read: data.read,
  };

  if (!conversation) {
    return Response.json({ error: 'Failed to create conversation' }, { status: 500 });
  }

  return Response.json(conversation);
}
