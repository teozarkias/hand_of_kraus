"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getPaintingById } from "./paintings";
import { getTarotCardById } from "./tarot";
import type { PrintSizeId } from "./pricing";

export interface CartItem {
  paintingId: string;
  kind: "original" | "print" | "tarot";
  size?: PrintSizeId; // set when kind === "print" or "tarot"
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
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
    const exists =
      item.kind === "tarot"
        ? getTarotCardById(item.paintingId)
        : getPaintingById(item.paintingId);
    if (!exists) return;
    setItems((prev) => [...prev, item]);
  }

  function removeItem(index: number) {
    setItems((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, count: items.length }}
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
