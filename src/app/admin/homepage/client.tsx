'use client';

import { useEffect, useState } from 'react';
import { MediaUploader } from '@/components/MediaUploader';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('saved')) {
      addToast('✓ Homepage updated successfully!', 'success');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [addToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    addToast('⏳ Saving homepage...', 'info');

    const formData = new FormData(e.currentTarget);
    try {
      await updateHomepageAction(formData);
    } catch (error) {
      addToast('❌ Failed to save homepage', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-mist p-6">
      <MediaUploader
        name="heroMedia"
        label="Hero Image or Video"
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
        disabled={isSubmitting}
        className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : 'Save Homepage'}
      </button>
    </form>
  );
}
