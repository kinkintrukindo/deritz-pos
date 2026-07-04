'use client';

import { useRef, useState } from 'react';
import { useToast } from '@/components/Toast';

// Matches the Supabase Storage bucket's hard file_size_limit (50,000,000 bytes).
// Uploads above this are rejected by Supabase itself, so we check client-side
// to fail fast instead of waiting through a full upload just to get a 500.
const MAX_FILE_SIZE = 50 * 1000 * 1000;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function MediaUploader({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      addToast(`File too large. Max: ${formatFileSize(MAX_FILE_SIZE)}`, 'error');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setPreview(URL.createObjectURL(file));
    setUploadProgress(0);
    setIsUploading(false);

    // Store file in hidden input for form submission
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputRef.current.files = dataTransfer.files;
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs tracking-wide-label uppercase text-graphite block">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-mist hover:border-ink transition-colors p-6 text-center cursor-pointer rounded-lg"
      >
        {preview && !isUploading ? (
          <div className="space-y-2">
            {preview.includes('blob') ? (
              <video src={preview} className="h-24 w-full object-cover rounded mb-2" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-24 w-full object-cover rounded mb-2" />
            )}
            <p className="text-sm font-medium text-ink">{fileName}</p>
            <p className="text-xs text-graphite">{fileSize && formatFileSize(fileSize)}</p>
            <p className="text-xs text-gold">✓ Ready to upload</p>
          </div>
        ) : isUploading ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink">{fileName}</p>
            <div className="w-full bg-mist rounded-full h-2 overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-300"
                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gold font-medium">
              Uploading... {Math.round(uploadProgress)}%
            </p>
            <p className="text-xs text-graphite">{fileSize && formatFileSize(fileSize)}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-graphite text-sm">Drag & drop or click to select</p>
            <p className="text-xs text-graphite">Max size: {formatFileSize(MAX_FILE_SIZE)}</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer?.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
}
