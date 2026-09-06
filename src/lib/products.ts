import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
};

const BUCKET = "product-images";

const urlCache = new Map<string, string>();

export async function resolveImageUrls(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const missing = paths.filter((p) => !urlCache.has(p));
  if (missing.length) {
    const { data } = await supabase.storage.from(BUCKET).createSignedUrls(missing, 60 * 60 * 24 * 7);
    data?.forEach((item) => {
      if (item.signedUrl && item.path) urlCache.set(item.path, item.signedUrl);
    });
  }
  return paths.map((p) => urlCache.get(p)).filter((u): u is string => Boolean(u));
}

export type ProductWithUrls = Product & { imageUrls: string[] };

async function withUrls(rows: Product[]): Promise<ProductWithUrls[]> {
  const all = rows.flatMap((r) => r.images ?? []);
  await resolveImageUrls(all);
  return rows.map((r) => ({
    ...r,
    imageUrls: (r.images ?? []).map((p) => urlCache.get(p)).filter((u): u is string => Boolean(u)),
  }));
}

export async function fetchProducts(): Promise<ProductWithUrls[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withUrls((data ?? []) as Product[]);
}

export async function fetchAllProducts(): Promise<ProductWithUrls[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withUrls((data ?? []) as Product[]);
}

export async function fetchProduct(id: string): Promise<ProductWithUrls | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [one] = await withUrls([data as Product]);
  return one ?? null;
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const paths: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    paths.push(path);
  }
  return paths;
}

export async function deleteProduct(id: string, images: string[]) {
  if (images.length) await supabase.storage.from(BUCKET).remove(images);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
