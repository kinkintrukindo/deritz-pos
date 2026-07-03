"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  addProduct,
  deleteProduct,
  saveProductImage,
  setProductPublished,
  setProductSoldOut,
  updateProduct,
} from "@/lib/products";
import { markOrderDelivered, markOrderProcessed, markOrderShipped } from "@/lib/orders";
import { saveSiteMedia, updateSiteSettings } from "@/lib/settings";
import {
  addCollection,
  deleteCollection,
  reorderCollections,
  updateCollection,
} from "@/lib/collections";
import type { ProductImage } from "@/lib/types";

const SESSION_COOKIE = "deritz_admin_session";
const SESSION_VALUE = "granted";

export async function verifyPasscode(formData: FormData) {
  const passcode = formData.get("passcode");
  const expected = process.env.ADMIN_PASSCODE ?? "110501";

  if (passcode !== expected) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin");
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (session?.value !== SESSION_VALUE) {
    redirect("/admin");
  }
}

async function parseImagesFromFormData(formData: FormData): Promise<ProductImage[]> {
  const count = Number(formData.get("imageCount") ?? 0);
  const images: ProductImage[] = [];

  for (let i = 0; i < count; i++) {
    const file = formData.get(`imageFile-${i}`);
    const existing = formData.get(`existingImageUrl-${i}`);
    const caption = String(formData.get(`caption-${i}`) ?? "");

    if (file instanceof File && file.size > 0) {
      images.push({ url: await saveProductImage(file), caption });
    } else if (typeof existing === "string" && existing) {
      images.push({ url: existing, caption });
    }
  }

  return images;
}

export async function createProductAction(formData: FormData) {
  await requireAdminSession();

  const images = await parseImagesFromFormData(formData);

  await addProduct({
    name: String(formData.get("name") ?? ""),
    collection: String(formData.get("collection") ?? ""),
    description: String(formData.get("description") ?? ""),
    basePriceIdr: Number(formData.get("basePriceIdr") ?? 0),
    images,
    published: formData.get("published") === "on",
    isNew: formData.get("isNew") === "on",
    isPromo: formData.get("isPromo") === "on",
  });

  redirect("/admin/dashboard");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdminSession();

  const images = await parseImagesFromFormData(formData);

  await updateProduct(id, {
    name: String(formData.get("name") ?? ""),
    collection: String(formData.get("collection") ?? ""),
    description: String(formData.get("description") ?? ""),
    basePriceIdr: Number(formData.get("basePriceIdr") ?? 0),
    images,
    published: formData.get("published") === "on",
    isNew: formData.get("isNew") === "on",
    isPromo: formData.get("isPromo") === "on",
    soldOut: formData.get("soldOut") === "on",
  });

  redirect("/admin/dashboard");
}

export async function togglePublishedAction(id: string, published: boolean, _formData: FormData) {
  await requireAdminSession();
  await setProductPublished(id, published);
  redirect("/admin/dashboard");
}

export async function toggleSoldOutAction(id: string, soldOut: boolean, _formData: FormData) {
  await requireAdminSession();
  await setProductSoldOut(id, soldOut);
  redirect("/admin/dashboard");
}

export async function deleteProductAction(id: string, _formData: FormData) {
  await requireAdminSession();
  await deleteProduct(id);
  redirect("/admin/dashboard");
}

export async function markProcessedAction(id: string, _formData: FormData) {
  await requireAdminSession();
  await markOrderProcessed(id);
  redirect("/admin/orders");
}

export async function markShippedAction(id: string, formData: FormData) {
  await requireAdminSession();
  const deliveryId = String(formData.get("deliveryId") ?? "").trim();
  if (!deliveryId) {
    redirect("/admin/orders?error=missing-delivery-id");
  }
  await markOrderShipped(id, deliveryId);
  redirect("/admin/orders");
}

export async function markDeliveredAction(id: string, _formData: FormData) {
  await requireAdminSession();
  await markOrderDelivered(id);
  redirect("/admin/orders");
}

export async function updateHomepageAction(formData: FormData) {
  await requireAdminSession();

  const mediaFile = formData.get("heroMedia");
  const patch: Parameters<typeof updateSiteSettings>[0] = {
    heroEyebrow: String(formData.get("heroEyebrow") ?? ""),
    heroHeadline: String(formData.get("heroHeadline") ?? ""),
    heroButtonLabel: String(formData.get("heroButtonLabel") ?? ""),
  };

  if (mediaFile instanceof File && mediaFile.size > 0) {
    const saved = await saveSiteMedia(mediaFile);
    patch.heroMediaUrl = saved.url;
    patch.heroMediaType = saved.mediaType;
  }

  await updateSiteSettings(patch);
  redirect("/admin/homepage?saved=1");
}

export async function addCollectionAction(formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/admin/collections?error=empty-name");
  }
  await addCollection(name);
  redirect("/admin/collections?saved=1");
}

export async function updateCollectionAction(id: string, formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/admin/collections?error=empty-name");
  }
  await updateCollection(id, name);
  redirect("/admin/collections?saved=1");
}

export async function deleteCollectionAction(id: string, _formData: FormData) {
  await requireAdminSession();
  await deleteCollection(id);
  redirect("/admin/collections");
}

export async function reorderCollectionsAction(formData: FormData) {
  await requireAdminSession();
  const orderJson = formData.get("order");
  if (typeof orderJson !== "string") {
    redirect("/admin/collections?error=invalid-order");
  }
  const ids = JSON.parse(orderJson) as string[];
  await reorderCollections(ids);
  redirect("/admin/collections?saved=1");
}
