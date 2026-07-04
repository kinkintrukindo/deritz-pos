import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import { AdminMessagesClient } from '@/components/AdminMessagesClient';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all conversations
  const { data: conversations } = await supabase
    .from('chat_conversations')
    .select('*')
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
