'use client';

import { useEffect } from 'react';
import { MediaDropzone } from '@/components/MediaDropzone';
import { AdminField } from '@/components/AdminField';
import { updateHomepageAction } from '@/app/admin/actions';
import { useToast } from '@/components/Toast';

export function HomepageForm({
  heroMediaUrl,
  heroMediaType,
  heroEyebrow,
  heroHeadline,
  heroButtonLabel,
}: {
  heroMediaUrl?: string;
  heroMediaType?: 'image' | 'video';
  heroEyebrow: string;
  heroHeadline: string;
  heroButtonLabel: string;
}) {
  const { addToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('saved')) {
      addToast('Homepage updated successfully!', 'success');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [addToast]);

  return (
    <form action={updateHomepageAction} className="space-y-4 border border-mist p-6">
      <MediaDropzone
        name="heroMedia"
        label="Hero Image or Video"
        currentUrl={heroMediaUrl}
        currentType={heroMediaType}
      />
      <AdminField label="Eyebrow Label" name="heroEyebrow" defaultValue={heroEyebrow} />
      <AdminField
        label="Headline"
        name="heroHeadline"
        textarea
        defaultValue={heroHeadline}
      />
      <AdminField
        label="Button Label"
        name="heroButtonLabel"
        defaultValue={heroButtonLabel}
      />
      <button
        type="submit"
        className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
      >
        Save Homepage
      </button>
    </form>
  );
}
