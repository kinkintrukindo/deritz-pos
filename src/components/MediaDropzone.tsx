"use client";

import { useRef, useState } from "react";

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB hard limit
const WARN_FILE_SIZE = 100 * 1024 * 1024; // 100MB warning threshold

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

export function MediaDropzone({
  name,
  label,
  currentUrl,
  currentType,
}: {
  name: string;
  label: string;
  currentUrl?: string;
  currentType?: "image" | "video";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [isVideo, setIsVideo] = useState(currentType === "video");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setError(null);
    setWarning(null);
    setUploadProgress(0);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }

    if (file.size > WARN_FILE_SIZE) {
      setWarning(`Large file (${formatFileSize(file.size)}). Upload may take several minutes.`);
    }

    setFileName(file.name);
    setFileSize(file.size);
    setPreview(URL.createObjectURL(file));
    setIsVideo(file.type.startsWith("video/"));
    setIsUploading(true);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 500);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      inputRef.current.files = dt.files;
      handleFiles(dt.files);
    }
  }

  return (
    <div>
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mt-1.5 flex flex-col items-center justify-center gap-3 border border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-ink bg-surface" : "border-mist hover:border-ink"
        }`}
      >
        {preview ? (
          isVideo ? (
            <video src={preview} className="h-32 w-full object-cover" muted autoPlay loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="h-32 w-full object-cover" />
          )
        ) : (
          <span className="text-graphite text-xs leading-relaxed">
            Drag &amp; drop an image or video here, or click to browse
          </span>
        )}
        {fileName && (
          <div className="text-xs space-y-1">
            <span className="text-ink block">{fileName}</span>
            {fileSize && <span className="text-graphite block">{formatFileSize(fileSize)}</span>}
            {isUploading && uploadProgress > 0 && (
              <div className="w-full bg-mist rounded-full h-1.5 overflow-hidden mt-2">
                <div
                  className="bg-gold h-full transition-all duration-300"
                  style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                />
              </div>
            )}
            {isUploading && (
              <span className="text-gold block font-medium">
                {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Processing...'}
              </span>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {warning && <p className="text-xs text-amber-600 mt-2">⚠ {warning}</p>}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-graphite mt-2">
        Leave empty to keep the current hero media. Max file size: {formatFileSize(MAX_FILE_SIZE)}
      </p>
    </div>
  );
}
