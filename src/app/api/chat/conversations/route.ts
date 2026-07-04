import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserConversations, createConversation } from '@/lib/chat';

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

  const userId = user?.id || guestEmail;

  if (!user && !guestEmail) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { subject, orderId } = await request.json();

  if (!subject) {
    return Response.json({ error: 'Subject is required' }, { status: 400 });
  }

  const conversation = await createConversation(userId, subject, orderId);

  if (!conversation) {
    return Response.json({ error: 'Failed to create conversation' }, { status: 500 });
  }

  return Response.json(conversation);
}
