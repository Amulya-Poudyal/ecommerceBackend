/**
 * server-data.ts — thin helpers for Server Component data fetching.
 * Uses plain fetch() (no next/headers) since all these endpoints are PUBLIC.
 * This file is safe to import in RSC pages.
 */
import { API_BASE } from "@/lib/constants";
import { Product, Category, Brand, Review } from "@/types";

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

export const serverData = {
  getProducts: (params?: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "" && v !== null) sp.set(k, String(v));
      }
    }
    const q = sp.toString();
    return get<Product[]>(`/products${q ? `?${q}` : ""}`, { next: { revalidate: 60 } });
  },

  getProductById: (id: string | number) =>
    get<Product>(`/products/${id}`, { cache: "no-store" }),

  getCategories: () =>
    get<Category[]>("/categories", { next: { revalidate: 300 } }),

  getBrands: () =>
    get<Brand[]>("/brands", { next: { revalidate: 300 } }),

  getReviews: (productId: string | number) =>
    get<Review[]>(`/reviews/${productId}`, { next: { revalidate: 120 } }),
};
