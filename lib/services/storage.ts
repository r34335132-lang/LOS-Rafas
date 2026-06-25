import * as FileSystem from "expo-file-system";

import { supabase } from "@/lib/supabase";

export type StorageBucket = "league-assets" | "player-photos" | "generated-cards";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function extensionFromUri(uri: string) {
  const clean = uri.split("?")[0] ?? uri;
  const ext = clean.split(".").pop()?.toLowerCase();
  return ext && ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
}

function contentTypeFromExtension(ext: string) {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

export async function uploadImageToSupabase({
  bucket,
  uri,
  folder,
}: {
  bucket: StorageBucket;
  uri: string;
  folder: string;
}) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) throw new Error("No se encontró la imagen seleccionada");
  const size = "size" in info ? info.size : undefined;
  if (typeof size === "number" && size > MAX_IMAGE_BYTES) {
    throw new Error("La imagen supera el límite de 8 MB");
  }

  const ext = extensionFromUri(uri);
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, blob, {
      cacheControl: "3600",
      contentType: contentTypeFromExtension(ext),
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
