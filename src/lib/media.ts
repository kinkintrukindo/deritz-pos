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
 *
 * For large files, uses the file's Blob directly instead of converting to Buffer
 * to minimize memory usage on Vercel functions.
 */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const supabase = getSupabase();
  const isVideo = file.type.startsWith("video/");
  const ext = extensionFor(file, isVideo ? "mp4" : "jpg");
  const objectPath = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

  // Use file Blob directly for large files to avoid loading entire file into memory
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(objectPath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) throw new Error(`uploadMedia failed: ${error.message}`);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

/**
 * Deletes a file from Supabase Storage by URL.
 * Extracts the object path from the public URL and removes it.
 */
export async function deleteMedia(publicUrl: string): Promise<void> {
  const supabase = getSupabase();

  // Extract the object path from the public URL
  // URL format: https://...supabase.co/storage/v1/object/public/media/{objectPath}
  const urlParts = publicUrl.split("/object/public/media/");
  if (urlParts.length !== 2) {
    throw new Error(`Invalid media URL format: ${publicUrl}`);
  }

  const objectPath = urlParts[1];

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .remove([objectPath]);

  if (error) throw new Error(`deleteMedia failed: ${error.message}`);
}
