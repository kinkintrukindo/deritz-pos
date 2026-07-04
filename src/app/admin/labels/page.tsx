import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSupabase } from '@/lib/supabase';
import { AdminLabelsClient } from '@/components/AdminLabelsClient';
import { AdminNav } from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'deritz_admin_session';
const SESSION_VALUE = 'granted';

export default async function AdminLabelsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session?.value !== SESSION_VALUE) {
    redirect('/admin');
  }

  const supabase = getSupabase();

  // Fetch all labels
  const { data: labels } = await supabase
    .from('product_labels')
    .select('*')
    .order('sort_order', { ascending: true });

  // Initialize default labels if none exist
  if (labels && labels.length === 0) {
    const defaultLabels = [
      { name: 'New', color: '#9c8438', style: 'emboss', sort_order: 0, active: true },
      { name: 'Discount', color: '#17181a', style: 'emboss', sort_order: 1, active: true },
    ];

    for (const label of defaultLabels) {
      await supabase.from('product_labels').insert(label);
    }

    const { data: newLabels } = await supabase
      .from('product_labels')
      .select('*')
      .order('sort_order', { ascending: true });

    return (
      <div>
        <AdminNav active="labels" />
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-medium text-ink tracking-tight">Product Labels</h1>
            <p className="text-sm text-graphite mt-1">Create and manage product badge labels</p>
          </div>

          <AdminLabelsClient initialLabels={newLabels || []} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNav active="labels" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-medium text-ink tracking-tight">Product Labels</h1>
          <p className="text-sm text-graphite mt-1">Create and manage product badge labels</p>
        </div>

        <AdminLabelsClient initialLabels={labels || []} />
      </div>
    </div>
  );
}
