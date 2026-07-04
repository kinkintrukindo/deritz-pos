import { getSiteSettings } from "@/lib/settings";
import { requireAdminSession, logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { HomepageForm } from "./client";

export default async function AdminHomepagePage() {
  await requireAdminSession();
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl px-6 lg:px-10 py-14">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">
            De Ritz Atelier
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Homepage</h1>
        </div>
        <form action={logout}>
          <button className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline">
            Log out
          </button>
        </form>
      </div>

      <AdminNav active="homepage" />

      <HomepageForm
        heroMediaUrl={settings.heroMediaUrl}
        heroMediaType={settings.heroMediaType}
        heroEyebrow={settings.heroEyebrow}
        heroHeadline={settings.heroHeadline}
        heroButtonLabel={settings.heroButtonLabel}
      />
    </div>
  );
}
