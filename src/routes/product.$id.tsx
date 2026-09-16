import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Gift, Minus, Plus, ShoppingCart } from "lucide-react";

import { formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { fetchProduct } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Gift Details | SHRI Online Gift Shop Erode" },
      {
        name: "description",
        content:
          "See gift details, price and photos, then order instantly on WhatsApp from SHRI Online Gift Shop, Erode.",
      },
      { property: "og:title", content: "Gift Details | SHRI Online Gift Shop" },
      {
        property: "og:description",
        content: "Gift details and instant WhatsApp ordering from Erode.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        {isLoading && <div className="mt-8 h-96 animate-pulse rounded-2xl bg-muted" />}

        {!isLoading && !product && (
          <p className="py-24 text-center text-muted-foreground">
            This gift is no longer available.
          </p>
        )}

        {product && (
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
                {product.imageUrls[imgIndex] ? (
                  <img
                    src={product.imageUrls[imgIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center navy-panel">
                    <Gift className="h-16 w-16 text-gold/70" />
                  </div>
                )}
              </div>
              {product.imageUrls.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {product.imageUrls.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      className={cn(
                        "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                        i === imgIndex ? "border-gold" : "border-border",
                      )}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-navy">
                {product.category}
              </span>
              <h1 className="mt-4 font-display text-3xl text-navy sm:text-4xl">{product.name}</h1>
              <p className="mt-3 text-3xl font-semibold text-navy">{formatPrice(product.price)}</p>
              <div className="gold-rule my-6" />
              <p className="whitespace-pre-line text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {product.stock > 0 ? `In stock: ${product.stock}` : "Made to order"}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-medium text-navy">Quantity</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="grid h-10 w-10 place-items-center text-navy"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="grid h-10 w-10 place-items-center text-navy"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full bg-navy text-cream hover:bg-navy/90"
                  onClick={() => addItem(product, qty)}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to cart
                </Button>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Payment details and order confirmation are handled personally on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
