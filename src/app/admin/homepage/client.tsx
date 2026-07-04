'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('saved')) {
      addToast('✓ Homepage updated successfully!', 'success');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [addToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData(e.currentTarget);
      const mediaFile = formData.get('heroMedia') as File | null;

      // If there's a media file, upload it first to get real progress
      if (mediaFile && mediaFile.size > 0) {
        addToast('⏳ Uploading media...', 'info');

        const uploadFormData = new FormData();
        uploadFormData.append('file', mediaFile);
        uploadFormData.append('folder', 'hero');

        // Use XMLHttpRequest to get real upload progress
        const response = await new Promise<{
          url: string;
          mediaType: 'image' | 'video';
        }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setUploadProgress(Math.round(progress));
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              setUploadProgress(100);
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch {
                reject(new Error('Invalid upload response'));
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
          });

          xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
          });

          xhr.open('POST', '/api/upload-media');
          xhr.send(uploadFormData);
        });

        // Store the uploaded URL in the form as a hidden field
        const urlInput = document.createElement('input');
        urlInput.type = 'hidden';
        urlInput.name = 'uploadedMediaUrl';
        urlInput.value = response.url;
        formRef.current?.appendChild(urlInput);

        // Remove media file from form since it's already uploaded
        formData.delete('heroMedia');
        addToast('✓ Media uploaded successfully', 'success');
      }

      setUploadProgress(0);
      addToast('⏳ Saving homepage...', 'info');

      // Now submit the form with updated data
      const finalFormData = new FormData(formRef.current!);
      await updateHomepageAction(finalFormData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save';
      addToast(`❌ ${message}`, 'error');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 border border-mist p-6">
      <MediaUploader
        name="heroMedia"
        label="Hero Image or Video"
      />

      {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="w-full bg-mist rounded-full h-2 overflow-hidden">
            <div
              className="bg-gold h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gold font-medium text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

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
        {isSubmitting && uploadProgress > 0 && uploadProgress < 100
          ? `Uploading... ${uploadProgress}%`
          : isSubmitting
            ? 'Saving...'
            : 'Save Homepage'}
      </button>
    </form>
  );
}
