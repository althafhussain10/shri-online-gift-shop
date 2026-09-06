import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Pencil, Plus, Store, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/shri-logo.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { BRAND, CATEGORIES, formatPrice } from "@/lib/brand";
import {
  deleteProduct,
  fetchAllProducts,
  resolveImageUrls,
  uploadProductImages,
  type ProductWithUrls,
} from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | SHRI Online Gift Shop" },
      { name: "description", content: "Manage the SHRI Online Gift Shop product catalogue." },
      { property: "og:title", content: "Admin Dashboard | SHRI Online Gift Shop" },
      { property: "og:description", content: "Private product management dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id?: string;
  name: string;
  category: string;
  price: string;
  description: string;
  stock: string;
  images: string[];
};

const emptyForm: FormState = {
  name: "",
  category: CATEGORIES[0],
  price: "",
  description: "",
  stock: "0",
  images: [],
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("claim_admin");
      setIsAdmin(Boolean(data));
    })();
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAllProducts,
    enabled: isAdmin === true,
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function openEdit(p: ProductWithUrls) {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      price: String(p.price),
      description: p.description,
      stock: String(p.stock),
      images: p.images ?? [],
    });
    setPreviews(p.imageUrls);
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length || !form) return;
    const list = Array.from(files).filter((f) =>
      ["image/jpeg", "image/jpg", "image/png"].includes(f.type),
    );
    if (list.length !== files.length) toast.error("Only JPG, JPEG and PNG images are allowed.");
    if (!list.length) return;
    setUploading(true);
    try {
      const paths = await uploadProductImages(list);
      const urls = await resolveImageUrls(paths);
      setForm({ ...form, images: [...form.images, ...paths] });
      setPreviews((p) => [...p, ...urls]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(i: number) {
    if (!form) return;
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price) || 0,
        description: form.description.trim(),
        stock: Number(form.stock) || 0,
        images: form.images,
      };
      const { error } = form.id
        ? await supabase.from("products").update(payload).eq("id", form.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(null);
      setPreviews([]);
      await queryClient.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: ProductWithUrls) {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id, p.images ?? []);
      toast.success("Product deleted");
      await queryClient.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete product");
    }
  }

  if (isAdmin === null) {
    return (
      <div className="navy-panel grid min-h-screen place-items-center text-cream">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="navy-panel grid min-h-screen place-items-center px-4 text-center text-cream">
        <div>
          <h1 className="font-display text-3xl gold-text">Access restricted</h1>
          <p className="mt-3 text-cream/75">This account is not a shop administrator.</p>
          <Button onClick={handleSignOut} className="mt-6 bg-gold text-navy-deep hover:bg-gold-soft">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="navy-panel border-b border-gold/25">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo.url}
              alt="Shop logo"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gold/50"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-lg gold-text">Admin dashboard</p>
              <p className="truncate text-[11px] uppercase tracking-[0.2em] text-cream/60">
                {BRAND.name}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/" })}
              className="border-gold/40 bg-transparent text-gold hover:bg-gold hover:text-navy-deep"
            >
              <Store className="mr-1.5 h-4 w-4" /> <span className="hidden sm:inline">Storefront</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSignOut}
              className="bg-gold text-navy-deep hover:bg-gold-soft"
            >
              <LogOut className="mr-1.5 h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-navy">Products ({products.length})</h2>
            <div className="gold-rule mt-2 w-28" />
          </div>
          <Button
            onClick={() => {
              setForm({ ...emptyForm });
              setPreviews([]);
            }}
            className="bg-navy text-cream hover:bg-navy-soft"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add product
          </Button>
        </div>

        {form && (
          <form
            onSubmit={save}
            className="rise mt-6 space-y-4 rounded-2xl border border-gold/40 bg-card p-6 shadow-sm"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                maxLength={1500}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="images">Product images (JPG, JPEG, PNG)</Label>
              <Input
                id="images"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={(e) => onFiles(e.target.files)}
                className="mt-1.5"
              />
              {uploading && (
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                </p>
              )}
              {previews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {previews.map((url, i) => (
                    <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-navy-deep/85 text-cream"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={saving} className="bg-navy text-cream hover:bg-navy-soft">
                {saving ? "Saving…" : form.id ? "Save changes" : "Add product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setForm(null);
                  setPreviews([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-3">
          {isLoading && <div className="h-32 animate-pulse rounded-2xl bg-muted" />}
          {products.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {p.imageUrls[0] && (
                  <img src={p.imageUrls[0]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-navy">{p.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {p.category} · {formatPrice(p.price)} · stock {p.stock}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="icon" variant="outline" aria-label="Edit" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Delete"
                  onClick={() => remove(p)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && products.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              No products yet — add your first gift.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
