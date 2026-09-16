import { Link } from "@tanstack/react-router";
import { Gift, ShoppingCart } from "lucide-react";

import { formatPrice } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import type { ProductWithUrls } from "@/lib/products";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: ProductWithUrls }) {
  const { addItem } = useCart();
  const cover = product.imageUrls[0];

  return (
    <article className="lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center navy-panel">
            <Gift className="h-12 w-12 text-gold/70" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-navy-deep/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="truncate font-display text-base text-foreground sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-1 font-semibold text-navy sm:text-lg">{formatPrice(product.price)}</p>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {product.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>
        <div className="mt-auto grid gap-2 pt-1 sm:grid-cols-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-navy/30 text-navy hover:bg-accent"
          >
            <Link to="/product/$id" params={{ id: product.id }}>
              View
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-navy text-cream hover:bg-navy/90"
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            {product.stock > 0 ? "Add to cart" : "Out of stock"}
          </Button>
        </div>
      </div>
    </article>
  );
}
