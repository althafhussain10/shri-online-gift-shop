import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { ProductWithUrls } from "@/lib/products";

type CartItem = {
  product: Pick<ProductWithUrls, "id" | "name" | "price" | "imageUrls" | "stock">;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: ProductWithUrls, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "shri-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const savedItems = JSON.parse(stored) as CartItem[];
        setItems(savedItems.filter((item) => item.product.stock > 0 && item.quantity > 0));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      items,
      itemCount,
      total,
      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return;
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                : item,
            );
          }
          return [
            ...current,
            {
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrls: product.imageUrls,
                stock: product.stock,
              },
              quantity: Math.min(quantity, product.stock),
            },
          ];
        });
      },
      updateQuantity: (id, quantity) => {
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.product.id !== id)
            : current.flatMap((item) => {
                if (item.product.id !== id) return [item];
                if (item.product.stock <= 0) return [];
                return [{ ...item, quantity: Math.min(quantity, item.product.stock) }];
              }),
        );
      },
      removeItem: (id) => setItems((current) => current.filter((item) => item.product.id !== id)),
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
