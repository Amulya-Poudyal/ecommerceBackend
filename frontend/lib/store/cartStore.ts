"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Cart } from "@/types";
import { cartApi } from "@/lib/api/cart";

interface CartStore {
  cart: Cart | null;
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  // Actions
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, variantId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
  // Derived
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      items: [],
      isOpen: false,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const data = await cartApi.get();
          set({ cart: data.cart, items: data.items });
        } catch {
          // User might not be logged in — silently ignore
          set({ cart: null, items: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId, variantId, quantity) => {
        set({ isLoading: true });
        try {
          await cartApi.add({ product_id: productId, variant_id: variantId, quantity });
          await get().fetchCart();
          set({ isOpen: true });
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          await cartApi.update(itemId, quantity);
          await get().fetchCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          await cartApi.remove(itemId);
          set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }));
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartApi.clear();
          set({ items: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set({ cart: null, items: [], isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items, cart: state.cart }),
    }
  )
);
