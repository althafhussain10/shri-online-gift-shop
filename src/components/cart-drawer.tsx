import { CreditCard, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { BRAND, cartOrderMessage, formatPrice, whatsappLink } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();
  const message = cartOrderMessage(
    items.map(({ product, quantity }) => ({ ...product, quantity })),
    total,
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-navy-deep/55"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-2xl text-navy">Your cart</h2>
            <p className="text-sm text-muted-foreground">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-md text-navy hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-gold" />
            <h3 className="mt-4 font-display text-xl text-navy">Your cart is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add gifts here before sending your order on WhatsApp.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 border-b border-border pb-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.imageUrls[0] && (
                      <img
                        src={product.imageUrls[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-navy">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease ${product.name} quantity`}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="grid h-7 w-7 place-items-center text-navy"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${product.name} quantity`}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="grid h-7 w-7 place-items-center text-navy"
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-muted-foreground underline hover:text-navy"
              >
                Clear cart
              </button>
            </div>

            <div className="border-t border-border bg-card px-5 py-5">
              <div className="rounded-lg border border-gold/40 bg-accent/50 p-3">
                <div className="flex gap-2">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
                  <div>
                    <p className="text-sm font-semibold text-navy">Payment details</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Payment is confirmed manually after you message us. We will share UPI or
                      bank-transfer details on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-lg font-semibold text-navy">
                <span>Estimated total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button
                asChild
                className="mt-4 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <a
                  href={whatsappLink(BRAND.phones[0]!, message)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                >
                  Send cart on WhatsApp
                </a>
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                No online payment is taken here.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
