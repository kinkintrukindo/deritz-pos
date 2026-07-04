import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getAdminConversations } from '@/lib/chat';
import { AdminMessagesClient } from '@/components/AdminMessagesClient';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export default async function AdminMessagesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_VALUE) {
    redirect('/admin');
  }

  const allConversations = await getAdminConversations();
  const conversations = [...allConversations].sort((a, b) => {
    if (a.pinned !== b.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div>
      <AdminNav active="messages" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium text-ink tracking-tight">Messages</h1>
          <p className="text-sm text-graphite mt-1">Manage customer inquiries and conversations</p>
        </div>

        <AdminMessagesClient initialConversations={conversations || []} />
      </div>
    </div>
  );
}
