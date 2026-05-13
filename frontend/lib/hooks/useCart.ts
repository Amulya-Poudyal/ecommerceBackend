"use client";

import { useCartStore } from "@/lib/store/cartStore";

export function useCart() {
  const store = useCartStore();

  return {
    cart: store.cart,
    items: store.items,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    totalItems: store.totalItems(),
    openCart: store.openCart,
    closeCart: store.closeCart,
    fetchCart: store.fetchCart,
    addItem: store.addItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
  };
}
