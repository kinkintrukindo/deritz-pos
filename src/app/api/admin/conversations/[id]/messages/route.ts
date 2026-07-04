import { cookies } from 'next/headers';
import { getConversation, sendMessage } from '@/lib/chat';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_VALUE) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const conversation = await getConversation(id);

  if (!conversation) {
    return Response.json({ error: 'Conversation not found' }, { status: 404 });
  }

  const { content } = await request.json();

  if (!content || !content.trim()) {
    return Response.json({ error: 'Content is required' }, { status: 400 });
  }

  const message = await sendMessage(id, 'admin', content.trim(), true);

  if (!message) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }

  return Response.json(message);
}
