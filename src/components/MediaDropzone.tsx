"use client";

import { useRef, useState } from "react";

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
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setIsVideo(file.type.startsWith("video/"));
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
        {fileName && <span className="text-xs text-ink">{fileName}</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-graphite mt-2">Leave empty to keep the current hero media.</p>
    </div>
  );
}
