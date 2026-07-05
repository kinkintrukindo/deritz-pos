import Link from "next/link";
import { requireAdminSession, logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { getTransactionSettings } from "@/lib/transaction-settings";
import { TransactionSettingsClient } from "./client";

export default async function TransactionSettingsPage() {
  await requireAdminSession();
  const settings = await getTransactionSettings();

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Transaction Settings</h1>
        </div>
        <form action={logout}>
          <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
            Log out
          </button>
        </form>
      </div>

      <AdminNav active="transaction" />

      <div className="border border-mist p-8">
        <TransactionSettingsClient initialSettings={settings} />
      </div>

      <div className="mt-6 text-xs text-graphite space-y-1">
        <p>💡 <strong>Shipping:</strong> Control how shipping costs are calculated. Choose between Midtrans API (automatic) or manual rates.</p>
        <p>💡 <strong>Transaction Fee:</strong> Optional additional fee charged on top of order total (percentage or fixed amount).</p>
      </div>
    </div>
  );
}
