"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getPaintingById } from "./paintings";
import type { PrintSizeId } from "./pricing";

export interface CartItem {
  paintingId: string;
  kind: "original" | "print";
  size?: PrintSizeId; // only set when kind === "print"
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nocturne-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(function loadCart() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(
    function persistCart() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    },
    [items],
  );

  function addItem(item: CartItem) {
    if (!getPaintingById(item.paintingId)) return;
    setItems((prev) => [...prev, item]);
  }

  function removeItem(index: number) {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, count: items.length }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
