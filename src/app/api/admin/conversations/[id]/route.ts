import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_VALUE) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sbAdmin = getSupabase();

  // Delete associated messages first
  await sbAdmin.from('chat_messages').delete().eq('conversation_id', id);

  // Delete conversation
  const { error } = await sbAdmin
    .from('chat_conversations')
    .delete()
    .eq('id', id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
