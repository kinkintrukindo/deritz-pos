import { getSiteSettings } from "@/lib/settings";
import { requireAdminSession, updateHomepageAction, logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/AdminNav";
import { AdminField } from "@/components/AdminField";
import { MediaDropzone } from "@/components/MediaDropzone";

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminSession();
  const { saved } = await searchParams;
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

      {saved && (
        <p className="text-xs text-gold mb-4">Homepage updated.</p>
      )}

      <form action={updateHomepageAction} className="space-y-4 border border-mist p-6">
        <MediaDropzone
          name="heroMedia"
          label="Hero Image or Video"
          currentUrl={settings.heroMediaUrl}
          currentType={settings.heroMediaType}
        />
        <AdminField label="Eyebrow Label" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
        <AdminField
          label="Headline"
          name="heroHeadline"
          textarea
          defaultValue={settings.heroHeadline}
        />
        <AdminField
          label="Button Label"
          name="heroButtonLabel"
          defaultValue={settings.heroButtonLabel}
        />
        <button
          type="submit"
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
        >
          Save Homepage
        </button>
      </form>
    </div>
  );
}
