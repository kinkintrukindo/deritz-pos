import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getConversation, sendMessage } from '@/lib/chat';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  if (!userId) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }

  const conversation = await getConversation(id);

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Check authorization (user can only message their own conversation)
  if (conversation.userId !== userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { content } = await request.json();

  if (!content || !content.trim()) {
    return Response.json({ error: 'Content is required' }, { status: 400 });
  }

  const message = await sendMessage(id, userId, content.trim(), false);

  if (!message) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return Response.json(message);
}
