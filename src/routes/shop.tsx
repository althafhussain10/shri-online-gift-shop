import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CATEGORIES } from "@/lib/brand";
import { fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

type Search = { category?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search['category'] === "string" ? { category: search['category'] } : {},
  head: () => ({
    meta: [
      { title: "Shop Gifts Online | SHRI Online Gift Shop Erode" },
      {
        name: "description",
        content:
          "Browse birthday, anniversary, surprise, kids and all-occasion gifts. Order instantly on WhatsApp from Erode.",
      },
      { property: "og:title", content: "Shop Gifts | SHRI Online Gift Shop" },
      {
        property: "og:description",
        content: "Every occasion covered — browse our full gift collection and order on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const [active, setActive] = useState<string>(category ?? "All");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="navy-panel py-14 text-center text-cream">
        <h1 className="font-display text-4xl gold-text sm:text-5xl">Our gift collection</h1>
        <div className="gold-rule mx-auto my-4 w-48" />
        <p className="px-4 text-cream/75">All types of gifts for every occasion</p>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active === c
                  ? "border-gold bg-navy text-cream"
                  : "border-border bg-card text-navy hover:border-gold",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
              ))
            : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {!isLoading && filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No gifts in this category yet — message us on WhatsApp and we'll help you choose.
          </p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
