import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';
import { AdminMessagesClient } from '@/components/AdminMessagesClient';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export default async function AdminMessagesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_VALUE) {
    redirect('/admin');
  }

  // Fetch all conversations
  const supabase = getSupabase();
  const { data: conversations } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('archived', false)
    .order('pinned', { ascending: false })
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium text-ink tracking-tight">Messages</h1>
        <p className="text-sm text-graphite mt-1">Manage customer inquiries and conversations</p>
      </div>

      <AdminMessagesClient initialConversations={conversations || []} />
    </div>
  );
}
