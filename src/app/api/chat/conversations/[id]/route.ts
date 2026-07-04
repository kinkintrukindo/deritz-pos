import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getConversation, getConversationMessages } from '@/lib/chat';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();

  const isAdmin = cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;

  const conversation = await getConversation(id);

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  if (!isAdmin) {
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

    // Check authorization (user can only see their own conversation)
    if (conversation.userId !== userId) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const messages = await getConversationMessages(id);

  return Response.json({ conversation, messages });
}
