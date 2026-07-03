"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/types";

type GalleryItem = {
  key: string;
  existingUrl?: string;
  file?: File;
  previewUrl: string;
  caption: string;
};

let uidCounter = 0;
function nextKey(): string {
  uidCounter += 1;
  return `img-${uidCounter}`;
}

export function ImageGalleryEditor({ initial = [] }: { initial?: ProductImage[] }) {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    initial.map((img) => ({
      key: nextKey(),
      existingUrl: img.url,
      previewUrl: img.url,
      caption: img.caption,
    }))
  );
  const fileInputRefs = useRef(new Map<string, HTMLInputElement | null>());

  useEffect(() => {
    for (const item of items) {
      if (item.file) {
        const el = fileInputRefs.current.get(item.key);
        if (el && el.files && el.files.length === 0) {
          const dt = new DataTransfer();
          dt.items.add(item.file);
          el.files = dt.files;
        }
      }
    }
  }, [items]);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const next = Array.from(files).map((file) => ({
      key: nextKey(),
      file,
      previewUrl: URL.createObjectURL(file),
      caption: "",
    }));
    setItems((prev) => [...prev, ...next]);
  }

  function updateCaption(key: string, caption: string) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, caption } : it)));
  }

  function removeItem(key: string) {
    fileInputRefs.current.delete(key);
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  return (
    <div>
      <span className="text-xs tracking-wide-label uppercase text-graphite">Images</span>
      <input type="hidden" name="imageCount" value={items.length} />

      <div className="mt-1.5 space-y-3">
        {items.map((item, i) => (
          <div key={item.key} className="flex gap-3 border border-mist p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.previewUrl} alt="" className="h-20 w-16 object-cover shrink-0 bg-surface" />
            <div className="flex-1 space-y-1">
              {i === 0 && (
                <span className="text-[10px] tracking-wide-label uppercase text-gold">Cover Image</span>
              )}
              <input
                type="text"
                placeholder="Caption (optional)"
                defaultValue={item.caption}
                name={`caption-${i}`}
                onChange={(e) => updateCaption(item.key, e.target.value)}
                className="w-full border border-mist px-2 py-1.5 text-sm bg-paper focus:outline-none focus:border-ink"
              />
              {item.existingUrl && !item.file && (
                <input type="hidden" name={`existingImageUrl-${i}`} value={item.existingUrl} />
              )}
              {item.file && (
                <input
                  ref={(el) => {
                    fileInputRefs.current.set(item.key, el);
                  }}
                  type="file"
                  name={`imageFile-${i}`}
                  className="hidden"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.key)}
              className="text-xs text-graphite hover:text-red-600 underline self-start"
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-graphite">No images yet — add at least one below.</p>
        )}
      </div>

      <label className="mt-3 inline-block border border-dashed border-mist px-4 py-2 text-xs text-graphite cursor-pointer hover:border-ink transition-colors">
        + Add Image(s)
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <p className="text-xs text-graphite mt-2">
        The first image is used as the cover photo across the site.
      </p>
    </div>
  );
}
