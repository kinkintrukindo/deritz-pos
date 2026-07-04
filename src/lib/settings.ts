import type { SiteSettings } from "@/lib/types";
import { SUPABASE_KEYS } from "@/lib/constants";
import { readJson, writeJson } from "@/lib/store";
import { uploadMedia } from "@/lib/media";

const DEFAULT_SETTINGS: SiteSettings = {
  heroMediaUrl: "/hero/premium-blush-train-v2.jpg",
  heroMediaType: "image",
  heroEyebrow: "Made to Measure",
  heroHeadline: "Heritage tailoring for the modern bride",
  heroButtonLabel: "Explore the Collection",
  featuredProductIds: [],
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const stored = await readJson<Partial<SiteSettings> | null>(SUPABASE_KEYS.SETTINGS, null);
  return { ...DEFAULT_SETTINGS, ...(stored ?? {}) };
}

export async function updateSiteSettings(patch: Partial<SiteSettings>): Promise<void> {
  const current = await getSiteSettings();
  await writeJson(SUPABASE_KEYS.SETTINGS, { ...current, ...patch });
}

export async function saveSiteMedia(
  file: File
): Promise<{ url: string; mediaType: "image" | "video" }> {
  const url = await uploadMedia(file, "hero");
  return { url, mediaType: file.type.startsWith("video/") ? "video" : "image" };
}
