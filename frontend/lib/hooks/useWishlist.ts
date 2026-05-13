"use client";

import { useState, useCallback } from "react";


const KEY = "wishlist";

function read(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(ids: number[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>(() => read());

  const toggle = useCallback((productId: number) => {
    setIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      write(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => ids.includes(productId),
    [ids]
  );

  const clear = useCallback(() => {
    setIds([]);
    localStorage.removeItem(KEY);
  }, []);

  return { ids, toggle, isWishlisted, clear, count: ids.length };
}
