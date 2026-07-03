import "server-only";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

function extensionFor(file: File, fallback: string): string {
  const fromName = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  return (fromName || MIME_EXTENSIONS[file.type] || fallback).toLowerCase();
}

/**
 * Uploads a file to the public Supabase Storage bucket under `folder/` and
 * returns its public URL. Replaces the old local `public/` filesystem writes,
 * which are read-only on Vercel.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const supabase = getSupabase();
  const isVideo = file.type.startsWith("video/");
  const ext = extensionFor(file, isVideo ? "mp4" : "jpg");
  const objectPath = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) throw new Error(`uploadMedia failed: ${error.message}`);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}
